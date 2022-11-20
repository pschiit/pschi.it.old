import { Shader } from '../Shader';
import { GLSLParameter } from './GLSLParameter';

export class GLSLShader extends Shader {
    /** Create a GLSLShader
     * @param {string} type GLSLShader type
     * @param {GLSLParameter[]} parameters GLSLShader parameters
     * @param {string} script source code of GLSL without parameter declaration
     * @param {string} precision GLSLShader precision
     */
    constructor(type, parameters = [], script = '', precision = null) {
        super();
        this.type = type;
        this.parameters = parameters;
        this.script = script;
        this.precision = precision;
    }

    /** Return all the attributes of the current GLSLShader.
     * @returns {GLSLParameter[]} the attributes list
    */
    get attributes() {
        return this.parameters.filter(p => p.type == GLSLParameter.qualifier.attribute);
    }

    /** Return all the uniforms of the current GLSLShader.
     * @returns {GLSLParameter[]} the uniforms list
    */
    get uniforms() {
        return this.parameters.filter(p => p.type == GLSLParameter.qualifier.uniform);
    }

    /** Return all the varyings of the current GLSLShader.
     * @returns {GLSLParameter[]} the varyings list
    */
    get varyings() {
        return this.parameters.filter(p => p.type == GLSLParameter.qualifier.varying);
    }

    /** Return the source code of the GLSLShader.
     * @returns {string} the shader source code
    */
    get source() {
        const result = [];
        if (this.precision) {
            result.push(`precision ${this.precision} float;`);
        }
        this.parameters.forEach(p => {
            result.push(p.declaration);
        });
        result.push(this.script);

        return result.join('\n');
    }

    /** GLSLShader type value
    */
    static type = {
        vertexShader: 'VERTEX_SHADER',
        fragmentShader: 'FRAGMENT_SHADER'
    };

    /** GLSLShader precision value
    */
    static precision = {
        low: 'lowp',
        medium: 'mediump',
        high: 'highp'
    };
}