import { Node } from '../../core/Node';

export class WebGLBuffer extends Node {
    /** Create a WebGL Buffer
     * @param {string} type buffer type
     * @param {string} usage buffer usage
     */
    constructor(type, usage) {
        super();
        this.type = type;
        this.usage = usage;
        this.data = null;
        this.location = null;
        this.stride = 0;
    }

    /** WebGL buffer type value
    */
    static type = {
        arrayBuffer: 'ARRAY_BUFFER',
        elementArrayBuffer: 'ELEMENT_ARRAY_BUFFER'
    }

    /** WebGL buffer usage value
    */
    static usage = {
        staticDraw: 'STATIC_DRAW',
        dynamicDraw: 'DYNAMIC_DRAW',
        streamDraw: 'STREAM_DRAW',
    }
}