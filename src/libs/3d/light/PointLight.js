import { Light } from './Light';

export class PointLight extends Light {
    constructor(color, position) {
        super(color);
        this.translate(position);
    }
    static lightColorName = 'pointLightColor';
    static lightPositionName = 'pointLightPosition';
}