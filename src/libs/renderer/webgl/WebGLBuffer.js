
import { Buffer } from '../../core/Buffer';
import { WebGLNode } from './WebGLNode';
import { WebGLRenderer } from './WebGLRenderer';

export class WebGLBuffer extends WebGLNode {
    /** Create a WebGLBuffer from a Buffer for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Buffer} buffer  Buffer
     */
    constructor(renderer, buffer, target) {
        super(renderer, buffer.id);
        this.target = target;
        this.location = renderer.gl.createBuffer();
        this.usage = buffer.usage === Buffer.usage.dynamic ? renderer.gl.DYNAMIC_DRAW
            : buffer.usage === Buffer.usage.stream ? renderer.gl.STREAM_DRAW
                : renderer.gl.STATIC_DRAW;

        this.type = buffer.data instanceof Float32Array ? renderer.gl.FLOAT
            : buffer.data instanceof Uint32Array ? renderer.gl.UNSIGNED_INT
                : buffer.data instanceof Uint16Array ? renderer.gl.UNSIGNED_SHORT
                    : buffer.data instanceof Uint8Array ? renderer.gl.UNSIGNED_BYTE
                        : null;

        if (target === renderer.gl.ELEMENT_ARRAY_BUFFER) {
            this.update = (buffer) => {
                renderer.elementArrayBuffer = this;
                renderer.gl.bufferData(this.target, buffer.data, this.usage);
            };
        } else {
            this.update = (buffer) => {
                renderer.arrayBuffer = this;
                renderer.gl.bufferData(this.target, buffer.data, this.usage);
            };
        }
    }
}