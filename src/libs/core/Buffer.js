import Vector2 from '../math/Vector2';
import Vector3 from '../math/Vector3';
import Vector4 from '../math/Vector4';
import Node from './Node';

export default class Buffer extends Node {
    constructor(data, step = 1, divisor = 0) {
        super();
        this._index = null;
        this.usage = Buffer.usage.static;
        this.data = data;
        this.step = step;
        this.divisor = divisor;
        this.normalize = false;
        this.updated = true;

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

    get index() {
        return this._index;
    }

    set index(v) {
        if (v) {
            if (Array.isArray(v)) {
                v = new Uint32Array(v);
            }
            if (this.index) {
                this.index.data = v;
            } else {
                this._index = new Buffer(v);
            }
        } else {
            this.index = null;
        }
    }

    get data() {
        if (this.childrens.length > 0) {
            const data = new this.type(this.length);
            const arrayStep = this.step;

            this.childrens.forEach(b => {
                const offset = b.offset;
                let position = 0;
                const bufferData = b.data;
                for (let i = 0; i < data.length; i += arrayStep) {
                    for (let j = 0; j < b.step; j++) {
                        data[offset + i + j] = bufferData[position++];
                    }
                }
                b.updated = false;
            });

            return data;
        }
        return this._data;
    }

    set data(v) {
        if (!(this.childrens.length > 0)) {
            this._data = v;
        }
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

    get divisorCount() {
        const child = this.childrens.find(b => b.divisor > 0);
        return this.divisor > 0 ? this.count / this.divisor
            : child ? child.divisorCount
                : 0;
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
        return this.BYTES_PER_ELEMENT * this.step;
    }

    get BYTES_PER_OFFSET() {
        return this.BYTES_PER_ELEMENT * this.offset;
    }

    get BYTES_PER_ELEMENT() {
        return this.type.BYTES_PER_ELEMENT;
    }

    get offset() {
        if (this.parent instanceof Buffer) {
            return this.parent.childrens
                .slice(0, this.parent.childrens.indexOf(this))
                .reduce((r, b) => { return r + b.step; }, 0);
        }
        return 0;
    }

    getParameter(name) {
        return this.childrens.find(c => c.name == name);
    }

    setParameter(name, v, step, divisor) {
        let buffer = this.getParameter(name);
        if (v) {
            if (v instanceof Buffer) {
                buffer = v;
                buffer.name = name;
                this.appendChild(v);
            } else {
                if (Array.isArray(v)) {
                    v = new this.type(v);
                }
                if (!buffer) {
                    buffer = new Buffer(v, step, divisor);
                    buffer.name = name;
                    this.appendChild(buffer);
                } else {
                    buffer.data = v;
                }
            }
        } else if (buffer) {
            this.removeChild(buffer);
            buffer = null;
        }

        return buffer;
    }

    removeParameter(name) {
        this.removeChild(this.getParameter(name));
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