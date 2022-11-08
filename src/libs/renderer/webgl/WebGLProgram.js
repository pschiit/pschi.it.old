import { Node } from '../../core/Node';
import { WebGLShader } from './WebGLShader';

export class WebGLProgram extends Node {
    /** Create a WebGL Program
     * @param {WebGLShader} vertexShader vertex shader of the program
     * @param {WebGLShader} fragmentShader fragment shader of the program
     */
    constructor(vertexShader, fragmentShader) {
        super();
        this.attributes = {};
        this.uniforms = {};
        this.location = null;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }
}