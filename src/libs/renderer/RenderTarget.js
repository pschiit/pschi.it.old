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
        this.materialOverride = null;
    }

    get aspectRatio() {
        return this.width / this.height;
    }

    static format = {
        rbga: 'rgba',
        rbg: 'rgb',
        alpha: 'alpha',
    }
}