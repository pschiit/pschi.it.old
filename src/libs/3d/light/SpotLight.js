import MathArray from '../../math/MathArray';
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
    
    setScene(paramters) {
        super.setScene(paramters);
        const lightParameters = {};
        lightParameters[LightMaterial.parameters.spotLightColor] = this.color.rgb;
        lightParameters[LightMaterial.parameters.spotLightPosition]=  this.vertexMatrix.positionVector;
        lightParameters[LightMaterial.parameters.spotLightDirection]= this.vertexMatrix.zAxis;
        lightParameters[LightMaterial.parameters.spotLightInnerRadius]= this.innerRadius;
        lightParameters[LightMaterial.parameters.spotLightRadius]= this.radius;
        lightParameters[LightMaterial.parameters.spotLightAmbientStrength]= this.ambientStrength;
        lightParameters[LightMaterial.parameters.spotLightIntensity]= this.intensity;
        addTo(paramters, lightParameters);

        return this;

        function addTo(parameters, lightParameters) {
            for (const name in lightParameters) {
                let parameter = lightParameters[name];
                if (Number.isFinite(parameter)) {
                    parameter = [parameter];
                }
                if (!parameters[name]) {
                    parameters[name] = new MathArray(parameter);
                } else {
                    parameters[name] = parameters[name].concat(parameter);
                }
            }
        }
    }
}