import Node3d from '../../../libs/3d/Node3d';

export default class Boxel extends Node3d {
    constructor(position, color) {
        super();
        this.position = position;
        this.color = color;
    }
}