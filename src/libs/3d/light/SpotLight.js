import Light from './Light';

export default class SpotLight extends Light {
    constructor(color, radius, position, target) {
        super(color);
        this.translate(position);
        this.radius = radius;
        this.innerRadius = radius;
        this.target = target;
    }
    
    setScene(scene) {
        super.setScene(scene);
        const parameters = {};
        const position = this.vertexMatrix.positionVector;
        parameters[SpotLight.colorName] = this.color.rgb;
        parameters[SpotLight.positionName]=  position;
        parameters[SpotLight.directionName]= position.clone().substract(this.target).normalize();
        parameters[SpotLight.innerRadiusName]= this.innerRadius;
        parameters[SpotLight.radiusName]= this.radius;
        parameters[SpotLight.ambientStrengthName]= this.ambientStrength;
        parameters[SpotLight.intensityName]= this.intensity;
        scene.setParameter(parameters);

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