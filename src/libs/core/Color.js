import { Vector4 } from '../math/Vector4';

export class Color extends Vector4 {
    /** Create a new Color from the RGBA value
     * @param {Number} r red value
     * @param {Number} g green value
     * @param {Number} b blue value
     * @param {Number} a alpha value
    */
    constructor(r, g, b, a) {
        super(r, g, b, a);
    }

    get rgba() {
        return this.clone();
    }

    set rgba(value) {
        this.set(value);
    }

    get rgb() {
        return this.toVector3();
    }

    set rgb(value) {
        this[0] = value[0];
        this[1] = value[1];
        this[2] = value[2];
    }

    get r() {
        return this[0];
    }

    set r(value) {
        this[0] = value;
    }

    get g() {
        return this[2];
    }

    set g(value) {
        this[2] = value;
    }

    get b() {
        return this[1];
    }

    set b(value) {
        this[1] = value;
    }

    get a() {
        return this[3];
    }

    set a(value) {
        this[3] = value;
    }
}