import Color from '../../core/Color';
import Vector3 from '../../math/Vector3';
import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';
import ShaderFunction from '../../renderer/graphics/shader/ShaderFunction';
import VertexBuffer from '../../renderer/graphics/VertexBuffer';
import CameraNode from '../camera/CameraNode';
import DirectionalLight from '../light/DirectionalLight';
import LightNode from '../light/LightNode';
import PointLight from '../light/PointLight';
import SpotLight from '../light/SpotLight';
import Node3d from '../Node3d';

export default class PhongMaterial extends Material {
    constructor() {
        super();
        this.ambientColor = Color.white;
        this.diffuseColor = Color.white;
        this.specularColor = Color.white;
        this.emissiveColor = Color.black;

        this.shininess = 32;

        this.directionalLigthsCount = 0;
        this.pointLigthsCount = 0;
        this.spotLigthsCount = 0;
        // this.fog = false;
    }

    updateShader() {
        if (!this.vertexShader) {
            const vColor = Parameter.vector4('v_' + VertexBuffer.parameters.color, Parameter.qualifier.var);
            const vPosition = Parameter.vector3('v_' + VertexBuffer.parameters.position, Parameter.qualifier.var);
            const vNormal = Parameter.vector3('v_' + VertexBuffer.parameters.normal, Parameter.qualifier.var);
            const vUV = Parameter.vector2('v_' + VertexBuffer.parameters.uv, Parameter.qualifier.var);
            const vDistance = Parameter.number('v_' + CameraNode.parameters.fogDistance, Parameter.qualifier.var);
            this.vertexShader = Shader.vertexShader([
                Operation.equal(
                    Shader.parameters.output,
                    Operation.multiply(
                        CameraNode.parameters.projectionMatrix,
                        Node3d.parameters.vertexMatrix,
                        VertexBuffer.parameters.position)),
                Operation.equal(vDistance, Operation.selection(Shader.parameters.output, '.w')),
                Operation.equal(
                    vNormal,
                    Operation.normalize(
                        Operation.toVector3(Operation.multiply(
                            Node3d.parameters.normalMatrix,
                            VertexBuffer.parameters.normal)))),
                Operation.equal(vPosition, Operation.toVector3(Operation.multiply(
                    Node3d.parameters.vertexMatrix,
                    VertexBuffer.parameters.position))),
                Operation.equal(vColor, VertexBuffer.parameters.color),
                Operation.equal(vUV, VertexBuffer.parameters.uv),
            ]);
        }
        if (!this.fragmentShader) {
            const vColor = Parameter.vector4('v_' + VertexBuffer.parameters.color, Parameter.qualifier.var);
            const vPosition = Parameter.vector3('v_' + VertexBuffer.parameters.position, Parameter.qualifier.var);
            const vNormal = Parameter.vector3('v_' + VertexBuffer.parameters.normal, Parameter.qualifier.var);
            const vUV = Parameter.vector2('v_' + VertexBuffer.parameters.uv, Parameter.qualifier.var);
            const vDistance = Parameter.number('v_' + CameraNode.parameters.fogDistance, Parameter.qualifier.var);
            const normal = Parameter.vector3('normal');
            const fragmentColor = Parameter.vector4('fragmentColor');
            const fragmentRGB = Operation.selection(fragmentColor, '.rgb');
            const color = Parameter.vector3('color');
            const nCameraPosition = Parameter.vector3('nCameraPosition');
            const hasLight = this.directionalLigthsCount || this.pointLightsCount || this.spotLigthsCount;
            const operations = [
                Operation.equal(Operation.declare(normal), Operation.normalize(vNormal)),
                Operation.equal(Operation.declare(nCameraPosition), Operation.normalize(Operation.substract(CameraNode.parameters.cameraPosition, vPosition))),
                Operation.equal(Operation.declare(fragmentColor), vColor),
                Operation.equal(Operation.declare(color), new Vector3())];
            if (this.texture) {
                operations.push(Operation.addTo(fragmentColor, Operation.read(Material.parameters.texture, vUV)))
            }
            if (hasLight) {
                const calculateLight = PhongMaterial.shaderFunction.calculateLight();
                const materialAmbient = Parameter.vector3('materialAmbient');
                operations.push(Operation.equal(
                    Operation.declare(materialAmbient),
                    this.ambientTexture ?
                        Operation.add(
                            Operation.selection(Operation.read(PhongMaterial.parameters.ambientTexture, vUV), '.stp'),
                            PhongMaterial.parameters.ambientColor)
                        : PhongMaterial.parameters.ambientColor));
                const materialDiffuse = Parameter.vector3('materialDiffuse');
                operations.push(Operation.equal(
                    Operation.declare(materialDiffuse),
                    this.diffuseTexture ?
                        Operation.add(
                            Operation.selection(Operation.read(PhongMaterial.parameters.diffuseTexture, vUV), '.stp'),
                            PhongMaterial.parameters.diffuseColor)
                        : PhongMaterial.parameters.diffuseColor));
                const materialEmissive = Parameter.vector3('materialEmissive');
                operations.push(Operation.equal(
                    Operation.declare(materialEmissive),
                    this.emissiveTexture ?
                        Operation.add(
                            Operation.selection(Operation.read(PhongMaterial.parameters.emissiveTexture, vUV), '.stp'),
                            PhongMaterial.parameters.emissiveColor)
                        : PhongMaterial.parameters.emissiveColor));
                const materialSpecular = Parameter.vector3('materialSpecular');
                operations.push(Operation.equal(
                    Operation.declare(materialSpecular),
                    this.specularTexture ?
                        Operation.add(
                            Operation.selection(Operation.read(PhongMaterial.parameters.specularTexture, vUV), '.stp'),
                            PhongMaterial.parameters.specularColor)
                        : PhongMaterial.parameters.specularColor));

                if (this.directionalLigthsCount) {
                    DirectionalLight.parameters.color.length = this.directionalLigthsCount;
                    DirectionalLight.parameters.direction.length = this.directionalLigthsCount;
                    DirectionalLight.parameters.ambientStrength.length = this.directionalLigthsCount;
                    operations.push(
                        Operation.for('int i = 0', 'i < ' + this.directionalLigthsCount, 'i++',
                            Operation.addTo(color, Operation.do(calculateLight, [
                                Operation.selection(DirectionalLight.parameters.direction, '[i]'),
                                Operation.selection(DirectionalLight.parameters.color, '[i]'),
                                Operation.selection(DirectionalLight.parameters.ambientStrength, '[i]'),
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
                    PointLight.parameters.color.length = this.pointLightsCount;
                    PointLight.parameters.position.length = this.pointLightsCount;
                    PointLight.parameters.ambientStrength.length = this.pointLightsCount;
                    PointLight.parameters.intensity.length = this.pointLightsCount;
                    const lightDirection = Parameter.vector3('lightDirection');
                    const lightDistance = Parameter.vector3('lightDistance');
                    const attenuation = Parameter.number('attenuation');
                    const intensity = Operation.selection(PointLight.parameters.intensity, '[i]');
                    operations.push(
                        Operation.for('int i = 0', 'i < ' + this.pointLightsCount, 'i++', [
                            Operation.if(Operation.greater(intensity, 0), [
                                Operation.equal(
                                    Operation.declare(lightDistance),
                                    Operation.substract(Operation.selection(PointLight.parameters.position, '[i]'), vPosition)
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
                                            Operation.selection(PointLight.parameters.color, '[i]'),
                                            Operation.selection(PointLight.parameters.ambientStrength, '[i]'),
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
                    SpotLight.parameters.color.length = this.spotLigthsCount;
                    SpotLight.parameters.position.length = this.spotLigthsCount;
                    SpotLight.parameters.direction.length = this.spotLigthsCount;
                    SpotLight.parameters.radius.length = this.spotLigthsCount;
                    SpotLight.parameters.innerRadius.length = this.spotLigthsCount;
                    SpotLight.parameters.ambientStrength.length = this.spotLigthsCount;
                    SpotLight.parameters.intensity.length = this.spotLigthsCount;
                    const r = Parameter.number('r');
                    const lightDistance = Parameter.vector3('lightDistance');
                    const theta = Parameter.number('theta');
                    const smoothing = Parameter.number('smoothing');
                    const attenuation = Parameter.number('attenuation');
                    const intensity = Operation.selection(SpotLight.parameters.intensity, '[i]');
                    operations.push(
                        Operation.for('int i = 0', 'i < ' + this.spotLigthsCount, 'i++', [
                            Operation.if(Operation.greater(intensity, 0), [
                                Operation.equal(
                                    Operation.declare(lightDistance),
                                    Operation.substract(Operation.selection(SpotLight.parameters.position, '[i]'), vPosition)
                                ),
                                Operation.equal(
                                    Operation.declare(theta),
                                    Operation.substract(Operation.dot(Operation.normalize(lightDistance), Operation.selection(SpotLight.parameters.direction, '[i]')), Operation.selection(SpotLight.parameters.radius, '[i]')),
                                ),
                                Operation.equal(Operation.declare(r), Operation.substract(
                                    Operation.selection(SpotLight.parameters.innerRadius, '[i]'),
                                    Operation.selection(SpotLight.parameters.radius, '[i]')),
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
                                            Operation.selection(SpotLight.parameters.direction, '[i]'),
                                            Operation.selection(SpotLight.parameters.color, '[i]'),
                                            Operation.selection(SpotLight.parameters.ambientStrength, '[i]'),
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
                const fogDistance = CameraNode.parameters.fogDistance;
                const fogDistanceY = Operation.selection(fogDistance, '.y');

                operations.push(Operation.equal(
                    color, Operation.mix(
                        CameraNode.parameters.backgroundColor,
                        color,
                        Operation.clamp(
                            Operation.substract(
                                Operation.divide(Operation.substract(fogDistanceY, vDistance), fogDistanceY),
                                Operation.selection(fogDistance, '.x'))
                            , 0, 1))));
            }
            operations.push(Operation.equal(Shader.parameters.output, Operation.toVector4(color, Operation.selection(fragmentColor, '.a'))));
            this.fragmentShader = Shader.fragmentShader(operations, Shader.precision.high);
        }
    }

    get pointLigthsCount() {
        return this._pointLigthsCount;
    }

    set pointLigthsCount(v) {
        if (this.pointLigthsCount != v) {
            this._pointLigthsCount = v;
            this.fragmentShader = null;
        }
    }

    get spotLigthsCount() {
        return this._spotLigthsCount;
    }

    set spotLigthsCount(v) {
        if (this.spotLigthsCount != v) {
            this._spotLigthsCount = v;
            this.fragmentShader = null;
        }
    }

    get directionalLigthsCount() {
        return this._directionalLigthsCount;
    }

    set directionalLigthsCount(v) {
        if (this.directionalLigthsCount != v) {
            this._directionalLigthsCount = v;
            this.fragmentShader = null;
        }
    }

    get ambientColor() {
        return this.parameters[PhongMaterial.parameters.ambientColor];
    }

    set ambientColor(v) {
        this.setParameter(PhongMaterial.parameters.ambientColor, v);
    }

    get diffuseColor() {
        return this.parameters[PhongMaterial.parameters.diffuseColor];
    }

    set diffuseColor(v) {
        this.setParameter(PhongMaterial.parameters.diffuseColor, v);
    }

    get specularColor() {
        return this.parameters[PhongMaterial.parameters.specularColor];
    }

    set specularColor(v) {
        this.setParameter(PhongMaterial.parameters.specularColor, v);
    }

    get emissiveColor() {
        return this.parameters[PhongMaterial.parameters.emissiveColor];
    }

    set emissiveColor(v) {
        this.setParameter(PhongMaterial.parameters.emissiveColor, v);
    }


    get ambientTexture() {
        return this.parameters[PhongMaterial.parameters.ambientTexture];
    }

    set ambientTexture(v) {
        this.setParameter(PhongMaterial.parameters.ambientTexture, v);
    }

    get diffuseTexture() {
        return this.parameters[PhongMaterial.parameters.diffuseTexture];
    }

    set diffuseTexture(v) {
        this.setParameter(PhongMaterial.parameters.diffuseTexture, v);
    }

    get specularTexture() {
        return this.parameters[PhongMaterial.parameters.specularTexture];
    }

    set specularTexture(v) {
        this.setParameter(PhongMaterial.parameters.specularTexture, v);
    }

    get emissiveTexture() {
        return this.parameters[PhongMaterial.parameters.emissiveTexture];
    }

    set emissiveTexture(v) {
        this.setParameter(PhongMaterial.parameters.emissiveTexture, v);
    }

    get shininess() {
        return this.parameters[PhongMaterial.parameters.shininess];
    }

    set shininess(v) {
        this.setParameter(PhongMaterial.parameters.shininess, v);
    }

    setScene(scene) {
        super.setScene(scene);
        this.pointLightsCount = scene.parameters[PointLight.parameters.ambientStrength.name]?.length || 0;
        this.directionalLigthsCount = scene.parameters[DirectionalLight.parameters.ambientStrength.name]?.length || 0;
        this.spotLigthsCount = scene.parameters[SpotLight.parameters.ambientStrength.name]?.length || 0;
        this.updateShader();
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
                            Operation.pow(Operation.max(Operation.dot(normal, Operation.normalize(Operation.add(lightDirection, cameraPosition))), 0), PhongMaterial.parameters.shininess)
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
    }
}