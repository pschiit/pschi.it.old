import { Node } from './Node';

export class Buffer extends Node {
    constructor(data, step = 1) {
        super();
        this.usage = Buffer.usage.static;
        this.data = data;
        this.step = step;
        this.normalize = false;

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (!(child instanceof Buffer)
                || (this.type != child.data.constructor)) {
                this.removeChild(child);
                return;
            }
        });
    }

    get data() {
        if (this.childrens.length > 0) {
            const data = new this.type(this.length);
            const arrayStep = this.step;

            this.childrens.forEach(buffer => {
                const offset = buffer.offset;
                let position = 0;
                for (let i = 0; i < data.length; i += arrayStep) {
                    for (let j = 0; j < buffer.step; j++) {
                        data[offset + i + j] = buffer.data[position++];
                    }
                }
            });
            return data;
        }
        return this._data;
    }

    set data(v) {
        this._data = v;
    }

    get step() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.step; }, 0);
        }
        return this._step;
    }

    set step(v) {
        this._step = v;
    }

    get count() {
        return this.length / this.step;
    }

    get type() {
        if (this.childrens.length > 0) {
            return this.childrens[0].type;
        }
        return this.data.constructor;
    }

    get length() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.length; }, 0);
        }
        return this.data.length;
    }

    get BYTES_PER_PARENT_STEP() {
        return this.parent instanceof Buffer ? this.parent.BYTES_PER_STEP : this.BYTES_PER_STEP;
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
        if(this.parent instanceof Buffer){
            return this.parent.childrens
                .slice(0, this.parent.childrens.indexOf(this))
                .reduce((r, b) => { return r + b.step; }, 0);
        }
        return 0;
    }

    get mainBuffer(){
        return this.parent instanceof Buffer ? this.parent.mainBuffer : this;
    }

    static usage = {
        static: 'STATIC',
        dynamic: 'DYNAMIC',
        stream: 'STREAM',
    }
}