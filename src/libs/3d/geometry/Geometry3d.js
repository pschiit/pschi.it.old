import { Buffer } from '../../core/Buffer';

export class Geometry3d extends Buffer {
    constructor(data = new Float32Array()) {
        super(data, 0);
        this._index = null;

        this.primitive = null;

        this.positionName = Geometry3d.positionName;
        this.normalName = Geometry3d.normalName;
        this.colorName = Geometry3d.colorName;
        this.uvName = Geometry3d.uvName;

        this.positionLength = Geometry3d.positionLength;
        this.normalLength = Geometry3d.normalLength;
        this.colorLength = Geometry3d.colorLength;
        this.uvLength = Geometry3d.uvLength;
    }

    get index() {
        return this._index;
    }

    set index(v) {
        if (Array.isArray(v)) {
            v = new Uint32Array(v);
        }
        if(this.index){
            this.index.data = v;
        } else {
            this._index = new Buffer(v);
        }
    }

    get position() {
        return this.childrens.find(c => c.name == this.positionName);
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
        return this.childrens.find(c => c.name == this.normalName);
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
        return this.childrens.find(c => c.name == this.colorName);
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
        return this.childrens.find(c => c.name == this.uv);
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
}