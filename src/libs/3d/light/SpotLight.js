import LightMaterial from '../material/LightMaterial';
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
        parameters[LightMaterial.parameters.spotLightColor] = this.color.rgb;
        parameters[LightMaterial.parameters.spotLightPosition]=  this.vertexMatrix.positionVector;
        parameters[LightMaterial.parameters.spotLightDirection]= this.vertexMatrix.zAxis;
        parameters[LightMaterial.parameters.spotLightInnerRadius]= this.innerRadius;
        parameters[LightMaterial.parameters.spotLightRadius]= this.radius;
        parameters[LightMaterial.parameters.spotLightAmbientStrength]= this.ambientStrength;
        parameters[LightMaterial.parameters.spotLightIntensity]= this.intensity;
        scene.addTo(parameters);

        return this;
    }
}