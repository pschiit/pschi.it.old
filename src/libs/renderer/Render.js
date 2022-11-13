import { Buffer } from '../core/Buffer';
import { Node } from '../core/Node';

export class Render extends Node {
    /** Create a Render readable by a Renderer
     */
    constructor() {
        super();
        this.primitive = null;
        this.material = null;
        this.buffer = null;
        this.index = null;
        this.parameters = {};
        this.count = 0;
        this.offset = 0;
    }

    setIndex(values) {
        if (values) {
            if (Array.isArray(values)) {
                values = new Uint32Array(values);
            }
            if (this.index) {
                this.index.data = values;
            } else {
                this.index = new Buffer(values);
            }
        }
    }

    setParameter(name, value) {
        this.parameters[name] = value;
    }

    static primitive = {
        points: 'POINTS',
        triangles: 'TRIANGLES',
        triangleFan: 'TRIANGLE_FAN',
        triangleStrip: 'TRIANGLE_STRIP',
        lines: 'LINES',
        lineLoop: 'LINE_FAN',
        lineStrip: 'LINE_STRIP',
    };
}