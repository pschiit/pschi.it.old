import { Buffer } from './Buffer';
import { Node } from './Node';

export class ArrayBuffer extends Node {
    constructor(type) {
        super();
        this._index = null;
        this._type = null;
        this.type = type;
        this.usage = Buffer.usage.static;

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (!(child instanceof Buffer)
                || this.type != child.data.constructor
                || this[child.name]) {
                this.removeChild(child);
                return;
            }
            if(child.name){
                Object.defineProperty(this, child.name, {
                    get() {
                        return this.childrens[e.index];
                    },
                    set(v) {
                        if (v.constructor != this.type) {
                            v = new this.type(v);
                        }
                        this.childrens[e.index].data = v;
                    }
                });
            }
        });

        this.addEventListener(Node.event.nodeRemoved, (e) => {
            const child = e.removed;
            if (this[child.name]) {
                this[child.name] = null;
            }
        });
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

    get BYTES_PER_STEP() {
        return this.type.BYTES_PER_ELEMENT * this.step;
    }

    get BYTES_PER_OFFSET() {
        return this.data.BYTES_PER_ELEMENT * this.offset;
    }

    get BYTES_PER_ELEMENT() {
        return this.type.BYTES_PER_ELEMENT;
    }

    get type() {
        return this._type;
    }

    set type(v) {
        this._type = v.prototype.constructor;
    }

    get step() {
        return this.childrens.reduce((r, b) => { return r + b.step; }, 0);
    }

    get count(){
        if(this.index){
            return this.index.length;
        }
        return this.length / this.step; 
    }

    get length() {
        return this.childrens.reduce((r, b) => { return r + b.length; }, 0);
    }

    get offset() {
        if (!this.parent) {
            return 0;
        }
        return this.parent.childrens
            .slice(0, this.parent.childrens.indexOf(this))
            .reduce((r, b) => { return r + b.step; }, 0);
    }

    get data() {
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
}