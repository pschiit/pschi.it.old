import Node from '../core/Node';

export default class RenderTarget extends Node {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scissor = false;
    }

    get aspectRatio() {
        return this.width / this.height;
    }
}