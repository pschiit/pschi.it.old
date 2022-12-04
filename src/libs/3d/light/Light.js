import Node3d from '../Node3d';

export default class Light extends Node3d {
    constructor(color) {
        super();
        this.lightParameters = {};
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

    setScene(scene) {
        super.setScene(scene);

        return this;
    }
}