import Parameter from '../../renderer/graphics/shader/Parameter';
import LightNode from './LightNode';

export default class SpotLight extends LightNode {
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
        parameters[SpotLight.parameters.color] = this.color.rgb;
        parameters[SpotLight.parameters.position]=  this.vertexMatrix.positionVector;
        parameters[SpotLight.parameters.direction]= this.vertexMatrix.zAxis;
        parameters[SpotLight.parameters.innerRadius]= this.innerRadius;
        parameters[SpotLight.parameters.radius]= this.radius;
        parameters[SpotLight.parameters.ambientStrength]= this.ambientStrength;
        parameters[SpotLight.parameters.intensity]= this.intensity;
        scene.setParameter(parameters);

        return this;
    }

    static parameters = {
        color: Parameter.vector3('spotLightColor', Parameter.qualifier.const),
        position: Parameter.vector3('spotLightPosition', Parameter.qualifier.const),
        direction: Parameter.vector3('spotLightDirection', Parameter.qualifier.const),
        ambientStrength: Parameter.number('spotLightAmbientStrength', Parameter.qualifier.const),
        radius: Parameter.number('spotLightRadius', Parameter.qualifier.const),
        innerRadius: Parameter.number('spotLightInnerRadius', Parameter.qualifier.const),
        intensity: Parameter.number('spotLightIntensity', Parameter.qualifier.const),
    };
}