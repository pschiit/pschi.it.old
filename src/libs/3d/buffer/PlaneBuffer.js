import Color from '../../core/Color';
import Render from '../../renderer/graphics/Render';
import VertexBuffer from '../../renderer/graphics/buffer/VertexBuffer';

export default class PlaneBuffer extends VertexBuffer {
    constructor(width = 1, height = 1, color = null, uv = null, primitive = Render.primitive.triangles) {
        super();

        this.setDimensions(width, height);
        this.normal = [
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
        ];

        if(uv){
            this.uv = uv;
        }
        if(color){
            this.setColor(color);
        }
        this.setPrimitive(primitive);
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
        } else {
            this.index = [0, 1, 2, 3];
        }
    }

    setColor(color) {
        if (color instanceof Color) {
            this.color = [
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3]];
        } else if (color) {
            this.color = color;
        }
    }

    static rainbowColor = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
        1, 1, 1, 1];
}