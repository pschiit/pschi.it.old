import LightMaterial from '../material/LightMaterial';
import LightNode from './LightNode';

export default class PointLight extends LightNode {
    constructor(color, position) {
        super(color);
        this.translate(position);
    }

    setScene(scene) {
        super.setScene(scene);
        const parameters = {};
        parameters[LightMaterial.parameters.pointLightColor] = this.color.rgb;
        parameters[LightMaterial.parameters.pointLightPosition] = this.vertexMatrix.positionVector;
        parameters[LightMaterial.parameters.pointLightAmbientStrength] = this.ambientStrength;
        parameters[LightMaterial.parameters.pointLightIntensity] = this.intensity;
        scene.addTo(parameters);

        return this;
    }
}