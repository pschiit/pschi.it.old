import Camera from '../../../../3d/camera/Camera';
import DirectionalLight from '../../../../3d/light/DirectionalLight';
import PointLight from '../../../../3d/light/PointLight';
import SpotLight from '../../../../3d/light/SpotLight';
import GridMaterial from '../../../../3d/material/GridMaterial';
import PhongMaterial from '../../../../3d/material/PhongMaterial';
import Node3d from '../../../../3d/Node3d';
import Node from '../../../../core/Node';
import Material from '../../Material';
import Render from '../../Render';
import VertexBuffer from '../../VertexBuffer';

export default class GLSLParameter extends Node {
    /** Create a GLSL Parameter
     * @param {string} qualifier parameter qualifier
     * @param {string} type parameter type
     * @param {string} name parameter name
     * @param {Number} arrayLength parameter array length(uniform array)
     */
    constructor(qualifier, type, name, arrayLength = null) {
        super();
        this.qualifier = qualifier;
        this.type = type;
        this.name = name;
        this.arrayLength = arrayLength;
    }

    /** Return the declaration line of the parameter.
     * Use to generate source of a GLSL shader
     * @returns {string} the declaration 'qualifier type name;'
    */
    get declaration() {
        if (this.arrayLength == 0) {
            return '';
        }
        return `${this.qualifier} ${this.type} ${this.name}${this.arrayLength > 0 ? `[${this.arrayLength}]` : ''};`
    }

    /** Return the parameter name.
     * @returns {string} the parameter name
    */
    toString() {
        return this.name;
    }

    /** GLSL parameter qualifier value
    */
    static qualifier = {
        attribute: 'attribute',
        uniform: 'uniform',
        varying: 'varying',
    };

    /** GLSL parameter type value
    */
    static type = {
        bool: 'bool',
        float: 'float',
        mat2: 'mat2',
        mat3: 'mat3',
        mat4: 'mat4',
        vec2: 'vec2',
        vec3: 'vec3',
        vec4: 'vec4',
        sampler2D: 'sampler2D',
        samplerCube: 'samplerCube',
    };

    static from = (name, length) => {
        const id = length ? `${name}_${length}` : name;
        if (!GLSLParameter.cache[id]) {
            GLSLParameter.cache[id] =
                name === VertexBuffer.positionName ? new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, VertexBuffer.positionName, length) :
                name === VertexBuffer.normalName ? new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, VertexBuffer.normalName, length) :
                name === VertexBuffer.colorName ? new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, VertexBuffer.colorName, length) :
                name === VertexBuffer.uvName ? new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec2, VertexBuffer.uvName, length) :
                name === 'v_' + VertexBuffer.positionName ? new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec3, 'v_' + VertexBuffer.positionName, length) :
                name === 'v_' + VertexBuffer.normalName ? new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec3, 'v_' + VertexBuffer.normalName, length) :
                name === 'v_' + VertexBuffer.colorName ? new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_' + VertexBuffer.colorName, length) :
                name === 'v_' + VertexBuffer.uvName ? new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec2, 'v_' + VertexBuffer.uvName, length) :

                name === Camera.positionName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Camera.positionName, length) :
                name === Camera.projectionMatrixName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Camera.projectionMatrixName, length) :
                name === Camera.backgroundColorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Camera.backgroundColorName, length) :
                name === Camera.fogDistanceName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec2, Camera.fogDistanceName, length) :
                name === 'v_' + Camera.fogDistanceName ? new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.float, 'v_' + Camera.fogDistanceName, length) :

                name === Node3d.vertexMatrixName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.vertexMatrixName, length) :
                name === Node3d.normalMatrixName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.normalMatrixName, length) :

                name === DirectionalLight.colorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, DirectionalLight.colorName, length) :
                name === DirectionalLight.directionName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, DirectionalLight.directionName, length) :
                name === DirectionalLight.ambientStrengthName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, DirectionalLight.ambientStrengthName, length) :

                name === PointLight.colorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PointLight.colorName, length) :
                name === PointLight.positionName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PointLight.positionName, length) :
                name === PointLight.ambientStrengthName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PointLight.ambientStrengthName, length) :
                name === PointLight.intensityName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PointLight.intensityName, length) :

                name === SpotLight.colorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, SpotLight.colorName, length) :
                name === SpotLight.positionName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, SpotLight.positionName, length) :
                name === SpotLight.directionName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, SpotLight.directionName, length) :
                name === SpotLight.radiusName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, SpotLight.radiusName, length) :
                name === SpotLight.innerRadiusName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, SpotLight.innerRadiusName, length) :
                name === SpotLight.ambientStrengthName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, SpotLight.ambientStrengthName, length) :
                name === SpotLight.intensityName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, SpotLight.intensityName, length) :

                name === Material.textureName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, Material.textureName, length) :

                name === PhongMaterial.shininessName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, PhongMaterial.shininessName, length) :
                name === PhongMaterial.ambientColorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PhongMaterial.ambientColorName, length) :
                name === PhongMaterial.diffuseColorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PhongMaterial.diffuseColorName, length) :
                name === PhongMaterial.specularColorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PhongMaterial.specularColorName, length) :
                name === PhongMaterial.emissiveColorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, PhongMaterial.emissiveColorName, length) :
                name === PhongMaterial.ambientTextureName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, PhongMaterial.ambientTextureName, length) :
                name === PhongMaterial.diffuseTextureName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, PhongMaterial.diffuseTextureName, length) :
                name === PhongMaterial.specularTextureName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, PhongMaterial.specularTextureName, length) :
                name === PhongMaterial.emissiveTextureName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.sampler2D, PhongMaterial.emissiveTextureName, length) :


                name === GridMaterial.distanceName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, GridMaterial.distanceName, length) :
                name === GridMaterial.sizesName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec2, GridMaterial.sizesName, length) :
                name === GridMaterial.colorName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, GridMaterial.colorName, length) :

                name === Render.colorIdName ? new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.vec3, Render.colorIdName, length) :
                    null;
        }
        return GLSLParameter.cache[id];
    }

    static cache = {};
}