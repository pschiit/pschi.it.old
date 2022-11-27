import Buffer from'../core/Buffer';

export default class  VertexBuffer extends Buffer {
    constructor(data = new Float32Array()) {
        super(data, 0);
        this.primitive = null;

        this.positionName = VertexBuffer.positionName;
        this.normalName = VertexBuffer.normalName;
        this.colorName = VertexBuffer.colorName;
        this.uvName = VertexBuffer.uvName;

        this.positionLength = VertexBuffer.positionLength;
        this.normalLength = VertexBuffer.normalLength;
        this.colorLength = VertexBuffer.colorLength;
        this.uvLength = VertexBuffer.uvLength;
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

    reverseNormal() {
        const normal = this.normal.data;
        this.normal = normal.map(n => n > 0 ? -1 
            : n < 0 ? 1 
            : 0);
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

    static positionName = 'vertexPosition';
    static normalName = 'vertexNormal';
    static colorName = 'vertexColor';
    static uvName = 'vertexUV';

    static positionLength = 3;
    static normalLength = 3;
    static colorLength = 4;
    static uvLength = 2;
}