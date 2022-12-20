import Buffer from '../../core/Buffer';
import GraphicsNode from './GraphicsNode';
import Parameter from './shader/Parameter';

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

    get position() {
        return this.parameters[VertexBuffer.parameters.position.name];
    }

    set position(v) {
        this.setParameter(VertexBuffer.parameters.position.name, v, this.positionLength);
    }

    get normal() {
        return this.parameters[VertexBuffer.parameters.normal.name];
    }

    set normal(v) {
        this.setParameter(VertexBuffer.parameters.normal.name, v, this.normalLength);
    }

    get color() {
        return this.parameters[VertexBuffer.parameters.color.name];
    }

    set color(v) {
        this.setParameter(VertexBuffer.parameters.color.name, v, this.colorLength);
    }

    get uv() {
        return this.parameters[VertexBuffer.parameters.uv.name];
    }

    set uv(v) {
        this.setParameter(VertexBuffer.parameters.uv.name, v, this.uvLength);//.normalize = true;
    }

    setParameter(name, v, step, divisor) {
        let buffer = this.parameters[name];
        if (v) {
            if (v instanceof Buffer) {
                this.parameters[name] = v;
            } else {
                if (Array.isArray(v)) {
                    v = new Float32Array(v);
                }
                if (!buffer) {
                    this.parameters[name] = new Buffer(v, step, divisor);
                } else {
                    buffer.data = v;
                }
            }
        } else if (buffer) {
            this.parameters[name] = null;
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
            buffer.transform(matrix.clone().invert().transpose());
        }
    }

    static parameters = {
        position: Parameter.vector4('vertexPosition', Parameter.qualifier.let),
        normal: Parameter.vector4('vertexNormal', Parameter.qualifier.let),
        color: Parameter.vector4('vertexColor', Parameter.qualifier.let),
        uv: Parameter.vector2('vertexUV', Parameter.qualifier.let),
    }
}