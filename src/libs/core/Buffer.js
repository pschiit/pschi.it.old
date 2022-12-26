import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
import Vector4 from '../math/Vector4';
import Node from './Node';

export default class Buffer extends Node {
    constructor(data, step = 1, divisor = 0) {
        super();
        this.usage = Buffer.usage.static;
        this.data = data;
        this.step = step;
        this.divisor = divisor;
        this.normalize = false;
        this.updated = true;
        this.interleaved = false;

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (!(child instanceof Buffer)) {
                this.removeChild(child);
                return;
            }
        });
    }

    get mainBuffer() {
        return this.parent instanceof Buffer ? this.parent.mainBuffer : this;
    }

    get type() {
        if (this.childrens.length > 0) {
            return new ArrayBuffer(0).constructor;
        }
        return this.data.constructor;
    }

    get data() {
        let data = this._data;
        if (this.childrens.length > 0) {
            const length = this.BYTES_LENGTH;
            data = new ArrayBuffer(length);
            let offset = 0;
            this.childrens.forEach(updateBuffer);

            function updateBuffer(b) {
                if (b.childrens.length > 0) {
                    b.childrens.forEach(updateBuffer);
                } else {
                    if (b.parent.interleaved) {

                    } else {
                        const view = new b.type(data);
                        let index = offset / b.BYTES_PER_ELEMENT;
                        b.data.forEach(v => {
                            view[index++] = v;
                        })
                        offset += b.BYTES_LENGTH;
                    }
                }
            };
        }
        return data;
    }

    set data(v) {
        if (!(this.childrens.length > 0)) {
            this._data = v;
        }
    }

    get updated() {
        if (this.childrens.length > 0) {
            return this.childrens.some(c => c.updated);
        }
        return this._updated;
    }

    set updated(v) {
        if (this.childrens.length > 0) {
            this.childrens.forEach(c => c.updated = v);
        }
        this._updated = v;
    }

    get step() {
        if (this.childrens.length > 0) {
            return this.interleaved ? this.childrens.reduce((r, b) => { return r + b.step; }, 0) : 0;
        }
        return this._step;
    }

    set step(v) {
        this._step = v;
    }

    get count() {
        return this.length / this.step;
    }

    get divisorCount() {
        const child = this.childrens.find(b => b.divisor > 0);
        return this.divisor > 0 ? this.count / this.divisor
            : child ? child.divisorCount
                : 0;
    }

    get offset() {
        if (this.parent instanceof Buffer) {
            const name = this.interleaved ? 'step' : 'length';
            return this.parent.offset + this.parent.childrens
                .slice(0, this.parent.childrens.indexOf(this))
                .reduce((r, b) => { return r + b[name]; }, 0);
        }
        return 0;
    }

    get length() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.length; }, 0);
        }
        return this.data.length;
    }

    get BYTES_PER_STEP() {
        if (this.childrens.length > 0) {
            return this.interleaved ? this.childrens.reduce((r, b) => { return r + b.BYTES_PER_STEP; }, 0) : 0;
        }
        return this.BYTES_PER_ELEMENT * this.step;
    }

    get BYTES_PER_OFFSET() {
        if (this.parent instanceof Buffer) {
            const name = this.interleaved ? 'BYTES_PER_STEP' : 'BYTES_LENGTH'
            return this.parent.BYTES_PER_OFFSET + this.parent.childrens
                .slice(0, this.parent.childrens.indexOf(this))
                .reduce((r, b) => { return r + b[name]; }, 0);
        }
        return 0;
    }

    get BYTES_PER_ELEMENT() {
        if (this.childrens.length > 0) {
            return null;
        }
        return this.type.BYTES_PER_ELEMENT;
    }

    get BYTES_LENGTH() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.BYTES_LENGTH; }, 0);
        }
        return this.BYTES_PER_ELEMENT * this.data.length;
    }

    scale(value) {
        if (this.childrens.length > 0) {
            this.childrens.forEach(c => c.scale(value));
        } else {
            for (let i = 0; i < this.data.length; i++) {
                this.data[i] *= value;
            }
        }
    }

    transform(matrix) {
        if (!(this.childrens.length > 0)) {
            let vector = this.step == 4 ? new Vector4()
                : this.step == 3 ? new Vector3() :
                    new Vector2();
            for (let i = 0; i < this.length; i += vector.length) {
                for (let j = 0; j < vector.length; j++) {
                    vector[j] = this.data[i + j];
                }
                vector.transform(matrix);
                for (let j = 0; j < vector.length; j++) {
                    this.data[i + j] = vector[j];
                }
            }
        }
    }

    static usage = {
        static: 'STATIC',
        dynamic: 'DYNAMIC',
        stream: 'STREAM',
    }
}