import Color from '../../core/Color';
import Vector3 from '../../math/Vector3';
import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';
import ShaderFunction from '../../renderer/graphics/shader/ShaderFunction';

export default class LightMaterial extends Material {
    constructor() {
        super();
        this.culling = Material.culling.back;
        this.depth = Material.depth.less;
        this.ambientColor = Color.white;
        this.diffuseColor = Color.white;
        this.specularColor = Color.white;
        this.emissiveColor = Color.black;

        this.shadowMap = null;

        this.shininess = 32;

        this.directionalLigthsCount = 0;
        this.pointLigthsCount = 0;
        this.spotLigthsCount = 0;

        const vColor = Parameter.vector4('v_' + Material.parameters.color, Parameter.qualifier.out);
        const vPosition = Parameter.vector3('v_' + Material.parameters.position, Parameter.qualifier.out);
        const vNormal = Parameter.vector3('v_' + Material.parameters.normal, Parameter.qualifier.out);
        const vUV = Parameter.vector2('v_' + Material.parameters.uv, Parameter.qualifier.out);
        const vDistance = Parameter.number('v_' + Material.parameters.fogDistance, Parameter.qualifier.out);
        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    Material.parameters.projectionMatrix,
                    Material.parameters.vertexMatrix,
                    Material.parameters.position)),
            Operation.equal(vDistance, Operation.selection(Shader.parameters.output, '.w')),
            Operation.equal(
                vNormal,
                Operation.normalize(
                    Operation.toVector3(Operation.multiply(
                        Material.parameters.normalMatrix,
                        Material.parameters.normal)))),
            Operation.equal(vPosition, Operation.toVector3(Operation.multiply(
                Material.parameters.vertexMatrix,
                Material.parameters.position))),
            Operation.equal(vColor, Material.parameters.color),
            Operation.equal(vUV, Material.parameters.uv), 
        ]);
    }

    get fragmentShader(){
        this.pointLightsCount = this.parameters[LightMaterial.parameters.pointLightAmbientStrength.name]?.length || 0;
        this.directionalLigthsCount = this.parameters[LightMaterial.parameters.directionalLightAmbientStrength.name]?.length || 0;
        this.spotLigthsCount = this.parameters[LightMaterial.parameters.spotLightAmbientStrength.name]?.length || 0;
        if (!this._fragmentShader) {
            const vColor = Parameter.vector4('v_' + Material.parameters.color, Parameter.qualifier.out);
            const vPosition = Parameter.vector3('v_' + Material.parameters.position, Parameter.qualifier.out);
            const vNormal = Parameter.vector3('v_' + Material.parameters.normal, Parameter.qualifier.out);
            const vUV = Parameter.vector2('v_' + Material.parameters.uv, Parameter.qualifier.out);
            const vDistance = Parameter.number('v_' + Material.parameters.fogDistance, Parameter.qualifier.out);
            const normal = Parameter.vector3('normal');
            const fragmentColor = Parameter.vector4('fragmentColor');
            const fragmentRGB = Operation.selection(fragmentColor, '.rgb');
            const color = Parameter.vector3('color');
            const nCameraPosition = Parameter.vector3('nCameraPosition');
            const hasLight = this.directionalLigthsCount || this.pointLightsCount || this.spotLigthsCount;
            const operations = [
                Operation.equal(Operation.declare(normal), Operation.normalize(vNormal)),
                Operation.equal(Operation.declare(nCameraPosition), Operation.normalize(Operation.substract(Material.parameters.cameraPosition, vPosition))),
                Operation.equal(Operation.declare(fragmentColor), vColor),
                Operation.equal(Operation.declare(color), new Vector3())];
            if (this.texture) {
                operations.push(Operation.addTo(fragmentColor, Operation.read(Material.parameters.texture, vUV)))
            }
            if (hasLight) {
                const calculateLight = LightMaterial.shaderFunction.calculateLight();
                const materialAmbient = Parameter.vector3('materialAmbient');
                operations.push(Operation.equal(
                    Operation.declare(materialAmbient),
                    this.ambientTexture ?
                        Operation.add(
                            Operation.selection(Operation.read(LightMaterial.parameters.ambientTexture, vUV), '.stp'),
                            LightMaterial.parameters.ambientColor)
                        : LightMaterial.parameters.ambientColor));
                const materialDiffuse = Parameter.vector3('materialDiffuse');
                operations.push(Operation.equal(
                    Operation.declare(materialDiffuse),
                    this.diffuseTexture ?
                        Operation.add(
                            Operation.selection(Operation.read(LightMaterial.parameters.diffuseTexture, vUV), '.stp'),
                            LightMaterial.parameters.diffuseColor)
                        : LightMaterial.parameters.diffuseColor));
                const materialEmissive = Parameter.vector3('materialEmissive');
                operations.push(Operation.equal(
                    Operation.declare(materialEmissive),
                    this.emissiveTexture ?
                        Operation.add(
                            Operation.selection(Operation.read(LightMaterial.parameters.emissiveTexture, vUV), '.stp'),
                            LightMaterial.parameters.emissiveColor)
                        : LightMaterial.parameters.emissiveColor));
                const materialSpecular = Parameter.vector3('materialSpecular');
                operations.push(Operation.equal(
                    Operation.declare(materialSpecular),
                    this.specularTexture ?
                        Operation.add(
                            Operation.selection(Operation.read(LightMaterial.parameters.specularTexture, vUV), '.stp'),
                            LightMaterial.parameters.specularColor)
                        : LightMaterial.parameters.specularColor));

                if (this.directionalLigthsCount) {
                    LightMaterial.parameters.directionalLightColor.length = this.directionalLigthsCount;
                    LightMaterial.parameters.directionalLightDirection.length = this.directionalLigthsCount;
                    LightMaterial.parameters.directionalLightAmbientStrength.length = this.directionalLigthsCount;
                    operations.push(
                        Operation.for('int i = 0', 'i < ' + this.directionalLigthsCount, 'i++',
                            Operation.addTo(color, Operation.do(calculateLight, [
                                Operation.selection(LightMaterial.parameters.directionalLightDirection, '[i]'),
                                Operation.selection(LightMaterial.parameters.directionalLightColor, '[i]'),
                                Operation.selection(LightMaterial.parameters.directionalLightAmbientStrength, '[i]'),
                                materialAmbient,
                                materialDiffuse,
                                materialSpecular,
                                materialEmissive,
                                nCameraPosition,
                                normal
                            ]))
                        ));
                }
                if (this.pointLightsCount) {
                    LightMaterial.parameters.pointLightColor.length = this.pointLightsCount;
                    LightMaterial.parameters.pointLightPosition.length = this.pointLightsCount;
                    LightMaterial.parameters.pointLightAmbientStrength.length = this.pointLightsCount;
                    LightMaterial.parameters.pointLightIntensity.length = this.pointLightsCount;
                    const lightDirection = Parameter.vector3('lightDirection');
                    const lightDistance = Parameter.vector3('lightDistance');
                    const attenuation = Parameter.number('attenuation');
                    const intensity = Operation.selection(LightMaterial.parameters.pointLightIntensity, '[i]');
                    operations.push(
                        Operation.for('int i = 0', 'i < ' + this.pointLightsCount, 'i++', [
                            Operation.if(Operation.greater(intensity, 0), [
                                Operation.equal(
                                    Operation.declare(lightDistance),
                                    Operation.substract(Operation.selection(LightMaterial.parameters.pointLightPosition, '[i]'), vPosition)
                                ),
                                Operation.equal(
                                    Operation.declare(lightDirection),
                                    Operation.normalize(lightDistance)
                                ),
                                Operation.equal(
                                    Operation.declare(attenuation),
                                    Operation.clamp(Operation.divide(intensity, Operation.len(lightDistance)), 0, 1)
                                ),
                                Operation.if(Operation.notEquals(attenuation, 0),
                                    Operation.addTo(color, Operation.multiply(
                                        attenuation,
                                        Operation.do(calculateLight, [
                                            lightDirection,
                                            Operation.selection(LightMaterial.parameters.pointLightColor, '[i]'),
                                            Operation.selection(LightMaterial.parameters.pointLightAmbientStrength, '[i]'),
                                            materialAmbient,
                                            materialDiffuse,
                                            materialSpecular,
                                            materialEmissive,
                                            nCameraPosition,
                                            normal
                                        ]))
                                    )
                                )
                            ])
                        ])
                    );
                }
                if (this.spotLigthsCount) {
                    LightMaterial.parameters.spotLightColor.length = this.spotLigthsCount;
                    LightMaterial.parameters.spotLightPosition.length = this.spotLigthsCount;
                    LightMaterial.parameters.spotLightDirection.length = this.spotLigthsCount;
                    LightMaterial.parameters.spotLightRadius.length = this.spotLigthsCount;
                    LightMaterial.parameters.spotLightInnerRadius.length = this.spotLigthsCount;
                    LightMaterial.parameters.spotLightAmbientStrength.length = this.spotLigthsCount;
                    LightMaterial.parameters.spotLightIntensity.length = this.spotLigthsCount;
                    const r = Parameter.number('r');
                    const lightDistance = Parameter.vector3('lightDistance');
                    const theta = Parameter.number('theta');
                    const smoothing = Parameter.number('smoothing');
                    const attenuation = Parameter.number('attenuation');
                    const intensity = Operation.selection(LightMaterial.parameters.spotLightIntensity, '[i]');
                    operations.push(
                        Operation.for('int i = 0', 'i < ' + this.spotLigthsCount, 'i++', [
                            Operation.if(Operation.greater(intensity, 0), [
                                Operation.equal(
                                    Operation.declare(lightDistance),
                                    Operation.substract(Operation.selection(LightMaterial.parameters.spotLightPosition, '[i]'), vPosition)
                                ),
                                Operation.equal(
                                    Operation.declare(theta),
                                    Operation.substract(
                                        Operation.dot(Operation.normalize(lightDistance), Operation.selection(LightMaterial.parameters.spotLightDirection, '[i]')), 
                                            Operation.selection(LightMaterial.parameters.spotLightRadius, '[i]')),
                                ),
                                Operation.equal(Operation.declare(r), Operation.substract(
                                    Operation.selection(LightMaterial.parameters.spotLightInnerRadius, '[i]'),
                                    Operation.selection(LightMaterial.parameters.spotLightRadius, '[i]')),
                                ),
                                Operation.equal(
                                    Operation.declare(smoothing),
                                    Operation.clamp(Operation.divide(theta, r), 0, 1)
                                ),
                                Operation.equal(
                                    Operation.declare(attenuation),
                                    Operation.multiply(
                                        smoothing,
                                        Operation.clamp(Operation.divide(intensity, Operation.len(lightDistance)), 0, 1)
                                    )
                                ),
                                Operation.if(Operation.notEquals(attenuation, 0),
                                    Operation.addTo(color, Operation.multiply(
                                        attenuation,
                                        Operation.do(calculateLight, [
                                            Operation.selection(LightMaterial.parameters.spotLightDirection, '[i]'),
                                            Operation.selection(LightMaterial.parameters.spotLightColor, '[i]'),
                                            Operation.selection(LightMaterial.parameters.spotLightAmbientStrength, '[i]'),
                                            materialAmbient,
                                            materialDiffuse,
                                            materialSpecular,
                                            materialEmissive,
                                            nCameraPosition,
                                            normal
                                        ]))
                                    )
                                )
                            ])
                        ])
                    );
                }

                operations.push(Operation.multiplyTo(color, fragmentRGB));
            } else {
                operations.push(Operation.addTo(color, fragmentRGB));
            }
            if (this.fog) {
                const distance = Parameter.number('distance');
                const fogDistance = Material.parameters.fogDistance;
                const fogDistanceY = Operation.selection(fogDistance, '.y');
                operations.push(Operation.equal(
                    Operation.declare(distance),
                    Operation.substract(fogDistanceY, vDistance)
                ));
                operations.push(Operation.equal(
                    color, Operation.mix(
                        Material.parameters.backgroundColor,
                        color,
                        Operation.clamp(
                            Operation.substract(
                                Operation.divide(distance, fogDistanceY),
                                Operation.selection(fogDistance, '.x'))
                            , 0, 1))));
            }
            operations.push(Operation.equal(Shader.parameters.output, Operation.toVector4(color, Operation.selection(fragmentColor, '.a'))));
            this._fragmentShader = Shader.fragmentShader(operations, Shader.precision.high);
        }
        return this._fragmentShader;
    }

    get pointLigthsCount() {
        return this._pointLigthsCount;
    }

    set pointLigthsCount(v) {
        if (this.pointLigthsCount != v) {
            this._pointLigthsCount = v;
            this._fragmentShader = null;
        }
    }

    get spotLigthsCount() {
        return this._spotLigthsCount;
    }

    set spotLigthsCount(v) {
        if (this.spotLigthsCount != v) {
            this._spotLigthsCount = v;
            this._fragmentShader = null;
        }
    }

    get directionalLigthsCount() {
        return this._directionalLigthsCount;
    }

    set directionalLigthsCount(v) {
        if (this.directionalLigthsCount != v) {
            this._directionalLigthsCount = v;
            this._fragmentShader = null;
        }
    }

    get ambientColor() {
        return this.parameters[LightMaterial.parameters.ambientColor];
    }

    set ambientColor(v) {
        this.setParameter(LightMaterial.parameters.ambientColor, v);
    }

    get diffuseColor() {
        return this.parameters[LightMaterial.parameters.diffuseColor];
    }

    set diffuseColor(v) {
        this.setParameter(LightMaterial.parameters.diffuseColor, v);
    }

    get specularColor() {
        return this.parameters[LightMaterial.parameters.specularColor];
    }

    set specularColor(v) {
        this.setParameter(LightMaterial.parameters.specularColor, v);
    }

    get emissiveColor() {
        return this.parameters[LightMaterial.parameters.emissiveColor];
    }

    set emissiveColor(v) {
        this.setParameter(LightMaterial.parameters.emissiveColor, v);
    }

    get ambientTexture() {
        return this.parameters[LightMaterial.parameters.ambientTexture];
    }

    set ambientTexture(v) {
        this.setParameter(LightMaterial.parameters.ambientTexture, v);
    }

    get diffuseTexture() {
        return this.parameters[LightMaterial.parameters.diffuseTexture];
    }

    set diffuseTexture(v) {
        this.setParameter(LightMaterial.parameters.diffuseTexture, v);
    }

    get specularTexture() {
        return this.parameters[LightMaterial.parameters.specularTexture];
    }

    set specularTexture(v) {
        this.setParameter(LightMaterial.parameters.specularTexture, v);
    }

    get emissiveTexture() {
        return this.parameters[LightMaterial.parameters.emissiveTexture];
    }

    set emissiveTexture(v) {
        this.setParameter(LightMaterial.parameters.emissiveTexture, v);
    }

    get shininess() {
        return this.parameters[LightMaterial.parameters.shininess];
    }

    set shininess(v) {
        this.setParameter(LightMaterial.parameters.shininess, v);
    }

    static parameters = {
        ambientColor: Parameter.vector3('materialAmbientColor', Parameter.qualifier.const),
        diffuseColor: Parameter.vector3('materialDiffuseColor', Parameter.qualifier.const),
        specularColor: Parameter.vector3('materialSpecularColor', Parameter.qualifier.const),
        emissiveColor: Parameter.vector3('materialEmissiveColor', Parameter.qualifier.const),
        ambientTexture: Parameter.texture('materialAmbientTexture', Parameter.qualifier.const),
        diffuseTexture: Parameter.texture('materialDiffuseTexture', Parameter.qualifier.const),
        specularTexture: Parameter.texture('materialSpecularTexture', Parameter.qualifier.const),
        emissiveTexture: Parameter.texture('materialEmissiveTexture', Parameter.qualifier.const),
        shininess: Parameter.number('materialShininess', Parameter.qualifier.const),
        
        directionalLightColor: Parameter.vector3('directionalLightColor', Parameter.qualifier.const),
        directionalLightDirection: Parameter.vector3('directionalLightDirection', Parameter.qualifier.const),
        directionalLightAmbientStrength: Parameter.number('directionalLightAmbientStrength', Parameter.qualifier.const),
        
        pointLightColor: Parameter.vector3('pointLightColor', Parameter.qualifier.const),
        pointLightPosition: Parameter.vector3('pointLightPosition', Parameter.qualifier.const),
        pointLightAmbientStrength: Parameter.number('pointLightAmbientStrength', Parameter.qualifier.const),
        pointLightIntensity: Parameter.number('pointLightIntensity', Parameter.qualifier.const),
        
        spotLightColor: Parameter.vector3('spotLightColor', Parameter.qualifier.const),
        spotLightPosition: Parameter.vector3('spotLightPosition', Parameter.qualifier.const),
        spotLightDirection: Parameter.vector3('spotLightDirection', Parameter.qualifier.const),
        spotLightAmbientStrength: Parameter.number('spotLightAmbientStrength', Parameter.qualifier.const),
        spotLightRadius: Parameter.number('spotLightRadius', Parameter.qualifier.const),
        spotLightInnerRadius: Parameter.number('spotLightInnerRadius', Parameter.qualifier.const),
        spotLightIntensity: Parameter.number('spotLightIntensity', Parameter.qualifier.const),
    };
    
    static shaderFunction = {
        calculateLight: () => {
            const lightDirection = Parameter.vector3('lightDirection');
            const lightColor = Parameter.vector3('lightColor');
            const ambientStrength = Parameter.number('ambientStrength');
            const materialAmbient = Parameter.vector3('materialAmbient');
            const materialDiffuse = Parameter.vector3('materialDiffuse');
            const materialSpecular = Parameter.vector3('materialSpecular');
            const materialEmissive = Parameter.vector3('materialEmissive');
            const cameraPosition = Parameter.vector3('cameraPosition');
            const normal = Parameter.vector3('normal');

            const ambient = Parameter.vector3('ambient');
            const diffuse = Parameter.vector3('diffuse');
            const specular = Parameter.vector3('specular');
            const emissive = Parameter.vector3('emissive');
            const nDotL = Parameter.number('nDotL');
            const spec = Parameter.number('spec');

            return new ShaderFunction('calculateLight', Vector3, [
                lightDirection,
                lightColor,
                ambientStrength,
                materialAmbient,
                materialDiffuse,
                materialSpecular,
                materialEmissive,
                cameraPosition,
                normal], [
                Operation.if(
                    Operation.notEquals(lightColor, new Vector3()),
                    [
                        Operation.equal(
                            Operation.declare(ambient),
                            Operation.multiply(materialAmbient, lightColor, ambientStrength)
                        ),
                        Operation.equal(
                            Operation.declare(nDotL),
                            Operation.max(
                                Operation.dot(lightDirection, normal),
                                0
                            )
                        ),
                        Operation.if(Operation.equals(nDotL, 0), Operation.return(ambient)),
                        Operation.equal(
                            Operation.declare(diffuse),
                            Operation.multiply(materialDiffuse, lightColor, nDotL)
                        ),
                        Operation.equal(
                            Operation.declare(spec),//blinn-phong
                            Operation.pow(Operation.max(Operation.dot(normal, Operation.normalize(Operation.add(lightDirection, cameraPosition))), 0), LightMaterial.parameters.shininess)
                        ),
                        // Operation.equal(
                        //     spec,//phong
                        //     Operation.pow(Operation.max(Operation.dot(cameraPosition, Operation.substract(Operation.multiply(2, Operation.dot(normal, lightDirection), normal), lightDirection)), 0), PhongMaterial.parameters.shininess)
                        // ),
                        Operation.equal(
                            Operation.declare(specular),
                            Operation.multiply(spec, lightColor, materialSpecular)
                        ),
                        Operation.equal(
                            Operation.declare(emissive),
                            Operation.multiply(lightColor, materialEmissive)
                        ),
                        Operation.return(Operation.add(ambient, diffuse, specular, emissive))
                    ]
                ),
                Operation.return(new Vector3())
            ]);
        }
    };
}