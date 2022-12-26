import LightMaterial from '../material/LightMaterial';
import LightNode from './LightNode';

export default class DirectionalLight extends LightNode {
    constructor(color, position, target) {
        super(color);
        this.translate(position);
        this.target = target;
    }

    setScene(scene) {
        super.setScene(scene);
        const parameters = {};
        parameters[LightMaterial.parameters.directionalLightColor] = this.color.rgb.scale(this.intensity);
        parameters[LightMaterial.parameters.directionalLightDirection] = this.vertexMatrix.zAxis;
        parameters[LightMaterial.parameters.directionalLightAmbientStrength] = this.ambientStrength;
        scene.addTo(parameters);

        return this;
    }
}