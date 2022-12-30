import GraphicsNode from './GraphicsNode';
import RenderTarget from './RenderTarget';

export default class Texture extends GraphicsNode {
    constructor(data) {
        super();
        this.data = data;
        this.updated = true;
        this.width = null;
        this.height = null;
        this.level = 0;
        this.format = RenderTarget.format.rgba;
        this.type = Uint8Array.constructor;
        this.mipmap = false;
    }

    get type(){
        return this.data.type || this._type;
    }

    set type(v){
        this._type = v;
    }
}