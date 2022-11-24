import Render from '../Render';
import WebGLNode from './WebGLNode';
import WebGLBuffer from './WebGLBuffer';
import WebGLProgram from './WebGLProgram';
import WebGLRenderer from './WebGLRenderer';
import Material from '../../3d/material/Material';

export default class WebGLVertexArray extends WebGLNode {
    /** Create a WebGLVertexArray from a Node for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Render} render  associated Render
     * @param {Material} material  associated Material
     */
    constructor(renderer, render, material) {
        super(renderer, render.id + '_' + material.id);
        renderer.arrayBuffer = null;
        renderer.elementArrayBuffer = null;
        this.location = renderer.gl.createVertexArray();
        renderer.vertexArray = this;
        const program = renderer[material.id] || new WebGLProgram(renderer, material);
        if (render.indexBuffer) {
            renderer.elementArrayBuffer = renderer[render.indexBuffer.id] || new WebGLBuffer(renderer, render.indexBuffer, renderer.gl.ELEMENT_ARRAY_BUFFER);
        }
        for (const name in program.attributes) {
            if (render.parameters[name]) {
                program.attributes[name](render.parameters[name]);
            }
        }
        renderer.vertexArray = null;
        renderer.arrayBuffer = null;
        renderer.elementArrayBuffer = null;
    }
}