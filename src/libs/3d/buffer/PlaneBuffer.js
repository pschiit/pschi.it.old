import Color from '../../core/Color';
import Render from '../../renderer/graphics/Render';
import VertexBuffer from '../../renderer/graphics/buffer/VertexBuffer';

export default class PlaneBuffer extends VertexBuffer {
    constructor(width = 1, height = 1, color = null, uv = null, primitive = Render.primitive.triangles) {
        super();

        this.setDimensions(width, height);
        if (color) {
            this.setColor(color);
        }
        if (uv) {
            this.uv = uv;
        }
        this.setPrimitive(primitive);
        this.generateNormal();
    }

    setDimensions(width, height) {
        Object.defineProperty(this, 'width', {
            value: width,
            writable: false,
        });
        Object.defineProperty(this, 'height', {
            value: height,
            writable: false,
        });

        //center vertices
        const x = (width / 2),
            y = (width / 2);

        this.position = [
            -x, -y, 0,
            -x, y, 0,
            x, y, 0,
            x, -y, 0,];
    }

    setPrimitive(primitive) {
        this.primitive = primitive;
        if (primitive == Render.primitive.triangles) {
            this.index = [
                0, 1, 2, 2, 3, 0,];
        } else if (primitive == Render.primitive.lines) {
            this.index = [
                0, 1, 1, 2, 2, 3, 3, 0];
        } else {
            this.index = [0, 1, 2, 3];
        }
    }

    static rainbowColor = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
        1, 1, 1, 1];
}