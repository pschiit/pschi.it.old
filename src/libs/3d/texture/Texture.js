import Node from '../../core/Node';

export default class Texture extends Node {
    constructor(data, width = null, height = null) {
        super();
        this.data = data;
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.updated = true;
        this.format = null;
        this.type = null;
        this.parameters = [];
    }

    get aspectRatio(){
        return this.width / this.height;
    }
}