import MathArray from '../../math/MathArray';
import LightMaterial from '../material/LightMaterial';
import Node3d from '../Node3d';
import Light from '../../renderer/graphics/Light';

export default class SpotLight extends Node3d {
    constructor(color, radius, position, target) {
        super();
        this.light = new Light(color);
        this.translate(position);
        this.radius = radius;
        this.innerRadius = radius;
        this.target = target;
    }
    
    setScene(parameters) {
        super.setScene(parameters);
        this.light.setParameter(LightMaterial.parameters.spotLightColor,this.light.color.rgb);
        this.light.setParameter(LightMaterial.parameters.spotLightPosition, this.vertexMatrix.positionVector);
        this.light.setParameter(LightMaterial.parameters.spotLightDirection,this.vertexMatrix.zAxis);
        this.light.setParameter(LightMaterial.parameters.spotLightInnerRadius,this.innerRadius);
        this.light.setParameter(LightMaterial.parameters.spotLightRadius,this.radius);
        this.light.setParameter(LightMaterial.parameters.spotLightAmbientStrength,this.light.ambientStrength);
        this.light.setParameter(LightMaterial.parameters.spotLightIntensity,this.light.intensity);
        this.light.setScene(parameters);

        return this;
    }
}