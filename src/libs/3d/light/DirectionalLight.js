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


    updateParameters(scene) {
        super.updateParameters(scene);
        if (this.on) {
            this.setLightParameter(DirectionalLight.colorName, this.color.rgb);
            this.setLightParameter(DirectionalLight.directionName, this.vertexMatrix.positionVector.substract(this.target).normalize());
            this.setLightParameter(DirectionalLight.ambientStrengthName, this.ambientStrength);
            scene.updateSceneParameters(this.lightParameters);
        }

        return this;
    }

    static colorName = 'directionalLightColor';
    static directionName = 'directionalLightDirection';
    static ambientStrengthName = 'directionalLightAmbientStrength';
}