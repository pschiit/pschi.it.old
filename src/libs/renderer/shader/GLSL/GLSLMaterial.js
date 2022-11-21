import { Camera } from '../../../3d/camera/Camera';
import { Fog } from '../../../3d/Fog';
import { DirectionalLight } from '../../../3d/light/DirectionalLight';
import { Node3d } from '../../../3d/Node3d';
import { GeometryBuffer } from '../../../math/geometry/GeometryBuffer';
import { GLSLParameter } from './GLSLParameter';
import { GLSLShader } from './GLSLShader';
import { LambertMaterial } from '../../../material/LambertMaterial';
import { Material } from '../../../material/Material';
import { PhongMaterial } from '../../../material/PhongMaterial';
import { PointLight } from '../../../3d/light/PointLight';

export class GLSLMaterial extends Material {
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
        const position = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, GeometryBuffer.positionName);
        const normal = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, GeometryBuffer.normalName);
        const color = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, GeometryBuffer.colorName);

        const vertexMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.vertexMatrixName);
        const normalMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.normalMatrixName);
        const cameraMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Camera.cameraMatrixName);
        const ambientLightColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Camera.ambientLightColorName);
        const fogColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Fog.fogColorName);
        const fogDistance = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec2, Fog.fogDistanceName);
        const directionalLightColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, DirectionalLight.lightColorName);
        const directionalLightDirection = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, DirectionalLight.lightDirectionName);
        const pointLightColor = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PointLight.lightColorName);
        const pointLightPosition = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PointLight.lightPositionName);

        const vDistance = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.float, 'v_' + Fog.fogDistanceName);
        const vColor = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_' + GeometryBuffer.colorName);

        if (material instanceof LambertMaterial) {
            const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
                position,
                normal,
                color,
                vertexMatrix,
                normalMatrix,
                cameraMatrix,
                ambientLightColor,
                directionalLightColor,
                directionalLightDirection,
                pointLightColor,
                pointLightPosition,
                vColor,
                vDistance,
            ], [
                'vec3 applyLight(vec3 normal, vec3 direction, vec3 color){',
                'float nDotL = max(dot(direction, normal), 0.0);',
                `vec3 diffuse = color * ${color}.rgb * nDotL;`,
                'return diffuse;',
                '}',
                'void main(){',
                `gl_Position = ${cameraMatrix} * ${vertexMatrix} * ${position};`,
                `${vDistance} = gl_Position.w;`,
                `vec3 normal = normalize(vec3(${normalMatrix} * ${normal}));`,
                `vec3 directionalLight = applyLight(normal, ${directionalLightDirection}, ${directionalLightColor});`,
                `vec3 pointLight = applyLight(normal, normalize(${pointLightPosition} - vec3(${vertexMatrix} * ${position})), ${pointLightColor});`,
                `vec3 ambient = ${ambientLightColor} * ${color}.rgb;`,
                `${vColor} = vec4(pointLight + directionalLight + ambient, ${color}.a);`,
                '}',
            ].join('\n'));

            const fragmentShader = new GLSLShader(GLSLShader.type.fragmentShader, [
                fogColor,
                fogDistance,
                vColor,
                vDistance
            ], [
                'void main(){',
                `float fogFactor = clamp((${fogDistance}.y - ${vDistance}) / (${fogDistance}.y - ${fogDistance}.x), 0.0, 1.0);`,
                `vec3 color = mix(${fogColor}, ${vColor}.rgb, fogFactor);`,
                `gl_FragColor =  vec4(color, ${vColor}.a);`,
                '}'
            ].join('\n'), GLSLShader.precision.high);

            const result = new GLSLMaterial(vertexShader, fragmentShader);
            result.id = material.id;
            return result;
        } else if (material instanceof PhongMaterial) {
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
                fogColor,
                fogDistance,
                ambientLightColor,
                directionalLightColor,
                directionalLightDirection,
                pointLightColor,
                pointLightPosition,
                vPosition,
                vNormal,
                vColor,
                vDistance
            ], [
                'vec3 applyLight(vec3 normal, vec3 direction, vec3 color){',
                'float nDotL = max(dot(direction, normal), 0.0);',
                `vec3 diffuse = color * ${vColor}.rgb * nDotL;`,
                'return diffuse;',
                '}',
                'void main(){',
                `vec3 normal = normalize(${vNormal});`,
                `vec3 directionalLight = applyLight(normal, ${directionalLightDirection}, ${directionalLightColor});`,
                `vec3 pointLight = applyLight(normal, normalize(${pointLightPosition} - ${vPosition}), ${pointLightColor});`,
                `vec3 ambient = ${ambientLightColor} * ${vColor}.rgb;`,
                `float fogFactor = clamp((${fogDistance}.y - ${vDistance}) / (${fogDistance}.y - ${fogDistance}.x), 0.0, 1.0);`,
                `vec3 color = mix(${fogColor}, vec3(directionalLight + pointLight + ambient), fogFactor);`,
                `gl_FragColor =  vec4(color, ${vColor}.a);`,
                '}'
            ].join('\n'), GLSLShader.precision.high);

            const result = new GLSLMaterial(vertexShader, fragmentShader);
            result.id = material.id;
            return result;
        }
    }
}