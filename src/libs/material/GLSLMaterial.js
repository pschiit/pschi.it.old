import { GLSLShader } from '../renderer/shader/GLSL/GLSLShader';
import { Material } from './Material';

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
}