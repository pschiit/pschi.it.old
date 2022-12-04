import Node from '../core/Node';

export default class RenderTarget extends Node {
    constructor(x, y, width, height) {
        super();
        this.data = null;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.format = RenderTarget.format.rgba;
        this.scissor = false;
        this.material = null;
        this.output = null;
    }

    get aspectRatio() {
        return this.width / this.height;
    }

    static format = {
        rgba: 'RGBA',
        rgb: 'RGB',
        alpha: 'ALPHA'
    };
    static test = {
        blabla: 'test',
        second: 'encore'
    }
}