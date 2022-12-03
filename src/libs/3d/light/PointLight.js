import Light from'./Light';

export default class  PointLight extends Light {
    constructor(color, position) {
        super(color);
        this.translate(position);
    }

    setScene(scene) {
        super.setScene(scene);
        if(this.on){
            const parameters = {};
            parameters[PointLight.colorName] = this.color.rgb;
            parameters[PointLight.positionName] = this.vertexMatrix.positionVector;
            parameters[PointLight.ambientStrengthName] = this.ambientStrength;
            parameters[PointLight.intensityName] =  this.intensity;
            scene.setParameter(parameters);
        }

        return this;
    }

    static colorName = 'pointLightColor';
    static positionName = 'pointLightPosition';
    static ambientStrengthName = 'pointLightAmbientStrength';
    static intensityName = 'pointLightIntensity';
}