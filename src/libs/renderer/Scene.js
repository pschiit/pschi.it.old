import Node from '../core/Node';
import MathArray from '../math/MathArray';
export default class Scene extends Node {
    constructor() {
        super();
        this.cameras = [];
        this.renders = [];
        this.programs = [];
        this.buffers = {};
        this.indexes = {};
        this.materials = {};
        this.parameters = {};
    }

    updateSceneParameters(parameters) {
        for (const name in parameters) {
            let parameter = parameters[name];
            if (Number.isFinite(parameter)) {
                parameter = [parameter];
            }
            if (!this.parameters[name]) {
                this.parameters[name] = new MathArray(parameter);
            } else {
                this.parameters[name] = this.parameters[name].concat(parameter);
            }
        }
    }
} 