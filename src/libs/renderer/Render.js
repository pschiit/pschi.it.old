import { Node } from '../core/Node';

export class Render extends Node {
    /** Create a Render readable by a Renderer
     */
    constructor() {
        super();
        this.primitive = null;
        this.material = null;
        this.index = null;
        this.parameters = {};
        this.count = 0;
        this.offset = 0;
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