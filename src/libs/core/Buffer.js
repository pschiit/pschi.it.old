import { Node } from './Node';

export class Buffer extends Node {
    constructor(data, step = 1) {
        super();
        this.usage = Buffer.usage.static;
        this.data = data;
        this.step = step;
        this.normalize = false;
        this._index = null;
    }

    get index() {
        return this._index;
    }

    set index(v) {
        if (Array.isArray(v)) {
            v = new Buffer.defaultIndexType(v);
        }
        if (this._index) {
            this._index.data = v;
        } else{
            this._index =  new Buffer(v);
        }
    }

    get count() {
        if (this.index) {
            return this.index.length;
        }
        return this.length / this.step;
    }

    get type() {
        return this.data.constructor;
    }

    get length() {
        return this.data.length;
    }

    get BYTES_PER_STEP() {
        return this.data.BYTES_PER_ELEMENT * this.step;
    }

    get BYTES_PER_OFFSET() {
        return this.data.BYTES_PER_ELEMENT * this.offset;
    }

    get BYTES_PER_ELEMENT() {
        return this.data.BYTES_PER_ELEMENT;
    }

    get offset() {
        if (!this.parent) {
            return 0;
        }
        return this.parent.childrens
            .slice(0, this.parent.childrens.indexOf(this))
            .reduce((r, b) => { return r + b.step; }, 0);
    }

    static usage = {
        static: 'STATIC',
        dynamic: 'DYNAMIC',
        stream: 'STREAM',
    }

    static defaultIndexType = Uint32Array.prototype.constructor;
}