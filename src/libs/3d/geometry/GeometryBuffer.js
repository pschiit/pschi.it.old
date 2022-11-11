import { ArrayBuffer } from '../../core/ArrayBuffer';
import { Buffer } from '../../core/Buffer';

export class GeometryBuffer extends ArrayBuffer {
    constructor(type = Float32Array) {
        super(type);
        
        this.primitive = GeometryBuffer.primitive;

        this.positionName = GeometryBuffer.positionName;
        this.normalName = GeometryBuffer.normalName;
        this.colorName = GeometryBuffer.colorName;
        this.uvName = GeometryBuffer.uvName;

        this.positionLength = GeometryBuffer.positionLength;
        this.normalLength = GeometryBuffer.normalLength;
        this.colorLength = GeometryBuffer.colorLength;
        this.uvLength = GeometryBuffer.uvLength;
    }

    get position() {
        return this[this.positionName];
    }

    set position(v) {
        if (v.constructor != this.type) {
            v = new this.type(v);
        }
        const buffer = this.position;
        if (!buffer) {
            const buffer = new Buffer(v, this.positionLength);
            buffer.name = this.positionName;
            this.appendChild(buffer);
        } else {
            buffer.data = v;
        }
    }

    get normal() {
        return this[this.normalName];
    }

    set normal(v) {
        if (v.constructor != this.type) {
            v = new this.type(v);
        }
        const buffer = this.normal;
        if (!buffer) {
            const buffer = new Buffer(v, this.normalLength);
            buffer.name = this.normalName;
            this.appendChild(buffer);
        } else {
            buffer.data = v;
        }
    }

    get color() {
        return this[this.colorName];
    }

    set color(v) {
        if (v.constructor != this.type) {
            v = new this.type(v);
        }
        const buffer = this.color;
        if (!buffer) {
            const buffer = new Buffer(v, this.colorLength);
            buffer.name = this.colorName;
            this.appendChild(buffer);
        } else {
            buffer.data = v;
        }
    }

    get uv() {
        return this[this.uvName];
    }

    set uv(v) {
        if (v.constructor != this.type) {
            v = new this.type(v);
        }
        const buffer = this.uv;
        if (!buffer) {
            const buffer = new Buffer(v, this.uvLength);
            buffer.name = this.uvName;
            this.appendChild(buffer);
        } else {
            buffer.data = v;
        }
    }
    static positionName = 'vertexPosition';
    static normalName = 'vertexNormal';
    static colorName = 'vertexColor';
    static uvName = 'vertexUV';

    static positionLength = 3;
    static normalLength = 3;
    static colorLength = 4;
    static uvLength = 2;

    static primitive = 'TRIANGLES';
}