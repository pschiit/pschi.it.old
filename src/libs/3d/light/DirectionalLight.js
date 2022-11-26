import Light from './Light';

export default class DirectionalLight extends Light {
    constructor(color, position, target) {
        super(color);
        this.translate(position);
        this.target = target;
    }

    get direction() {
        return this.worldPosition.substract(this.target).normalize();
    }

    static colorName = 'directionalLightColor';
    static directionName = 'directionalLightDirection';
    static ambientStrengthName = 'directionalLightAmbientStrength';
}