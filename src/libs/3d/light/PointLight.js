import MathArray from '../../math/MathArray';
import LightMaterial from '../material/LightMaterial';
import LightNode from './LightNode';

export default class PointLight extends LightNode {
    constructor(color, position) {
        super(color);
        this.translate(position);
    }

    setScene(parameters) {
        super.setScene(parameters);
        const lightParameters = {};
        lightParameters[LightMaterial.parameters.pointLightColor] = this.color.rgb;
        lightParameters[LightMaterial.parameters.pointLightPosition] = this.vertexMatrix.positionVector;
        lightParameters[LightMaterial.parameters.pointLightAmbientStrength] = this.ambientStrength;
        lightParameters[LightMaterial.parameters.pointLightIntensity] = this.intensity;
        addTo(parameters, lightParameters);

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