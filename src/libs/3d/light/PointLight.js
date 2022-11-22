import Light from'./Light';

export default class  PointLight extends Light {
    constructor(color, position) {
        super(color);
        this.translate(position);
    }

    static colorName = 'pointLightColor';
    static positionName = 'pointLightPosition';
    static ambientStrengthName = 'pointLightAmbientStrength';
    static intensityName = 'pointLightIntensity';
}