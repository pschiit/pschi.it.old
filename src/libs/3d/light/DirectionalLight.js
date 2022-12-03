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


    setScene(scene) {
        super.setScene(scene);
        if (this.on) {
            const parameters = {};
            parameters[DirectionalLight.colorName] = this.color.rgb;
            parameters[DirectionalLight.directionName] = this.vertexMatrix.positionVector.substract(this.target).normalize();
            parameters[DirectionalLight.ambientStrengthName] = this.ambientStrength;
            scene.setParameter(parameters);
        }

        return this;
    }

    static colorName = 'directionalLightColor';
    static directionName = 'directionalLightDirection';
    static ambientStrengthName = 'directionalLightAmbientStrength';
}