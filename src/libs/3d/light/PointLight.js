import Light from'./Light';

export default class  PointLight extends Light {
    constructor(color, position) {
        super(color);
        this.lightIndex = PointLight.created.length;
        PointLight.created.push(this);
        this.translate(position);
    }

    static created = [];
    static colorName = 'pointLightColor';
    static positionName = 'pointLightPosition';
    static ambientStrengthName = 'pointLightAmbientStrength';
    static intensityName = 'pointLightIntensity';
}