import Light from './Light';

export default class SpotLight extends Light {
    constructor(color, radius, position, target) {
        super(color);
        this.translate(position);
        this.radius = radius;
        this.innerRadius = radius;
        this.target = target;
    }

    get direction() {
        return this.worldPosition.substract(this.target).normalize();
    }

    static colorName = 'spotLightColor';
    static innerRadiusName = 'spotLightInnerRadius';
    static radiusName = 'spotLightRadius';
    static positionName = 'spotLightPosition';
    static directionName = 'spotLightDirection';
    static ambientStrengthName = 'spotLightAmbientStrength';
    static intensityName = 'spotLightIntensity';
}