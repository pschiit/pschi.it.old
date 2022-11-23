import Node3d from'../Node3d';

export default class Light extends Node3d {
    constructor(color) {
        super();
        this.color = color;
        this.ambientStrength = 0.1;
        this.intensity = 1;
        this.on = true;
    }
}