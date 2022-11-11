import { Node } from '../../../core/Node';

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