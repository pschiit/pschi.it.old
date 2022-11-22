import Node3d from'../Node3d';

export default class  Light extends Node3d {
    constructor(color) {
        super();
        this.color = color;
        this.ambientStrenght = 0.1;
        this.intensity = 1;
    }
    static lightColorName = 'lightColor';
}