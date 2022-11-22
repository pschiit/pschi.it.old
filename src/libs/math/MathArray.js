export default class MathArray extends Float32Array {
    constructor(length) {
        super(length);
    }

    /** Return whether or not a Matrix4 array is equals the current Matrix4
     * @param {MathArray} mathArray the matrix to compare
     * @return {Boolean} true if matrices are equals
    */
    equals(mathArray) {
        return mathArray.every((e, i) => e == this[i]);
    }

    clone() {
        return new this.constructor(this);
    }
}