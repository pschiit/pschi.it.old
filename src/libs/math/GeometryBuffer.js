import { Buffer } from '../core/Buffer';
import { Render } from '../renderer/Render';

export class GeometryBuffer extends Buffer {
    constructor(data = new Float32Array()) {
        super(data, 0);
        this._index = null;
        this.primitive = null;

        this.positionName = GeometryBuffer.positionName;
        this.normalName = GeometryBuffer.normalName;
        this.colorName = GeometryBuffer.colorName;
        this.uvName = GeometryBuffer.uvName;

        this.positionLength = GeometryBuffer.positionLength;
        this.normalLength = GeometryBuffer.normalLength;
        this.colorLength = GeometryBuffer.colorLength;
        this.uvLength = GeometryBuffer.uvLength;
    }

    get index() {
        return this._index;
    }

    set index(v) {
        if (v) {
            if (Array.isArray(v)) {
                v = new Uint32Array(v);
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
        return this.index ? this.index.length : super.count;
    }

    get position() {
        return this.getParameter(this.positionName);
    }

    set position(v) {
        this.setParameter(this.positionName, v, this.positionLength);
    }

    get normal() {
        return this.getParameter(this.normalName);
    }

    set normal(v) {
        this.setParameter(this.normalName, v, this.normalLength);
    }

    get color() {
        return this.getParameter(this.colorName);
    }

    set color(v) {
        this.setParameter(this.colorName, v, this.colorLength);
    }

    get uv() {
        return this.getParameter(this.uvName);
    }

    set uv(v) {
        this.setParameter(this.uvName, v, this.uvLength);
    }

    applyMatrix(matrix) {
        let buffer = this.position;
        if (buffer) {
            buffer.applyMatrix(matrix);
        }
        buffer = this.normal;
        if (buffer) {
            buffer.normal.applyMatrix(matrix.clone().invertMatrix().transpose());
        }
    }

    createRender(material) {
        const render = new Render();
        render.material = material;
        if (this.primitive) {
            render.primitive = this.primitive;
        }
        if (this.index) {
            render.index = this.index;
        }
        this.childrens.forEach(b => {
            if (b.name) {
                render.setParameter(b.name, b);
            }
        });
        render.count = this.count;
        render.offset = this.offset;
        return render;
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