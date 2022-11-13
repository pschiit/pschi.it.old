import { Render } from '../Render';
import { WebGLNode } from './WebGLNode';
import { WebGLBuffer } from './WebGLBuffer';
import { WebGLProgram } from './WebGLProgram';
import { WebGLRenderer } from './WebGLRenderer';

export class WebGLVertexArray extends WebGLNode {
    /** Create a WebGLVertexArray from a Node for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Render} render  associated Render
     */
    constructor(renderer, render) {
        super(renderer, render.id);
        this.location = renderer.gl.createVertexArray();
        renderer.vertexArray = this;
        const program = renderer[render.material.id] || new WebGLProgram(renderer, render.material);
        if (render.index) {
            renderer.elementArrayBuffer = renderer[render.index.id] || new WebGLBuffer(renderer, render.index, renderer.gl.ELEMENT_ARRAY_BUFFER);
        }
        for (const name in program.attributes) {
            program.attributes[name](render.parameters[name]);
        }
    }
}