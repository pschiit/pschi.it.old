import Vector3 from'../math/Vector3';
import Vector4 from'../math/Vector4';

export default class  Color extends Vector4 {
    /** Create a new Color from the RGBA value
     * @param {Number} r red value
     * @param {Number} g green value
     * @param {Number} b blue value
     * @param {Number} a alpha value
    */
    constructor(r, g, b, a) {
        super(r, g, b, a);
    }

    /** Return the rgba values of the current color
     * @return {Vector4} rgba Vector4
    */
    get rgba() {
        return this.clone();
    }

    /** Set the rgba values of the current color
     * @param {Vector4} value rgba Vector4
    */
    set rgba(value) {
        this.set(value);
    }

    /** Return the rgb values of the current color
     * @return {Vector3} rgb Vector3
    */
    get rgb() {
        return this.toVector3();
    }

    /** Set the rgb values of the current color
     * @param {Vector3} value rgba Vector3
    */
    set rgb(value) {
        this[0] = value[0];
        this[1] = value[1];
        this[2] = value[2];
    }

    /** Return the red value of the current color
     * @return {Number} value
    */
    get r() {
        return this[0];
    }

    /** Set the red values of the current color
     * @param {Number} value red
    */
    set r(value) {
        this[0] = value;
    }

    /** Return the green value of the current color
     * @return {Number} value
    */
    get g() {
        return this[1];
    }

    /** Set the green values of the current color
     * @param {Number} value green
    */
    set g(value) {
        this[1] = value;
    }

    /** Return the blue value of the current color
     * @return {Number} value
    */
    get b() {
        return this[2];
    }

    /** Set the blue values of the current color
     * @param {Number} value blue
    */
    set b(value) {
        this[2] = value;
    }

    /** Return the alpha value of the current color
     * @return {Number} value
    */
    get a() {
        return this[3];
    }

    /** Set the alpha values of the current color
     * @param {Number} value alpha
    */
    set a(value) {
        this[3] = value;
    }
}