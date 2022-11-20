import { Light } from './Light';

export class DirectionalLight extends Light {
    constructor(color, direction) {
        super(color);
        this.direction = direction;
    }
    static lightDirectionName = 'lightDirection';
}