import Light from './Light';

export default class DirectionalLight extends Light {
    constructor(color, position, target) {
        super(color);
        this.translate(position);
        this.target = target;
    }
    
    setScene(scene) {
        super.setScene(scene);
        const parameters = {};
        parameters[DirectionalLight.colorName] = this.color.rgb.scale(this.intensity);
        parameters[DirectionalLight.directionName] = this.vertexMatrix.zAxis;
        parameters[DirectionalLight.ambientStrengthName] = this.ambientStrength;
        scene.setParameter(parameters);

        return this;
    }

    static colorName = 'directionalLightColor';
    static directionName = 'directionalLightDirection';
    static ambientStrengthName = 'directionalLightAmbientStrength';
}