import Light from'./Light';

export default class  PointLight extends Light {
    constructor(color, position) {
        super(color);
        this.translate(position);
    }

    updateParameters(scene) {
        super.updateParameters(scene);
        if(this.on){
            this.setLightParameter(PointLight.colorName, this.color.rgb);
            this.setLightParameter(PointLight.positionName, this.vertexMatrix.positionVector);
            this.setLightParameter(PointLight.ambientStrengthName, this.ambientStrength);
            this.setLightParameter(PointLight.intensityName, this.intensity);
            scene.updateSceneParameters(this.lightParameters);
        }

        return this;
    }

    static colorName = 'pointLightColor';
    static positionName = 'pointLightPosition';
    static ambientStrengthName = 'pointLightAmbientStrength';
    static intensityName = 'pointLightIntensity';
}