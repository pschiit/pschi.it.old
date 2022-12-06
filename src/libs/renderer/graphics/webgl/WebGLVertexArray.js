import Material from '../Material';
import VertexBuffer from '../buffer/VertexBuffer';
import WebGLBuffer from './WebGLBuffer';
import WebGLNode from './WebGLNode';
import WebGLProgram from './WebGLProgram';
import WebGLRenderer from './WebGLRenderer';

export default class WebGLVertexArray extends WebGLNode {
    /** Create a WebGLVertexArray from a Node for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {VertexBuffer} vertexBuffer  associated Render
     * @param {Material} material  associated Material
     */
    constructor(renderer, vertexBuffer, material) {
        super(renderer, vertexBuffer.id + '_' + material.id);
        this.location = renderer.gl.createVertexArray();
        renderer.vertexArray = this;
        const program = WebGLProgram.from(renderer, material);
        if (vertexBuffer.index) {
            renderer.elementArrayBuffer = WebGLBuffer.from(renderer, vertexBuffer.index, renderer.gl.ELEMENT_ARRAY_BUFFER);
        }
        for (const name in program.parameters) {
            const buffer = vertexBuffer.getParameter(name);
            if (buffer) {
                program.parameters[name](buffer);
            }
        }
        renderer.vertexArray = null;
        renderer.arrayBuffer = null;
        renderer.elementArrayBuffer = null;
    }

    /** Return whether or not this WebGLVertexArray has been created from the VertexBuffer and Material
     * @param {VertexBuffer|Material} vertexBuffer  vertex buffer to compare
     * @param {Material} material  material to compare
     */
    is(vertexBuffer, material = null) {
        const values = this.name.split('_');
        return vertexBuffer && (values[0] == vertexBuffer.id || values[1] == vertexBuffer.id)
            && (!material || values[1] == material.id);
    }

    /** Get the VertexBuffer and Material corresponding WebGLVertexArray from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {VertexBuffer} vertexBuffer  vertex buffer
     * @param {Material} material  material
     * @returns {WebGLVertexArray} the WebGLVertexArray
     */
    static from(renderer, vertexBuffer, material) {
        return renderer.nodes[vertexBuffer.id + '_' + material.id] || new WebGLVertexArray(renderer, vertexBuffer, material);
    }
}