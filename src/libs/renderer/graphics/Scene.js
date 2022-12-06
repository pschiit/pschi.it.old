import MathArray from '../../math/MathArray';
import GraphicsNode from './GraphicsNode';

export default class Scene extends GraphicsNode {
    constructor() {
        super();
        this.camera = null;
        this.renders = [];
        this.programs = [];
        this.buffers = {};
        this.indexes = {};
        this.materials = {};
        this.parameters = {};
    }

    setParameter(name, value) {
        if(name.length){
            this.parameters[name] = value;
        }else{
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
} 