import VertexBuffer from '../../../libs/renderer/graphics/buffer/VertexBuffer';
import Render from '../../../libs/renderer/graphics/Render';

export default class BeveledBoxBuffer extends VertexBuffer {
    constructor(width = 1, height = 1, depth = 1, beveled = 0.01, primitive = Render.primitive.triangles) {
        super();
        this.setPrimitive(primitive);
        this.setVertices(width, height, depth, beveled);
        this.generateNormal();
        console.log(this.position);
        console.log(this.normal.data);

    }

    setVertices(width, height, depth, beveled) {
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
        Object.defineProperty(this, 'beveled', {
            value: beveled,
            writable: false,
        });
        this.position = getPosition(width, height, depth, beveled);
    }

    setPrimitive(primitive) {
        this.primitive = primitive;
        this.index = getIndex(primitive);
    }
}

function getPosition(w, h, d, b) {
    let hw = w * 0.5, hh = h * 0.5, hd = d * 0.5;
    return [
        // px
        hw, hh - b, -hd + b,   // 0
        hw, -hh + b, -hd + b,  // 1
        hw, -hh + b, hd - b,   // 2
        hw, hh - b, hd - b,    // 3

        // pz
        hw - b, hh - b, hd,    // 4
        hw - b, -hh + b, hd,   // 5
        -hw + b, -hh + b, hd,  // 6
        -hw + b, hh - b, hd,   // 7

        // nx
        -hw, hh - b, hd - b,   // 8
        -hw, -hh + b, hd - b,  // 9
        -hw, -hh + b, -hd + b, // 10
        -hw, hh - b, -hd + b,  // 11

        // nz
        -hw + b, hh - b, -hd,  // 12
        -hw + b, -hh + b, -hd, // 13
        hw - b, -hh + b, -hd,  // 14
        hw - b, hh - b, -hd,   // 15

        // py
        hw - b, hh, -hd + b,   // 16
        hw - b, hh, hd - b,    // 17
        -hw + b, hh, hd - b,   // 18
        -hw + b, hh, -hd + b,  // 19

        // ny
        hw - b, -hh, -hd + b,  // 20
        hw - b, -hh, hd - b,   // 21
        -hw + b, -hh, hd - b,  // 22
        -hw + b, -hh, -hd + b  // 23
    ];
}

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
        return [
            0, 2, 1, 3, 2, 0,
            4, 6, 5, 7, 6, 4,
            8, 10, 9, 11, 10, 8,
            12, 14, 13, 15, 14, 12,
            16, 18, 17, 19, 18, 16,
            20, 21, 22, 23, 20, 22,

            // link the sides
            3, 5, 2, 4, 5, 3,
            7, 9, 6, 8, 9, 7,
            11, 13, 10, 12, 13, 11,
            15, 1, 14, 0, 1, 15,

            // link the lids
            // top
            16, 3, 0, 17, 3, 16,
            17, 7, 4, 18, 7, 17,
            18, 11, 8, 19, 11, 18,
            19, 15, 12, 16, 15, 19,
            // bottom
            1, 21, 20, 2, 21, 1,
            5, 22, 21, 6, 22, 5,
            9, 23, 22, 10, 23, 9,
            13, 20, 23, 14, 20, 13,

            // corners
            // top
            3, 17, 4,
            7, 18, 8,
            11, 19, 12,
            15, 16, 0,
            // bottom
            2, 5, 21,
            6, 9, 22,
            10, 13, 23,
            14, 1, 20
        ];
    }
}