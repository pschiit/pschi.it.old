import MathArray from '../../math/MathArray';
import OrthographicCamera from '../camera/OrthographicCamera';
import LightMaterial from '../material/LightMaterial';
import LightNode from './LightNode';

export default class DirectionalLight extends LightNode {
    constructor(color, position, target) {
        super(color);
        this.translate(position);
        this.target = target;
        this.camera = new OrthographicCamera(-10, 10, -10, 10, 0.1, 100);
    }

    setScene(parameters) {
        super.setScene(parameters);
        const lightParameters = {};
        lightParameters[LightMaterial.parameters.directionalLightColor] = this.color.rgb.scale(this.intensity);
        lightParameters[LightMaterial.parameters.directionalLightDirection] = this.vertexMatrix.zAxis;
        lightParameters[LightMaterial.parameters.directionalLightAmbientStrength] = this.ambientStrength;
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