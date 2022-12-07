import Camera from '../../../../3d/camera/Camera';
import DirectionalLight from '../../../../3d/light/DirectionalLight';
import PointLight from '../../../../3d/light/PointLight';
import SpotLight from '../../../../3d/light/SpotLight';
import PhongMaterial from '../../../../3d/material/PhongMaterial';
import PickingMaterial from '../../../../3d/material/PickingMaterial';
import Node3d from '../../../../3d/Node3d';
import Material from '../../Material';
import Render from '../../Render';
import VertexBuffer from '../../VertexBuffer';
import GLSLParameter from './GLSLParameter';
import GLSLShader from './GLSLShader';

export default class GLSLMaterial extends Material {
    /** Create a new GLSLMaterial from a vertex and fragment GLSLShader
     * @param {GLSLShader} vertexShader GLSL shader
     * @param {GLSLShader} fragmentShader GLSL shader
    */
    constructor(vertexShader, fragmentShader) {
        super();
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }

    /** Create a new GLSLMaterial from a Material and a Scene
     * @param {Material} material Material to convert
     * @returns {GLSLMaterial} the GLSLMaterial
    */
    static from(material) {
        if (material instanceof GLSLMaterial) {
            return material;
        } else if (material instanceof PhongMaterial) {
            return GLSLMaterial.phongMaterial(material);
        } else if (material instanceof PickingMaterial) {
            return GLSLMaterial.pickingMaterial(material);
        }
    }

    /** Create a new GLSLMaterial from a PhongMaterial and a Scene
     * @param {PhongMaterial} material PhongMaterial to convert
     * @returns {GLSLMaterial} the GLSLMaterial
    */
    static phongMaterial = (material) => {
        if (!material.compiled || !GLSLMaterial.cache[material.id]) {
            const position = GLSLParameter.from(VertexBuffer.positionName);
            const normal = GLSLParameter.from(VertexBuffer.normalName);
            const color = GLSLParameter.from(VertexBuffer.colorName);
            const uv = GLSLParameter.from(VertexBuffer.uvName);

            const cameraPosition = GLSLParameter.from(Camera.positionName);
            const cameraMatrix = GLSLParameter.from(Camera.projectionMatrixName);
            const fogColor = GLSLParameter.from(Camera.backgroundColorName);
            const fogDistance = GLSLParameter.from(Camera.fogDistanceName);
            const vertexMatrix = GLSLParameter.from(Node3d.vertexMatrixName);
            const normalMatrix = GLSLParameter.from(Node3d.normalMatrixName);

            const directionalLightColor = GLSLParameter.from(DirectionalLight.colorName, material.directionalLigthsCount);
            const directionalLightDirection = GLSLParameter.from(DirectionalLight.directionName, material.directionalLigthsCount);
            const directionalLightAmbientStrength = GLSLParameter.from(DirectionalLight.ambientStrengthName, material.directionalLigthsCount);

            const pointLightColor = GLSLParameter.from(PointLight.colorName, material.pointLightsCount);
            const pointLightPosition = GLSLParameter.from(PointLight.positionName, material.pointLightsCount);
            const pointLightAmbientStrength = GLSLParameter.from(PointLight.ambientStrengthName, material.pointLightsCount);
            const pointLightIntensity = GLSLParameter.from(PointLight.intensityName, material.pointLightsCount);

            const spotLightColor = GLSLParameter.from(SpotLight.colorName, material.spotLigthsCount);
            const spotLightPosition = GLSLParameter.from(SpotLight.positionName, material.spotLigthsCount);
            const spotLightDirection = GLSLParameter.from(SpotLight.directionName, material.spotLigthsCount);
            const spotLightInnerRadius = GLSLParameter.from(SpotLight.innerRadiusName, material.spotLigthsCount);
            const spotLightRadius = GLSLParameter.from(SpotLight.radiusName, material.spotLigthsCount);
            const spotLightAmbientStrength = GLSLParameter.from(SpotLight.ambientStrengthName, material.spotLigthsCount);
            const spotLightIntensity = GLSLParameter.from(SpotLight.intensityName, material.spotLigthsCount);

            const sampler2d = GLSLParameter.from(Material.textureName);

            const vPosition = GLSLParameter.from('v_' + VertexBuffer.positionName);
            const vColor = GLSLParameter.from('v_' + VertexBuffer.colorName);
            const vNormal = GLSLParameter.from('v_' + VertexBuffer.normalName);
            const vUV = GLSLParameter.from('v_' + VertexBuffer.uvName);
            const vDistance = GLSLParameter.from('v_' + Camera.fogDistanceName);

            const materialAmbientColor = GLSLParameter.from(PhongMaterial.ambientColorName);
            const materialDiffuseColor = GLSLParameter.from(PhongMaterial.diffuseColorName);
            const materialSpecularColor = GLSLParameter.from(PhongMaterial.specularColorName);
            const materialEmissiveColor = GLSLParameter.from(PhongMaterial.emissiveColorName);

            const materialAmbientTexture = GLSLParameter.from(PhongMaterial.ambientTextureName);
            const materialDiffuseTexture = GLSLParameter.from(PhongMaterial.diffuseTextureName);
            const materialSpecularTexture = GLSLParameter.from(PhongMaterial.specularTextureName);
            const materialEmissiveTexture = GLSLParameter.from(PhongMaterial.emissiveTextureName);

            const materialShininess = GLSLParameter.from(PhongMaterial.shininessName);
            const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
                position,
                normal,
                color,
                uv,
                vertexMatrix,
                normalMatrix,
                cameraMatrix,
                vPosition,
                vNormal,
                vColor,
                vDistance,
                vUV,
            ], [
                'void main(){',
                `   gl_Position = ${cameraMatrix} * ${vertexMatrix} * ${position};`,
                `   ${vDistance} = gl_Position.w;`,
                `   ${vNormal} = normalize(vec3(${normalMatrix} * ${normal}));`,
                `   ${vPosition} = vec3(${vertexMatrix} * ${position});`,
                `   ${vColor} = ${color};`,
                `   ${vUV} = ${uv};`,
                '}'
            ].join('\n'));

