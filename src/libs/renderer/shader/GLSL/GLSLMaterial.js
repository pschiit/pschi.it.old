import Camera from '../../../3d/camera/Camera';
import PointLight from '../../../3d/light/PointLight';
import Node3d from '../../../3d/Node3d';
import Material from '../../Material';
import PhongMaterial from '../../../3d/material/PhongMaterial';
import VertexBuffer from '../../VertexBuffer';
import GLSLParameter from './GLSLParameter';
import GLSLShader from './GLSLShader';
import DirectionalLight from '../../../3d/light/DirectionalLight';
import SpotLight from '../../../3d/light/SpotLight';

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

    /** Create a new GLSLMaterial from a Material
     * @param {Material} material Material to convert
     * @returns {GLSLMaterial} the GLSLMaterial
    */
    static from(material) {
        const position = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, VertexBuffer.positionName);
        const normal = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, VertexBuffer.normalName);
        const color = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, VertexBuffer.colorName);
        const uv = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec2, VertexBuffer.uvName);

        const cameraPosition = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Camera.positionName);
        const cameraMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Camera.projectionMatrixName);
        const fogColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Camera.backgroundColorName);
        const fogDistance = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec2, Camera.fogDistanceName);
        const vertexMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.vertexMatrixName);
        const normalMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.normalMatrixName);

        let directionalLightCount = material.directionalLigthsCount;
        const directionalLightColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, DirectionalLight.colorName, directionalLightCount);
        const directionalLightDirection = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, DirectionalLight.directionName, directionalLightCount);
        const directionalLightAmbientStrength = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, DirectionalLight.ambientStrengthName, directionalLightCount);

        let pointLightCount = material.pointLigthsCount;
        const pointLightColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PointLight.colorName, pointLightCount);
        const pointLightPosition = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PointLight.positionName, pointLightCount);
        const pointLightAmbientStrength = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PointLight.ambientStrengthName, pointLightCount);
        const pointLightIntensity = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PointLight.intensityName, pointLightCount);

        let spotLightCount = material.spotLigthsCount;
        const spotLightColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, SpotLight.colorName, spotLightCount);
        const spotLightPosition = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, SpotLight.positionName, spotLightCount);
        const spotLightDirection = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, SpotLight.directionName, spotLightCount);
        const spotLightInnerRadius = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, SpotLight.innerRadiusName, spotLightCount);
        const spotLightRadius = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, SpotLight.radiusName, spotLightCount);
        const spotLightAmbientStrength = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, SpotLight.ambientStrengthName, spotLightCount);
        const spotLightIntensity = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, SpotLight.intensityName, spotLightCount);

        const sampler2d = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, Material.textureName);

        const vPosition = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec3, 'v_' + VertexBuffer.positionName);
        const vColor = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_' + VertexBuffer.colorName);
        const vNormal = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec3, 'v_' + VertexBuffer.normalName);
        const vUV = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec2, 'v_' + VertexBuffer.uvName);
        const vDistance = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.float, 'v_' + Camera.fogDistanceName);

        if (material instanceof PhongMaterial) {
            const materialAmbientColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PhongMaterial.ambientColorName);
            const materialDiffuseColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PhongMaterial.diffuseColorName);
            const materialSpecularColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PhongMaterial.specularColorName);
            const materialEmissiveColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PhongMaterial.emissiveColorName);

            const materialAmbientTexture = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, PhongMaterial.ambientTextureName);
            const materialDiffuseTexture = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, PhongMaterial.diffuseTextureName);
            const materialSpecularTexture = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, PhongMaterial.specularTextureName);
            const materialEmissiveTexture = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, PhongMaterial.emissiveTextureName);

            const materialShininess = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PhongMaterial.shininessName);
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
            const result = new GLSLMaterial(vertexShader, fragmentShader);

            console.log(fragmentShader.source);
            result.id = material.id;
            return result;

            function createColor() {
                const result = [
                    material.texture ? `   vec4 fragmentColor = texture2D(${sampler2d}, ${vUV}) + ${vColor};` : `   vec4 fragmentColor = ${vColor};`,
                ]
                if (directionalLightCount > 0 || pointLightCount > 0 || spotLightCount > 0) {
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
                    + createSpotLight()
                    + `     color *= fragmentColor.rgb;`;

                return result.length > 0 ? result
                    : `   color += fragmentColor.rgb;`;
            }

            function createFog() {
                return material.fog ? [
                    `   float fogFactor = clamp((${fogDistance}.y - ${vDistance}) / (${fogDistance}.y - ${fogDistance}.x), 0.0, 1.0);`,
                    `   color =  mix(${fogColor}, color, fogFactor);`,].join('\n')
                    : '';
            }

            function createDirectionalLight() {
                return directionalLightCount > 0 ? [
                    `   for(int i = 0; i < ${directionalLightCount}; i++){`,
                    `      color += calculateLight(${directionalLightDirection}[i], ${directionalLightColor}[i], ${directionalLightAmbientStrength}[i], materialAmbient, materialDiffuse, materialSpecular, materialEmissive, ${materialShininess}, cameraPosition, normal);`,
                    '   }\n',].join('\n')
                    : '';
            }

            function createPointLight() {
                return pointLightCount > 0 ? [
                    `   for(int i = 0; i < ${pointLightCount}; i++){`,
                    `      vec3 lightDistance = ${pointLightPosition}[i] - ${vPosition};`,
                    `      vec3 lightDirection = normalize(lightDistance);`,
                    `      float attenuation = clamp(${pointLightIntensity}[i] / length(lightDistance), 0.0, 1.0);`,
                    `      color += attenuation * calculateLight(lightDirection, ${pointLightColor}[i], ${pointLightAmbientStrength}[i], materialAmbient, materialDiffuse, materialSpecular, materialEmissive, ${materialShininess}, cameraPosition, normal);`,
                    '   }\n',].join('\n')
                    : '';
            }

            function createSpotLight() {
                return spotLightCount > 0 ? [
                    `   for(int i = 0; i < ${spotLightCount}; i++){`,
                    `      vec3 lightDistance = ${spotLightPosition}[i] - ${vPosition};`,
                    `      float theta = dot(normalize(lightDistance), ${spotLightDirection}[i]);`,
                    `      float smoothing = clamp((theta - ${spotLightRadius}[i]) / (${spotLightInnerRadius}[i] - ${spotLightRadius}[i]), 0.0, 1.0);`,
                    `      float attenuation = clamp(${spotLightIntensity}[i] / length(lightDistance), 0.0, 1.0);`,
                    `      color +=  smoothing * attenuation * calculateLight(${spotLightDirection}[i], ${spotLightColor}[i], ${spotLightAmbientStrength}[i], materialAmbient, materialDiffuse, materialSpecular, materialEmissive,${materialShininess}, cameraPosition, normal);`,
                    '   }\n',].join('\n')
                    : '';
            }

            function calculateLight() {
                return directionalLightCount > 0 || pointLightCount > 0 || spotLightCount > 0 ? [
                    'vec3 calculateLight(vec3 lightDirection, vec3 lightColor, float ambientStrength, vec3 materialAmbient, vec3 materialDiffuse, vec3 materialSpecular, vec3 materialEmissive, float shininess, vec3 cameraPosition, vec3 normal){',
                    `   vec3 ambient = materialAmbient * lightColor * ambientStrength;`,
                    '   float nDotL = max(dot(lightDirection, normal), 0.0);',
                    '   if(nDotL == 0.0){',
                    '       return ambient;',
                    '   }',
                    `   vec3 diffuse = materialDiffuse * lightColor * nDotL;`,
                    // '   vec3 reflectionDirection = 2.0 * dot(normal,lightDirection) * normal - lightDirection;',//phong
                    // '   float spec = pow(max(dot(cameraPosition, reflectionDirection), 0.0), shininess);',
                    '   vec3 halfway = normalize(lightDirection + cameraPosition);',//blinn-phong
                    '   float spec = pow(max(dot(normal, halfway), 0.0), shininess);',
                    `   vec3 specular = spec * lightColor * materialSpecular;`,
                    `   vec3 emissive = materialEmissive * lightColor;`,
                    `   return (diffuse + specular + ambient + emissive);`,
                    '}\n',
                ].join('\n')
                    : '';
            };
        }
    }
    static structure = {
        material: [
            'struct Material{',
            '   vec3 ambientColor;',
            '   vec3 diffuseColor;',
            '   vec3 specularColor;',
            '   vec3 emissiveColor;',
            '   float shininess;',
            '};',
        ].join('\n'),
        light: [
            'struct Light{',
            '   vec3 direction;',
            '   vec3 color;',
            '   vec3 ambientStrenght;',
            '};',
        ].join('\n'),
    }
}