import Node from'../../../core/Node';
export default class  Shader extends Node {
    /** Create a Shader
     */
    constructor() {
        super();
        this._source = null;
        this.type = null;
    }

    get source() {
        return this._source;
    }

    set source(v) {
        this._source = v;
    }
}