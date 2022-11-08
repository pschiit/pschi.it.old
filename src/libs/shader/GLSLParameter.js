import { Node } from '../core/Node';

export class GLSLParameter extends Node {
    /** Create a GLSL Parameter
     * @param {string} qualifier parameter qualifier
     * @param {string} type parameter type
     * @param {string} name parameter name
     */
    constructor(qualifier, type, name) {
        super();
        this.qualifier = qualifier
        this.type = type;
        this.name = name;
        this.setter = GLSLParameter.setter(qualifier, type);
    }

    /** Return the declaration line of the parameter.
     * Use to generate source of a GLSL shader
     * @returns {string} the declaration 'qualifier type name;'
    */
    get declaration() {
        return `${this.qualifier} ${this.type} ${this.name};`
    }

    /** Return the parameter name.
     * @returns {string} the parameter name
    */
    toString() {
        return this.name;
    }
    
    static setter(qualifier, type) {
        if (qualifier == GLSLParameter.qualifier.uniform) {
            switch (type) {
                case GLSLParameter.type.sampler2D:
                case GLSLParameter.type.bool:
                    return (value) => {
                        return 'uniform1i';
                    };
                case GLSLParameter.type.mat2:
                    return 'uniformMatrix2fv';
                case GLSLParameter.type.mat3:
                    return 'uniformMatrix3fv';
                case GLSLParameter.type.mat4:
                    return 'uniformMatrix4fv';
                case GLSLParameter.type.float:
                    return 'uniform1f';
                case GLSLParameter.type.vec2:
                    return 'uniform2fv';
                case GLSLParameter.type.vec3:
                    return 'uniform3fv';
                case GLSLParameter.type.vec4:
                    return 'uniform4fv';
                case GLSLParameter.type.samplerCube:
                default:
                    throw new Error(`${type} is missing getUniformSetter implementation.`);
            }
        } else if (qualifier == GLSLParameter.qualifier.attribute) {
            switch (type) {
                case GLSLParameter.type.float:
                    return 'vertexAttrib1f';
                case GLSLParameter.type.mat2:
                case GLSLParameter.type.vec2:
                    return 'vertexAttrib2fv';
                case GLSLParameter.type.mat3:
                case GLSLParameter.type.vec3:
                    return 'vertexAttrib3fv';
                case GLSLParameter.type.mat4:
                case GLSLParameter.type.vec4:
                    return 'vertexAttrib4fv';
                case GLSLParameter.type.samplerCube:
                default:
                    throw new Error(`${type} is missing getAttributeSetter implementation.`);
            }
        }
        return null;
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
}