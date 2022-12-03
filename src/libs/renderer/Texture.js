import RenderTarget from './RenderTarget';

export default class Texture extends RenderTarget {
    constructor(data, width = null, height = null) {
        super(0, 0, width, height);
        this.data = data;
        this.updated = true;
        this.format = null;
        this.type = null;
    }
}