            const fragmentShader = new GLSLShader(GLSLShader.type.fragmentShader, [
                cameraPosition,
                fogColor,
                fogDistance,
                sampler2d,
                directionalLightColor,
                directionalLightDirection,
                directionalLightAmbientStrength,
                pointLightColor,
                pointLightPosition,
                pointLightAmbientStrength,
                pointLightIntensity,
                spotLightColor,
                spotLightPosition,
                spotLightDirection,
                spotLightInnerRadius,
                spotLightRadius,
                spotLightAmbientStrength,
                spotLightIntensity,
                materialShininess,
                materialAmbientColor,
                materialDiffuseColor,
                materialSpecularColor,
                materialEmissiveColor,
                materialAmbientTexture,
                materialDiffuseTexture,
                materialSpecularTexture,
                materialEmissiveTexture,
                vPosition,
                vNormal,
                vColor,
                vUV,
                vDistance,
            ], [
                calculateLight(),
                'void main(){',
                `   vec3 normal = normalize(${vNormal});`,
                `   vec3 cameraPosition = normalize(${cameraPosition} - ${vPosition});`,
                createColor(),
                '   vec3 color = vec3(0.0);',
                createLight(),
                createFog(),
                '   gl_FragColor =  vec4(color, fragmentColor.a);',
                '}'
            ].join('\n'), GLSLShader.precision.high);

            const glslMaterial = new GLSLMaterial(vertexShader, fragmentShader);
            GLSLMaterial.cache[material.id] = glslMaterial;

            function createColor() {
                const result = [
                    material.texture ? `   vec4 fragmentColor = texture2D(${sampler2d}, ${vUV}) + ${vColor};` : `   vec4 fragmentColor = ${vColor};`,
                ]
                if (material.directionalLigthsCount > 0 || material.pointLightsCount > 0 || material.spotLigthsCount > 0) {
                    result.push(material.ambientTexture ? `   vec3 materialAmbient = texture2D(${materialAmbientTexture}, ${vUV}).stp + ${materialAmbientColor};` : `   vec3 materialAmbient = ${materialAmbientColor};`);
                    result.push(material.diffuseTexture ? `   vec3 materialDiffuse = texture2D(${materialDiffuseTexture}, ${vUV}).stp + ${materialDiffuseColor};` : `   vec3 materialDiffuse = ${materialDiffuseColor};`);
                    result.push(material.specularTexture ? `   vec3 materialSpecular = texture2D(${materialSpecularTexture}, ${vUV}).stp + ${materialSpecularColor};` : `   vec3 materialSpecular = ${materialSpecularColor};`);
                    result.push(material.emissiveTexture ? `   vec3 materialEmissive = texture2D(${materialEmissiveTexture}, ${vUV}).stp + ${materialEmissiveColor};` : `   vec3 materialEmissive = ${materialEmissiveColor};`);
                }
                return result.join('\n');
            }

            function createLight() {
                var result = createDirectionalLight()
                    + createPointLight()
                    + createSpotLight();

                return result.length > 0 ? result + `     color *= fragmentColor.rgb;`
                    : `   color += fragmentColor.rgb;`;
            }

            function createFog() {
                return material.fog ? [
                    `   float fogFactor = clamp((${fogDistance}.y - ${vDistance}) / (${fogDistance}.y - ${fogDistance}.x), 0.0, 1.0);`,
                    `   color =  mix(${fogColor}, color, fogFactor);`,].join('\n')
                    : '';
            }

            function createDirectionalLight() {
                return material.directionalLigthsCount > 0 ? [
                    `   for(int i = 0; i < ${material.directionalLigthsCount}; i++){`,
                    `      color += calculateLight(${directionalLightDirection}[i], ${directionalLightColor}[i], ${directionalLightAmbientStrength}[i], materialAmbient, materialDiffuse, materialSpecular, materialEmissive, ${materialShininess}, cameraPosition, normal);`,
                    '   }\n',].join('\n')
                    : '';
            }

