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

    updateParameters(scene) {
        super.updateParameters(scene);
        if(this.on){
            const position = this.vertexMatrix.positionVector;
            this.setLightParameter(SpotLight.colorName, this.color.rgb);
            this.setLightParameter(SpotLight.positionName, position);
            this.setLightParameter(SpotLight.directionName, position.clone().substract(this.target).normalize());
            this.setLightParameter(SpotLight.innerRadiusName, this.innerRadius);
            this.setLightParameter(SpotLight.radiusName, this.radius);
            this.setLightParameter(SpotLight.ambientStrengthName, this.ambientStrength);
            this.setLightParameter(SpotLight.intensityName, this.intensity);
            scene.updateSceneParameters(this.lightParameters);
        }

        return this;
    }

    static colorName = 'spotLightColor';
    static innerRadiusName = 'spotLightInnerRadius';
    static radiusName = 'spotLightRadius';
    static positionName = 'spotLightPosition';
    static directionName = 'spotLightDirection';
    static ambientStrengthName = 'spotLightAmbientStrength';
    static intensityName = 'spotLightIntensity';
}