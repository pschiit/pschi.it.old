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
        scene.setParameter(parameters);

        return this;
    }

    static parameters = {
        color: Parameter.vector3('pointLightColor', Parameter.qualifier.const),
        direction: Parameter.vector3('directionalLightDirection', Parameter.qualifier.const),
        ambientStrength: Parameter.number('pointLightAmbientStrength', Parameter.qualifier.const),
        intensity: Parameter.number('pointLightIntensity', Parameter.qualifier.const),
    };

    static colorName = 'pointLightColor';
    static positionName = 'pointLightPosition';
    static ambientStrengthName = 'pointLightAmbientStrength';
    static intensityName = 'pointLightIntensity';
}