import MathArray from '../../math/MathArray';
import GraphicsNode from './GraphicsNode';

export default class Light extends GraphicsNode {
    constructor(color) {
        super();
        this.color = color;
        this.ambientStrength = 0.1;
        this.intensity = 1;
    }

    get on() {
        return this.intensity > 0;
    }

    toggle() {
        const cache = this._intensity || 0;
        this._intensity = this.intensity;
        this.intensity = cache;
    }

    setScene(parameters) {
        // if(!parameters.lights){
        //     parameters.lights = [];
        // }
        // parameters.lights.push(this);
        for (const name in this.parameters) {
            let parameter = this.parameters[name];
            if (Number.isFinite(parameter)) {
                parameter = [parameter];
            }
            if (!parameters[name]) {
                parameters[name] = new MathArray(parameter);
            } else {
                parameters[name] = parameters[name].concat(parameter);
            }
        }

        return this;
    }
}