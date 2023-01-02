import Light from '../../renderer/graphics/Light';
import LightMaterial from '../material/LightMaterial';
import Node3d from '../Node3d';

export default class PointLight extends Node3d {
    constructor(color, position) {
        super();
        this.light = new Light(color);
        this.translate(position);
    }

    setScene(parameters) {
        super.setScene(parameters);
        this.light.setParameter(LightMaterial.parameters.pointLightColor,this.light.color.rgb);
        this.light.setParameter(LightMaterial.parameters.pointLightPosition,this.vertexMatrix.positionVector);
        this.light.setParameter(LightMaterial.parameters.pointLightAmbientStrength,this.light.ambientStrength);
        this.light.setParameter(LightMaterial.parameters.pointLightIntensity,this.light.intensity);
        this.light.setScene(parameters);

        return this;
    }
}