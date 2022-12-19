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

            // const length = this.BYTES_LENGTH;
            // const data = new ArrayBuffer(length);
            // const arrayStep = this.BYTES_PER_STEP;

            // this.childrens.forEach(b => {
            //     const element = b.BYTES_PER_ELEMENT;
            //     const step = b.BYTES_PER_STEP;
            //     const offset = b.BYTES_PER_OFFSET;
            //     const view = new b.type(data);
            //     let position = 0;
            //     const bufferData = b.data;
            //     for (let i = 0; i < length; i += arrayStep) {
            //         for (let j = 0; j < step; j += element) {
            //             data[offset + i + j] = bufferData[position++];
            //         }
            //     }
            //     b.updated = false;
            // });
            // console.log(data, testData, new Float32Array(data));
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
            return new Float32Array(0).constructor;
        }
        return this.data.constructor;
    }

    get length() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.length; }, 0);
        }
        return this.data.length;
    }

    get BYTES_PER_STEP() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.BYTES_PER_STEP; }, 0);
        }
        return this.BYTES_PER_ELEMENT * this.step;
    }

    get BYTES_PER_OFFSET() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.BYTES_PER_OFFSET; }, 0);
        }
        return this.BYTES_PER_ELEMENT * this.offset;
    }

    get BYTES_PER_ELEMENT() {
        return this.type.BYTES_PER_ELEMENT;
    }

    get BYTES_LENGTH() {
        if (this.childrens.length > 0) {
            return this.childrens.reduce((r, b) => { return r + b.BYTES_LENGTH; }, 0);
        }
        return this.BYTES_PER_ELEMENT * this.data.length;
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
                    v = new Float32Array(v);
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

    scale(value) {
        if (this.childrens.length > 0) {
            this.childrens.forEach(c => c.scale(value));
        } else {
            for (let i = 0; i < this.data.length; i++) {
                this.data[i] *= value;
            }
        }
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