
import Buffer from '../../core/Buffer';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';

export default class WebGLBuffer extends WebGLNode {
    /** Create a WebGLBuffer from a Buffer for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Buffer} buffer  Buffer
     * @param {Number} webGLTarget  WebGL target
     */
    constructor(renderer, buffer, webGLTarget) {
        super(renderer, buffer.id);
        this.target = webGLTarget;
        this.location = renderer.gl.createBuffer();
        this.usage = buffer.usage === Buffer.usage.dynamic ? renderer.gl.DYNAMIC_DRAW
            : buffer.usage === Buffer.usage.stream ? renderer.gl.STREAM_DRAW
                : renderer.gl.STATIC_DRAW;

        this.type = buffer.data instanceof Float32Array ? renderer.gl.FLOAT
            : buffer.data instanceof Uint32Array ? renderer.gl.UNSIGNED_INT
                : buffer.data instanceof Uint16Array ? renderer.gl.UNSIGNED_SHORT
                    : buffer.data instanceof Uint8Array ? renderer.gl.UNSIGNED_BYTE
                        : null;

        if (webGLTarget === renderer.gl.ELEMENT_ARRAY_BUFFER) {
            this.update = (buffer) => {
                if (buffer.updated) {
                    renderer.elementArrayBuffer = this;
                    renderer.gl.bufferData(this.target, buffer.data, this.usage);
                    buffer.updated = false;
                }
            };
        } else {
            this.update = (buffer) => {
                if (buffer.updated) {
                    renderer.arrayBuffer = this;
                    renderer.gl.bufferData(this.target, buffer.data, this.usage);
                    buffer.updated = false;
                }
            };
        }
    }

    /** Return whether or not this WebGLBuffer has been created from the Buffer
     * @param {Buffer} buffer  Buffer to compare
     */
    is(buffer){
        return this.name == buffer.id;
    }

    /** Get the Buffer's WebGLBuffer from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the rendering context
     * @param {Buffer} buffer the Buffer
     * @param {Number} webGLTarget  WebGL target
     */
    static from(renderer, buffer, webGLTarget) {
        return renderer.nodes[buffer.id] || new WebGLBuffer(renderer, buffer, webGLTarget);
    }
}