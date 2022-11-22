import Camera from '../../../3d/camera/Camera';
import PointLight from '../../../3d/light/PointLight';
import Node3d from '../../../3d/Node3d';
import Material from '../../../material/Material';
import PhongMaterial from '../../../material/PhongMaterial';
import GeometryBuffer from '../../../math/geometry/GeometryBuffer';
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

    /** Create a new GLSLMaterial from a Material
     * @param {Material} material Material to convert
     * @returns {GLSLMaterial} the GLSLMaterial
    */
    static from(material) {
        if (material instanceof PhongMaterial) {
            const position = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, GeometryBuffer.positionName);
            const normal = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, GeometryBuffer.normalName);
            const color = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, GeometryBuffer.colorName);
    
            const cameraPosition = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Camera.positionName);
            const cameraMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Camera.projectionMatrixName);
            const fogColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Camera.fogColorName);
            const fogDistance = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec2, Camera.fogDistanceName);
            const vertexMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.vertexMatrixName);
            const normalMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.normalMatrixName);
            const pointLightColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PointLight.lightColorName);
            const pointLightPosition = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PointLight.lightPositionName);
            const pointLightAmbientStrength = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PointLight.pointLightAmbientStrengthName);
            const pointLightIntensity = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PointLight.pointLightIntensityName);
            const materialShininess = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PhongMaterial.shininessName);
    
            const vDistance = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.float, 'v_' + Camera.fogDistanceName);
            const vColor = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_' + GeometryBuffer.colorName);
            const vPosition = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec3, 'v_' + GeometryBuffer.positionName);
            const vNormal = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec3, 'v_' + GeometryBuffer.normalName);

            const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
                position,
                normal,
                color,
                vertexMatrix,
                normalMatrix,
                cameraMatrix,
                vPosition,
                vNormal,
                vColor,
                vDistance,
            ], [
                'void main(){',
                `gl_Position = ${cameraMatrix} * ${vertexMatrix} * ${position};`,
                `${vDistance} = gl_Position.w;`,
                `${vNormal} = normalize(vec3(${normalMatrix} * ${normal}));`,
                `${vPosition} = vec3(${vertexMatrix} * ${position});`,
                `${vColor} = ${color};`,
                '}'
            ].join('\n'));

            const fragmentShader = new GLSLShader(GLSLShader.type.fragmentShader, [
                cameraPosition,
                fogColor,
                fogDistance,
                pointLightAmbientStrength,
                pointLightColor,
                pointLightPosition,
                pointLightIntensity,
                materialShininess,
                vPosition,
                vNormal,
                vColor,
                vDistance
            ], [
                GLSLMaterial.calculateLight,
                GLSLMaterial.calculateFog,
                'void main(){',
                `vec3 normal = normalize(${vNormal});`,
                `vec3 cameraPosition = normalize(${cameraPosition} - ${vPosition});`,
                `vec3 lightDistance = ${pointLightPosition} - ${vPosition};`,
                `vec3 lightDirection = normalize(lightDistance);`,
                `vec3 color = calculateLight(${vColor}.rgb,lightDirection, ${pointLightColor}, ${pointLightAmbientStrength}, ${materialShininess}, cameraPosition, normal);`,
                `float attenuation = clamp(${pointLightIntensity} / length(lightDistance), 0.0, 1.0);`,
                'color *= attenuation;',
                `color = calculateFog(${fogDistance}, ${fogColor}, ${vDistance}, color);`,
                `gl_FragColor =  vec4(color, ${vColor}.a);`,
                '}'
            ].join('\n'), GLSLShader.precision.high);

            const result = new GLSLMaterial(vertexShader, fragmentShader);
            result.id = material.id;
            return result;
        }
    }

    static calculateLight = [
        'vec3 calculateLight(vec3 fragmentColor, vec3 lightDirection, vec3 lightColor, float ambientStrength, float shininess, vec3 cameraPosition, vec3 normal){',
        'vec3 ambient = fragmentColor * lightColor * ambientStrength;',
        'float nDotL = max(dot(lightDirection, normal), 0.0);',
        'vec3 diffuse = fragmentColor * lightColor * nDotL;',
        'vec3 reflectionDirection = 2.0 * dot(normal,lightDirection) * normal - lightDirection;',
        'float spec = pow(max(dot(cameraPosition, reflectionDirection), 0.0), shininess);',
        'vec3 specular = spec * lightColor;', //'vec3 specular = spec * vec3(1.0);',
        'return (diffuse + specular + ambient);',
        '}',
    ].join('\n');

    static calculateFog = [
        'vec3 calculateFog(vec2 fogDistance, vec3 fogColor, float distance, vec3 color){',
        `float fogFactor = clamp((fogDistance.y - distance) / (fogDistance.y - fogDistance.x), 0.0, 1.0);`,
        `return mix(fogColor, color, fogFactor);`,
        '}',
    ].join('\n');
}