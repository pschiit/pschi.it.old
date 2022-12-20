import Parameter from '../../renderer/graphics/shader/Parameter';
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
        parameters[DirectionalLight.parameters.color] = this.color.rgb.scale(this.intensity);
        parameters[DirectionalLight.parameters.direction] = this.vertexMatrix.zAxis;
        parameters[DirectionalLight.parameters.ambientStrength] = this.ambientStrength;
        scene.addTo(parameters);

        return this;
    }

    static parameters = {
        color: Parameter.vector3('directionalLightColor', Parameter.qualifier.const),
        direction: Parameter.vector3('directionalLightDirection', Parameter.qualifier.const),
        ambientStrength: Parameter.number('directionalLightAmbientStrength', Parameter.qualifier.const),
    };
}