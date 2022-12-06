import Vector4 from '../../math/Vector4';
import GraphicsNode from './GraphicsNode';
import Scene from './Scene';

export default class RenderTarget extends GraphicsNode {
    constructor(data, width = null, height = null, x = 0, y = 0) {
        super();
        this.viewport = new Vector4();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.data = data;
        this.format = RenderTarget.format.rgba;
        this.type = Uint8Array.constructor;
        this.scissor = null;
        this.read = null;
        this.texture = null;
        this.material = null;
    }

    get x() {
        return this.viewport[0];
    }

    set x(v) {
        this.viewport[0] = v;
    }

    get y() {
        return this.viewport[1];
    }

    set y(v) {
        this.viewport[1] = v;
    }

    get width() {
        return this.viewport[2];
    }

    set width(v) {
        this.viewport[2] = v;
    }

    get height() {
        return this.viewport[3];
    }

    set height(v) {
        this.viewport[3] = v;
    }

    get scene() {
        return this.data.scene;
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
        }
    }

    get size() {
        return this.width * this.height * this.step
    }

    get scissorSize() {
        return this.scissor ? this.scissor[2] * this.scissor[3] * this.step
            : 0;
    }

    get output() {
        if (this.read) {
            const length = this.read[2] * this.read[3] * this.step;
            if (this._readBuffer?.length != length) {
                this._readBuffer = new Uint8Array(length);
            }
            return this._readBuffer;
        } else {
            if (this._readBuffer) {
                this._readBuffer = null;
            }
            return null;
        }
    }

    get readSize() {
        return this.read ? this.read[2] * this.read[3] * this.step
            : 0;
    }

    get aspectRatio() {
        return this.width / this.height;
    }

    static format = {
        rgba: 'RGBA',
        rgb: 'RGB',
        alpha: 'ALPHA'
    };
    static test = {
        blabla: 'test',
        second: 'encore'
    }
}