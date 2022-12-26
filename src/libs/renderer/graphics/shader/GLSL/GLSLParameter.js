import Node from '../../../../core/Node';

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
    
    static cache = {};
}