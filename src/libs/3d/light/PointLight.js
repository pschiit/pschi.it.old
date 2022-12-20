import Parameter from '../../renderer/graphics/shader/Parameter';
import LightNode from './LightNode';

export default class PointLight extends LightNode {
    constructor(color, position) {
        super(color);
        this.translate(position);
    }

    setScene(scene) {
        super.setScene(scene);
        const parameters = {};
        parameters[PointLight.parameters.color] = this.color.rgb;
        parameters[PointLight.parameters.position] = this.vertexMatrix.positionVector;
        parameters[PointLight.parameters.ambientStrength] = this.ambientStrength;
        parameters[PointLight.parameters.intensity] = this.intensity;
        scene.addTo(parameters);

        return this;
    }

    static parameters = {
        color: Parameter.vector3('pointLightColor', Parameter.qualifier.const),
        position: Parameter.vector3('pointLightPosition', Parameter.qualifier.const),
        ambientStrength: Parameter.number('pointLightAmbientStrength', Parameter.qualifier.const),
        intensity: Parameter.number('pointLightIntensity', Parameter.qualifier.const),
    };
}