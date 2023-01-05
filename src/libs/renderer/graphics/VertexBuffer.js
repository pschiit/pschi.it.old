import Buffer from '../../core/Buffer';
import GraphicsNode from './GraphicsNode';
import Material from './Material';

export default class VertexBuffer extends GraphicsNode {
    constructor() {
        super();
        this._index = null;
        this.primitive = null;
        this.count = 0;
        this.offset = 0;

        this.positionLength = 3;
        this.normalLength = 3;
        this.colorLength = 4;
        this.uvLength = 2;
    }

    get index() {
        return this._index;
    }

    set index(v) {
        if (v) {
            if (Array.isArray(v)) {
                v = this.count < 255 ? new Uint8Array(v)
                    : this.count < 65535 ? new Uint16Array(v)
                        : new Uint32Array(v);
            }
            if (this.index) {
                this.index.data = v;
            } else {
                this._index = new Buffer(v);
            }
        } else {
            this.index = null;
        }
    }

    get count() {
        return this.index ? this.index.length : this._count;
    }

    set count(v) {
        this._count = v;
    }

    get offset() {
        return this.index ? this.index.offset : this._offset;
    }

    set offset(v) {
        this._offset = v;
    }

    get divisor() {
        return this.instanceArrayBuffer?.divisor ||
            this.buffers.find(b => b.divisor > 0)?.divisor;
    }

    get divisorCount() {
        return this.instanceArrayBuffer?.divisorCount ||
            this.buffers.find(b => b.divisor > 0)?.divisorCount;
    }

    get position() {
        return this.getParameter(Material.parameters.position);
    }

    set position(v) {
        this.setParameter(Material.parameters.position.name, v, this.positionLength);
    }

    get normal() {
        return this.getParameter(Material.parameters.normal);
    }

    set normal(v) {
        this.setParameter(Material.parameters.normal.name, v, this.normalLength);
    }

    get color() {
        return this.getParameter(Material.parameters.color);
    }

    set color(v) {
        this.setParameter(Material.parameters.color.name, v, this.colorLength);
    }

    get uv() {
        return this.getParameter(Material.parameters.uv);
    }

    set uv(v) {
        this.setParameter(Material.parameters.uv.name, v, this.uvLength);
    }

    get buffers() {
        const result = [];
        for (const name in this.parameters) {
            const parameter = this.getParameter(name);
            if (parameter instanceof Buffer) {
                result.push(parameter);
            }
        }
        return result;
    }

    get arrayBuffer() {
        if (!this._arrayBuffer) {
            this._arrayBuffer = new Buffer();
        }
        this.buffers.forEach(b => {
            if (!b.divisor && b.parent != this._arrayBuffer) {
                this._arrayBuffer.appendChild(b);
            }
        });
        return this._arrayBuffer;
    }

    get instanceArrayBuffer() {
        if (!this._instanceArrayBuffer) {
            this._instanceArrayBuffer = new Buffer();
        }
        this.buffers.forEach(b => {
            if (b.divisor && b.parent != this._instanceArrayBuffer) {
                this._instanceArrayBuffer.appendChild(b);
            }
        });
        return this._instanceArrayBuffer;
    }

    setParameter(name, v, step, divisor) {
        let buffer = this.getParameter(name);
        if (v) {
            if (v instanceof Buffer && v != buffer) {
                super.setParameter(name, v);
            } else {
                if (Array.isArray(v)) {
                    v = new Float32Array(v);
                }
                if (!buffer) {
                    buffer = new Buffer(v, step, divisor);
                    super.setParameter(name, buffer);

                } else {
                    buffer.data = v;
                }
            }
        } else if (buffer) {
            super.setParameter(name, null);
        }

        return buffer;
    }

    transform(matrix) {
        let buffer = this.position;
        if (buffer) {
            buffer.transform(matrix);
        }
        buffer = this.normal;
        if (buffer) {
            buffer.transform(matrix.inverse.transpose());
        }
    }
}