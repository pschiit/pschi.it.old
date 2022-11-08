import { Node } from '../../core/Node';
import { GLSLShader } from '../../shader/GLSLShader';

export class WebGLShader extends Node {
    /** Create a GLSLShader
     * @param {string} type WebGLShader type
     * @param {string} source source code of WebGLShader
     */
    constructor(type, source) {
        super();
        this.type = type;
        this.source = source
        this.location = null;
    }

    /** WebGLShader type value
    */
    static type = {
        vertexShader: 'VERTEX_SHADER',
        fragmentShader: 'FRAGMENT_SHADER'
    };
}