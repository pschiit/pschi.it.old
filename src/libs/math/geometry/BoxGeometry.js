import { Render } from '../../renderer/Render';
import { GeometryBuffer } from './GeometryBuffer';

export class BoxGeometry extends GeometryBuffer {
    constructor(width = 1, height = 1, depth = 1, color = null, primitive = Render.primitive.triangles) {
        super();

        this.resize(width, height, depth);
        this.normal = [
            0, 0, -1,//F
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            1, 0, 0,//R
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            0, 0, 1,//B
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            0, 1, 0,//U
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            -1, 0, 0,//L
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            0, -1, 0,//D
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
        ];
        if (color) {
            this.color = [
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],

                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],

                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],

                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],

                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],

                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],
                color[0], color[1], color[2], color[3],];
        } else {
            this.color = [
                0, 0, 0, 1,
                0, 1, 0, 1,
                1, 1, 0, 1,
                1, 0, 0, 1,

                1, 0, 0, 1,
                1, 1, 0, 1,
                1, 1, 1, 1,
                1, 0, 1, 1,

                1, 0, 1, 1,
                1, 1, 1, 1,
                0, 1, 1, 1,
                0, 0, 1, 1,

                1, 1, 1, 1,
                1, 1, 0, 1,
                0, 1, 0, 1,
                0, 1, 1, 1,

                0, 0, 1, 1,
                0, 1, 1, 1,
                0, 1, 0, 1,
                0, 0, 0, 1,

                0, 0, 1, 1,
                0, 0, 0, 1,
                1, 0, 0, 1,
                1, 0, 1, 1,];
        }
        this.setPrimitive(primitive);
    }

    resize(width, height, depth) {
        Object.defineProperty(this, 'width', {
            value: width,
            writable: false,
        });
        Object.defineProperty(this, 'height', {
            value: height,
            writable: false,
        });
        Object.defineProperty(this, 'depth', {
            value: depth,
            writable: false,
        });

        //center vertices
        const x = (width / 2),
            y = (width / 2),
            z = (width / 2);

        this.position = [
            -x, -y, -z,//F
            -x, y, -z,
            x, y, -z,
            x, -y, -z,

            x, -y, -z,//R
            x, y, -z,
            x, y, z,
            x, -y, z,

            x, -y, z,//B
            x, y, z,
            -x, y, z,
            -x, -y, z,

            x, y, z,//U
            x, y, -z,
            -x, y, -z,
            -x, y, z,

            -x, -y, z,//L
            -x, y, z,
            -x, y, -z,
            -x, -y, -z,

            -x, -y, z,//D
            -x, -y, -z,
            x, -y, -z,
            x, -y, z,];
    }

    setPrimitive(primitive) {
        this.primitive = primitive;
        if (primitive == Render.primitive.triangles) {
            this.index = [
                0, 1, 2, 2, 3, 0,
                4, 5, 6, 6, 7, 4,
                8, 9, 10, 10, 11, 8,
                12, 13, 14, 14, 15, 12,
                16, 17, 18, 18, 19, 16,
                20, 21, 22, 22, 23, 20];
        } else if (primitive == Render.primitive.points) {
            this.index = [0, 1, 2, 3, 8, 9, 10, 11];
        } else if (primitive == Render.primitive.lines) {
            this.index = [
                0, 1, 1, 2, 2, 3, 3, 0,
                4, 5, 5, 6, 6, 7, 7, 4,
                8, 9, 9, 10, 10, 11, 11, 8,
                12, 13, 13, 14, 14, 15, 15, 12,
                16, 17, 17, 18, 18, 19, 19, 16,
                20, 21, 21, 22, 22, 23, 23, 20];
        }
    }
}