            function createPointLight() {
                return material.pointLightsCount > 0 ? [
                    `   for(int i = 0; i < ${material.pointLightsCount}; i++){`,
                    `       if(${pointLightIntensity}[i] > 0.0){`,
                    `           vec3 lightDistance = ${pointLightPosition}[i] - ${vPosition};`,
                    `           vec3 lightDirection = normalize(lightDistance);`,
                    `           float attenuation = clamp(${pointLightIntensity}[i] / length(lightDistance), 0.0, 1.0);`,
                    `           color += attenuation * calculateLight(lightDirection, ${pointLightColor}[i], ${pointLightAmbientStrength}[i], materialAmbient, materialDiffuse, materialSpecular, materialEmissive, ${materialShininess}, cameraPosition, normal);`,
                    '       }',
                    '   }\n',].join('\n')
                    : '';
            }

            function createSpotLight() {
                return material.spotLigthsCount > 0 ? [
                    `   for(int i = 0; i < ${material.spotLigthsCount}; i++){`,
                    `       if(${spotLightIntensity}[i] > 0.0){`,
                    `           vec3 lightDistance = ${spotLightPosition}[i] - ${vPosition};`,
                    `           float theta = dot(normalize(lightDistance), ${spotLightDirection}[i]);`,
                    `           float smoothing = clamp((theta - ${spotLightRadius}[i]) / (${spotLightInnerRadius}[i] - ${spotLightRadius}[i]), 0.0, 1.0);`,
                    `           float attenuation = clamp(${spotLightIntensity}[i] / length(lightDistance), 0.0, 1.0);`,
                    `           color +=  smoothing * attenuation * calculateLight(${spotLightDirection}[i], ${spotLightColor}[i], ${spotLightAmbientStrength}[i], materialAmbient, materialDiffuse, materialSpecular, materialEmissive,${materialShininess}, cameraPosition, normal);`,
                    '       }',
                    '   }\n',].join('\n')
                    : '';
            }

            function calculateLight() {
                return material.directionalLigthsCount > 0 || material.pointLightsCount > 0 || material.spotLigthsCount > 0 ? [
                    'vec3 calculateLight(vec3 lightDirection, vec3 lightColor, float ambientStrength, vec3 materialAmbient, vec3 materialDiffuse, vec3 materialSpecular, vec3 materialEmissive, float shininess, vec3 cameraPosition, vec3 normal){',
                    '   if(lightColor != vec3(0.0)){',
                    '       vec3 ambient = materialAmbient * lightColor * ambientStrength;',
                    '       float nDotL = max(dot(lightDirection, normal), 0.0);',
                    '       if(nDotL == 0.0){',
                    '           return ambient;',
                    '       }',
                    '       vec3 diffuse = materialDiffuse * lightColor * nDotL;',
                    // '        vec3 reflectionDirection = 2.0 * dot(normal,lightDirection) * normal - lightDirection;',//phong
                    // '        float spec = pow(max(dot(cameraPosition, reflectionDirection), 0.0), shininess);',
                    '       vec3 halfway = normalize(lightDirection + cameraPosition);',//blinn-phong
                    '       float spec = pow(max(dot(normal, halfway), 0.0), shininess);',
                    '       vec3 specular = spec * lightColor * materialSpecular;',
                    '       vec3 emissive = materialEmissive * lightColor;',
                    '       return (diffuse + specular + ambient + emissive);',
                    '   }',
                    '}\n',
                ].join('\n')
                    : '';
            };
        }
        return GLSLMaterial.cache[material.id];
    }


    /** Create a new GLSLMaterial from a PickingMaterial and a Scene
     * @param {PickingMaterial} material PickingMaterial to convert
     * @returns {GLSLMaterial} the GLSLMaterial
    */
    static pickingMaterial = (material) => {
        if (!GLSLMaterial.cache[material.id]) {
            const position = GLSLParameter.from(VertexBuffer.positionName);
            const cameraMatrix = GLSLParameter.from(Camera.projectionMatrixName);
            const vertexMatrix = GLSLParameter.from(Node3d.vertexMatrixName);
            const pickingColor = GLSLParameter.from(Render.colorIdName);
            const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
                position,
                vertexMatrix,
                cameraMatrix,
            ], [
                'void main(){',
                `   gl_Position = ${cameraMatrix} * ${vertexMatrix} * ${position};`,
                '}'
            ].join('\n'));

            const fragmentShader = new GLSLShader(GLSLShader.type.fragmentShader, [
                pickingColor,
            ], [
                'void main(){',
                `   gl_FragColor = vec4(${pickingColor},1.0);`,
                '}'
            ].join('\n'), GLSLShader.precision.high);
            const glslMaterial = new GLSLMaterial(vertexShader, fragmentShader);
            GLSLMaterial.cache[material.id] = glslMaterial;
        }

        return GLSLMaterial.cache[material.id];
    }

    static cache = {}
}