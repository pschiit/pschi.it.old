import Vector2 from'./Vector2';
import Vector3 from'./Vector3';
import MathArray from'./MathArray';

export default class  Vector4  extends MathArray{
    /** Create a new Vector3 from the coordinates xyzw or a vector array
     * @param {Number|Number[]} x first coordinate or vector array
     * @param {Number} y second coordinate
     * @param {Number} z third coordinate
     * @param {Number} w fourth coordinate
    */
    constructor(x, y, z, w) {
        super(4);
        if (typeof x !== 'undefined') {
            if (!Number.isFinite(x)) {
                this[0] = x[0];
                this[1] = x[1];
                this[2] = x[2];
                this[3] = x[3];
            }
            else{
                this[0] = x;
                if (Number.isFinite(y)) {
                    this[1] = y;
                }
                if (Number.isFinite(z)) {
                    this[2] = z;
                }
                if (Number.isFinite(w)) {
                    this[3] = w;
                }
            }
        }
    }

    /** Return whether or not a Vector4 array is equals the current Vector4
     * @param {Vector4} vector the vector to compare
     * @return {Boolean} true if vectors are equals
    */
    equals(vector) {
        return this[0] === vector[0] &&
            this[1] === vector[1] &&
            this[2] === vector[2] &&
            this[3] === vector[3];
    }
    
    /** Add a vector array to the current Vector4
     * @param {Vector4} vector right operand
     * @return the current updated Vector4
    */
    add(vector) {
        this[0] += vector[0];
        this[1] += vector[1];
        this[2] += vector[2];
        this[3] += vector[3];

        return this;
    }

    /** Substract a vector array to the current Vector4
     * @param {Vector4} vector right operand
     * @return the current updated Vector4
    */
    substract(vector) {
        this[0] -= vector[0];
        this[1] -= vector[1];
        this[2] -= vector[2];
        this[3] -= vector[3];

        return this;
    }

    /** Multiply a vector array to the current Vector4
     * @param {Vector4} vector right operand
     * @return the current updated Vector4
    */
    multiply(vector) {
        this[0] *= vector[0];
        this[1] *= vector[1];
        this[2] *= vector[2];
        this[3] *= vector[3];

        return this;
    }


    /** Divide a vector array to the current Vector4
     * @param {Vector4} vector right operand
     * @return the current updated Vector4
    */
    divide(vector) {
        this[0] /= vector[0];
        this[1] /= vector[1];
        this[2] /= vector[2];
        this[3] /= vector[3];

        return this;
    }

    /** Scale the current Vector4
     * @param {Number} value scale
     * @return the current updated Vector4
    */
    scale(value) {
        this[0] = this[0] * value;
        this[1] = this[1] * value;
        this[2] = this[2] * value;
        this[3] = this[3] * value;

        return this;
    }


    /** Normalize the current Vector4
     * @return the current updated Vector4
    */
    normalize() {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const w = this[3];
        let dot = x * x + y * y + z * z + w * w;

        if (dot > 0) {
            dot = 1 / Math.sqrt(dot);
        }

        this[0] = x * dot;
        this[1] = y * dot;
        this[2] = z * dot;
        this[3] = w * dot;

        return this;
    }


    /** Transform the current Vector4 from a matrix array
     * @param {Matrix4} matrix transformation matrix
     * @return the current updated Vector4
    */
    transform(vector) {
        const x = this[0],
            y = this[1],
            z = this[2],
            w = this[3];
        this[0] = vector[0] * x + vector[4] * y + vector[8] * z + vector[12] * w;
        this[1] = vector[1] * x + vector[5] * y + vector[9] * z + vector[13] * w;
        this[2] = vector[2] * x + vector[6] * y + vector[10] * z + vector[14] * w;
        this[3] = vector[3] * x + vector[7] * y + vector[11] * z + vector[15] * w;

        return this;
    }

    /** Calculate the dot product of the current Vector4 and a vector array
     * @param {Vector4} vector right operand
     * @return {Number} the dot product
    */
    dot(vector) {
        return this[0] * vector[0] + this[1] * vector[1] + this[2] * vector[2] + this[3] * vector[3];
    }

    /** Convert the current Vector4 to a Vector2
     * @return {Vector2} converted Vector3
    */
    toVector2() {
        return new Vector2(this[0], this[1]);
    }

    /** Convert the current Vector4 to a Vector3
     * @return {Vector3} converted Vector4
    */
    toVector3() {
        return new Vector3(this[0], this[1], this[2]);
    }
}