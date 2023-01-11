import Render from '../../../libs/renderer/graphics/Render';
import VertexBuffer from '../../../libs/renderer/graphics/buffer/VertexBuffer';
import Boxel from '../node/Boxel';

export default class BoxelBuffer extends VertexBuffer {
    constructor() {
        super();

        this.primitive = Render.primitive.triangles;
        this.bevel(0.05);

        this.generateNormal();
        console.log(this, this.count)
    }

    bevel(b) {
        if (b) {
            this.position = [
                //near
                0 + b, 0 + b, 0,
                0 + b, size - b, 0,
                size - b, size - b, 0,
                size - b, 0 + b, 0,
                //near top
                0 + b, size - b, 0,
                0 + b, size, 0 + b,
                size - b, size, 0 + b,
                size - b, size - b, 0,
                //near top triangle
                size - b, size - b, 0,
                size - b, size, 0 + b,
                size, size - b, 0 + b,
                //near right
                size - b, 0 + b, 0,
                size - b, size - b, 0,
                size, size - b, 0 + b,
                size, 0 + b, 0 + b,
                //near bottom triangle
                size - b, 0, 0 + b,
                size - b, 0 + b, 0,
                size, 0 + b, 0 + b,
                //near bottom
                0 + b, 0, 0 + b,
                0 + b, 0 + b, 0,
                size - b, 0 + b, 0,
                size - b, 0, 0 + b,

                //right
                size, 0 + b, 0 + b,
                size, size - b, 0 + b,
                size, size - b, size - b,
                size, 0 + b, size - b,
                //right top
                size, size - b, 0 + b,
                size - b, size, 0 + b,
                size - b, size, size - b,
                size, size - b, size - b,
                //right top triangle
                size, size - b, size - b,
                size - b, size, size - b,
                size - b, size - b, size,
                //right right
                size, 0 + b, size - b,
                size, size - b, size - b,
                size - b, size - b, size,
                size - b, 0 + b, size,
                //right bottom triangle
                size - b, 0, size - b,
                size, 0 + b, size - b,
                size - b, 0 + b, size,
                //right bottom
                size - b, 0, 0 + b,
                size, 0 + b, 0 + b,
                size, 0 + b, size - b,
                size - b, 0, size - b,

                //top
                size - b, size, size - b,
                size - b, size, 0 + b,
                0 + b, size, 0 + b,
                0 + b, size, size - b,

                //far
                size - b, 0 + b, size,
                size - b, size - b, size,
                0 + b, size - b, size,
                0 + b, 0 + b, size,
                //far top
                size - b, size - b, size,
                size - b, size, size - b,
                0 + b, size, size - b,
                0 + b, size - b, size,
                //far top triangle
                0 + b, size - b, size,
                0 + b, size, size - b,
                0, size - b, size - b,
                //far right
                0 + b, 0 + b, size,
                0 + b, size - b, size,
                0, size - b, size - b,
                0, 0 + b, size - b,
                //far bottom triangle
                0 + b, 0, size - b,
                0 + b, 0 + b, size,
                0, 0 + b, size - b,
                //far bottom
                size - b, 0, size - b,
                size - b, 0 + b, size,
                0 + b, 0 + b, size,
                0 + b, 0, size - b,

                //left
                0, 0 + b, size - b,
                0, size - b, size - b,
                0, size - b, 0 + b,
                0, 0 + b, 0 + b,
                //left top
                0, size - b, size - b,
                0 + b, size, size - b,
                0 + b, size, 0 + b,
                0, size - b, 0 + b,
                //left top triangle
                0, size - b, 0 + b,
                0 + b, size, 0 + b,
                0 + b, size - b, 0,
                //left right
                0, 0 + b, 0 + b,
                0, size - b, 0 + b,
                0 + b, size - b, 0,
                0 + b, 0 + b, 0,
                //left bottom triangle
                0 + b, 0, 0 + b,
                0, 0 + b, 0 + b,
                0 + b, 0 + b, 0,
                //left bottom
                0 + b, 0, size - b,
                0, 0 + b, size - b,
                0, 0 + b, 0 + b,
                0 + b, 0, 0 + b,

                //bottom
                0 + b, 0, size - b,
                0 + b, 0, 0 + b,
                size - b, 0, 0 + b,
                size - b, 0, size - b,
            ];

            this.index = [
                0, 1, 2, 2, 3, 0,//near
                4, 5, 6, 6, 7, 4,//near top
                8, 9, 10,//near top triangle
                11, 12, 13, 13, 14, 11,//near right
                15, 16, 17,//near bottom triangle
                18, 19, 20, 20, 21, 18,//near top bottom

                22, 23, 24, 24, 25, 22,//right
                26, 27, 28, 28, 29, 26,//right top
                30, 31, 32,//right top triangle
                33, 34, 35, 35, 36, 33,//right right
                37, 38, 39,//right bottom triangle
                40, 41, 42, 42, 43, 40,//right bottom

                44, 45, 46, 46, 47, 44,//top

                48, 49, 50, 50, 51, 48,//far
                52, 53, 54, 54, 55, 52,//far top
                56, 57, 58,//far top triangle
                59, 60, 61, 61, 62, 59,//far right
                63, 64, 65,//far bottom triangle
                66, 67, 68, 68, 69, 66,//far bottom

                70, 71, 72, 72, 73, 70,//left
                74, 75, 76, 76, 77, 74,//left top
                78, 79, 80,//left top triangle
                81, 82, 83, 83, 84, 81,//left right
                85, 86, 87,//left bottom triangle
                88, 89, 90, 90, 91, 88,//left bottom

                92, 93, 94, 94, 95, 92,//top
            ];
        } else {
            this.position = [
                0, 0, 0,//near
                0, size, 0,
                size, size, 0,
                size, 0, 0,

                size, 0, 0,//right
                size, size, 0,
                size, size, size,
                size, 0, size,

                size, 0, size,//far
                size, size, size,
                0, size, size,
                0, 0, size,

                size, size, size,//top
                size, size, 0,
                0, size, 0,
                0, size, size,

                0, 0, size,//left
                0, size, size,
                0, size, 0,
                0, 0, 0,

                0, 0, size,//bottom
                0, 0, 0,
                size, 0, 0,
                size, 0, size];
            this.index = [
                0, 1, 2, 2, 3, 0,
                4, 5, 6, 6, 7, 4,
                8, 9, 10, 10, 11, 8,
                12, 13, 14, 14, 15, 12,
                16, 17, 18, 18, 19, 16,
                20, 21, 22, 22, 23, 20];
        }
    }
}
const size = Boxel.size;

function getIndex(primitive) {
    if (primitive == Render.primitive.lines) {
        return [
            0, 1, 1, 2, 2, 3, 3, 0,
            4, 5, 5, 6, 6, 7, 7, 4,
            8, 9, 9, 10, 10, 11, 11, 8,
            12, 13, 13, 14, 14, 15, 15, 12,
            16, 17, 17, 18, 18, 19, 19, 16,
            20, 21, 21, 22, 22, 23, 23, 20,
            // link the sides
            2, 5, 3, 4,     //px - pz
            6, 9, 7, 8,     // pz - nx
            10, 13, 11, 12, // nx - nz
            15, 0, 14, 1,   // nz - px

            // link the lids
            // top
            16, 0, 17, 3,   // px
            17, 4, 18, 7,   // pz
            18, 8, 19, 11,  // nx
            19, 12, 16, 15,  // nz
            // bottom
            20, 1, 21, 2,
            21, 5, 22, 6,
            22, 9, 23, 10,
            23, 13, 20, 14
        ];
    } else {
        return;
    }
}