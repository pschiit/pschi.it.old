import Buffer from '../core/Buffer';
import RenderTarget from './RenderTarget';

export default class RenderBuffer extends Buffer {
    constructor(x = 0, y = 0, width = 1, height = 1, format = null) {
        super(new Uint8Array(0));
        this.x = x;
        this.y = y;
        this._width = width;
        this._height = height;
        this.format = format || RenderTarget.format.rgba;
    }

    get width() {
        return this._width;
    }

    set width(v) {
        if (this.width != v) {
            this._width = v;
            resize(this);
        }
    }

    get height() {
        return this._height;
    }

    set height(v) {
        if (this.height != v) {
            this._height = v;
            resize(this);
        }
    }

    get format() {
        return this._format;
    }

    set format(v) {
        if (this.format != v) {
            this._format = v;
            this.step = this.format === RenderTarget.format.rgba ? 4
                : this.format === RenderTarget.format.rbg ? 3
                    : 1;
            resize(this);
        }
    }
}

function resize(renderBuffer) {
    const data = new renderBuffer.type(renderBuffer.width * renderBuffer.height * renderBuffer.step);
    if (renderBuffer.data) {
        data.set(renderBuffer.data);
    }
    renderBuffer.data = data;
}