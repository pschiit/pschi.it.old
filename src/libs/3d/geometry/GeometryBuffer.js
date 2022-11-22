import Buffer from'../../core/Buffer';

export default class  GeometryBuffer extends Buffer {
    constructor(data = new Float32Array()) {
        super(data, 0);
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

    get count() {
        return this.index ? this.index.length : super.count;
    }

    get position() {
        return this.getParameter(this.positionName);
    }

    set position(v) {
        this.setSubBuffer(this.positionName, v, this.positionLength);
    }

    get normal() {
        return this.getParameter(this.normalName);
    }

    set normal(v) {
        this.setSubBuffer(this.normalName, v, this.normalLength);
    }

    get color() {
        return this.getParameter(this.colorName);
    }

    set color(v) {
        this.setSubBuffer(this.colorName, v, this.colorLength);
    }

    get uv() {
        return this.getParameter(this.uvName);
    }

    set uv(v) {
        this.setSubBuffer(this.uvName, v, this.uvLength);
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

    static positionName = 'vertexPosition';
    static normalName = 'vertexNormal';
    static colorName = 'vertexColor';
    static uvName = 'vertexUV';

    static positionLength = 3;
    static normalLength = 3;
    static colorLength = 4;
    static uvLength = 2;
}