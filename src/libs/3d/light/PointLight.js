import { Light } from './Light';

export class PointLight extends Light {
    constructor(color, position) {
        super(color);
        this.position = position;
    }
}