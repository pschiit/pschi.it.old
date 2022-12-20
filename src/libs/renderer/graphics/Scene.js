import MathArray from '../../math/MathArray';
import GraphicsNode from './GraphicsNode';

export default class Scene extends GraphicsNode {
    constructor() {
        super();
        this.renderTarget = null;
        this.renders = [];
        this.programs = [];
        this.buffers = {};
        this.indexes = {};
        this.textures = {};
        this.materials = {};
        this.parameters = {};
    }

    addTo(name, value) {
        const parameters = name;
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