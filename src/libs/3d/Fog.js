import { Node } from '../core/Node';
import { Vector2 } from '../math/Vector2';

export class Fog extends Node {
    constructor(near, far, color) {
        super();
        this.distance = new Vector2(near, far);
        this.color = color;
    }

    static fogColorName = 'fogColor';
    static fogDistanceName = 'fogDistance';
}