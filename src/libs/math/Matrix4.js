import Matrix2 from'./Matrix2';
import Matrix3 from'./Matrix3';
import MathArray from'./MathArray';
import Vector3 from'./Vector3';

export default class  Matrix4 extends MathArray {
    /** Create a new Matrix3 from an array of number
     * @param {Number[]} values values of the matrix 
    */
    constructor(values) {
        super(16);
        if (values) {
            this.set(values);
        }
    }

    /** Return a Vector3 reflecting the position from the current Matrix
     * @return {Vector3} position vector
    */
    get positionVector() {
        return new Vector3(this[12], this[13], this[14]);
    }

    /** Return a Vector3 reflecting the scale from the current Matrix
     * @return {Vector3} scale vector
    */
    get scaleVector() {
        return new Vector3(
            Math.hypot(this[0], this[1], this[2]), 
            Math.hypot(this[4], this[5], this[6]), 
            Math.hypot(this[8], this[9], this[10]));
    }

    /** Return whether or not a Matrix4 array is equals the current Matrix4
     * @param {Matrix4} matrix the matrix to compare
     * @return {Boolean} true if matrices are equals
    */
    equals(matrix) {
        return this[0] === matrix[0] &&
            this[1] === matrix[1] &&
            this[2] === matrix[2] &&
            this[3] === matrix[3] &&
            this[4] === matrix[4] &&
            this[5] === matrix[5] &&
            this[6] === matrix[6] &&
            this[7] === matrix[7] &&
            this[8] === matrix[8] &&
            this[9] === matrix[9] &&
            this[10] === matrix[10] &&
            this[11] === matrix[11] &&
            this[12] === matrix[12] &&
            this[13] === matrix[13] &&
            this[14] === matrix[14] &&
            this[15] === matrix[15];
    }

    /** Add a Matrix4 array to the current Matrix4
     * @param {Matrix4} matrix right operand
     * @return the current updated Matrix4
    */
    add(matrix) {
        this[0] += matrix[0];
        this[1] += matrix[1];
        this[2] += matrix[2];
        this[3] += matrix[3];
        this[4] += matrix[4];
        this[5] += matrix[5];
        this[6] += matrix[6];
        this[7] += matrix[7];
        this[8] += matrix[8];
        this[9] += matrix[9];
        this[10] += matrix[10];
        this[11] += matrix[11];
        this[12] += matrix[12];
        this[13] += matrix[13];
        this[14] += matrix[14];
        this[15] += matrix[15];

        return this;
    }

    /** Substract a Matrix4 array to the current Matrix4
     * @param {Matrix4} matrix right operand
     * @return the current updated Matrix4
    */
    substract(matrix) {
        this[0] -= matrix[0];
        this[1] -= matrix[1];
        this[2] -= matrix[2];
        this[3] -= matrix[3];
        this[4] -= matrix[4];
        this[5] -= matrix[5];
        this[6] -= matrix[6];
        this[7] -= matrix[7];
        this[8] -= matrix[8];
        this[9] -= matrix[9];
        this[10] -= matrix[10];
        this[11] -= matrix[11];
        this[12] -= matrix[12];
        this[13] -= matrix[13];
        this[14] -= matrix[14];
        this[15] -= matrix[15];

        return this;
    }

    /** Multiply a Matrix4 array to the current Matrix4
     * @param {Matrix4} matrix right operand
     * @return the current updated Matrix4
    */
    multiply(matrix) {
        const a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3],
            a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7],
            a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11],
            a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        let b0 = matrix[0],
            b1 = matrix[1],
            b2 = matrix[2],
            b3 = matrix[3];

        this[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = matrix[4];
        b1 = matrix[5];
        b2 = matrix[6];
        b3 = matrix[7];
        this[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = matrix[8];
        b1 = matrix[9];
        b2 = matrix[10];
        b3 = matrix[11];
        this[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = matrix[12];
        b1 = matrix[13];
        b2 = matrix[14];
        b3 = matrix[15];
        this[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        this[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        this[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        this[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        return this;
    }

    /** Scale the current Matrix4 by a vector3 array
     * @param {Vector3} vector translation vector
     * @return the current updated Matrix4
    */
    scale(vector) {
        this[0] *= vector[0];
        this[1] *= vector[0];
        this[2] *= vector[0];
        this[3] *= vector[0];
        this[4] *= vector[1];
        this[5] *= vector[1];
        this[6] *= vector[1];
        this[7] *= vector[1];
        this[8] *= vector[2];
        this[9] *= vector[2];
        this[10] *= vector[2];
        this[11] *= vector[2];

        return this;
    }


    /** Rotate the current Matrix4 by an angle around an axis
     * @param {Number} radians angle of rotation
     * @param {Vector3} vector axis of the rotation
     * @return the current updated Matrix4
    */
    rotate(radians, vector) {
        let x = vector[0],
            y = vector[1],
            z = vector[2];
        let len = Math.hypot(x, y, z);

        if (len == 0) {
            console.log(radians, x, y, z);
            alert(len)
            throw new Error(`Can't rotate matrix from [${x},${y},${z}].`);
        }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        const s = Math.sin(radians);
        const c = Math.cos(radians);
        const t = 1 - c;
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a03 = this[3];
        const a10 = this[4];
        const a11 = this[5];
        const a12 = this[6];
        const a13 = this[7];
        const a20 = this[8];
        const a21 = this[9];
        const a22 = this[10];
        const a23 = this[11];

        const b00 = x * x * t + c;
        const b01 = y * x * t + z * s;
        const b02 = z * x * t - y * s;
        const b10 = x * y * t - z * s;
        const b11 = y * y * t + c;
        const b12 = z * y * t + x * s;
        const b20 = x * z * t + y * s;
        const b21 = y * z * t - x * s;
        const b22 = z * z * t + c;

        this[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
    }

    /** translate the current Matrix4 by a vector3 array
     * @param {Vector3} vector translation vector
     * @return the current updated Matrix4
    */
    translate(vector) {
        this[12] = this[0] * vector[0] + this[4] * vector[1] + this[8] * vector[2] + this[12];
        this[13] = this[1] * vector[0] + this[5] * vector[1] + this[9] * vector[2] + this[13];
        this[14] = this[2] * vector[0] + this[6] * vector[1] + this[10] * vector[2] + this[14];
        this[15] = this[3] * vector[0] + this[7] * vector[1] + this[11] * vector[2] + this[15];

        return this;
    }


    /** Transpose the current Matrix4
     * @return the current updated Matrix4
    */
    transpose() {
        const a01 = this[1],
            a02 = this[2],
            a03 = this[3],
            a12 = this[6],
            a13 = this[7],
            a23 = this[11];

        this[1] = this[4];
        this[2] = this[8];
        this[3] = this[12];
        this[4] = a01;
        this[6] = this[9];
        this[7] = this[13];
        this[8] = a02;
        this[9] = a12;
        this[11] = this[14];
        this[12] = a03;
        this[13] = a13;
        this[14] = a23;

        return this;
    }

    /** Calculate the current Matrix4 determinant
     * @return {Number} determinant of the current Matrix4
    */
    determinant() {
        const a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3],
            a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7],
            a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11],
            a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    /** Invert the current Matrix4
     * @return the current updated Matrix4  or null if determinant == 0
    */
    invert() {
        const a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3],
            a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7],
            a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11],
            a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }

        det = 1.0 / det;
        this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return this;
    }

    /** Convert the current Matrix4 to a Matrix2
     * @return {Matrix2} converted Matrix2
    */
    toMatrix2() {
        const result = new Matrix2();

        result[0] = this[0];
        result[1] = this[1];
        result[2] = this[4];
        result[3] = this[5];

        return result;
    }

    /** Convert the current Matrix4 to a Matrix3
     * @return {Matrix3} converted Matrix3
    */
    toMatrix3() {
        const result = new Matrix3();

        result[0] = this[0];
        result[1] = this[1];
        result[2] = this[2];
        result[3] = this[4];
        result[4] = this[5];
        result[5] = this[6];
        result[6] = this[8];
        result[7] = this[9];
        result[8] = this[10];

        return result
    }

    /** Create a new identity Matrix4
     * @return {Matrix4} the identity Matrix4
    */
    static identityMatrix() {
        const result = new Matrix4();

        result[0] = 1;
        result[5] = 1;
        result[10] = 1;
        result[15] = 1;

        return result;
    }

    /** Create a new lookAt Matrix4
     * @param {Vector3} eye Position of the viewer
     * @param {Vector3} center Point the viewer is looking at
     * @param {Vector3} up up axis of the viewer
     * @return {Matrix4} the lookAt Matrix4
    */
    static lookAtMatrix(eye, center, up) {
        const result = new Matrix4();

        let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        const eyex = eye[0];
        const eyey = eye[1];
        const eyez = eye[2];
        const upx = up[0];
        const upy = up[1];
        const upz = up[2];
        const centerx = center[0];
        const centery = center[1];
        const centerz = center[2];

        if (Math.abs(eyex - centerx) == 0 && Math.abs(eyey - centery) == 0 && Math.abs(eyez - centerz) == 0) {
            return Matrix4.identityMatrix();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.hypot(x0, x1, x2);

        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.hypot(y0, y1, y2);

        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        result[0] = x0;
        result[1] = y0;
        result[2] = z0;
        result[4] = x1;
        result[5] = y1;
        result[6] = z1;
        result[8] = x2;
        result[9] = y2;
        result[10] = z2;
        result[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        result[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        result[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        result[15] = 1;
        return result;
    }

    /** Create a new target Matrix4
     * @param {Vector3} eye Position of the viewer
     * @param {Vector3} target Point to target
     * @param {Vector3} up up axis of the viewer
     * @return {Matrix4} the lookAt Matrix4
    */
    static targetMatrix(eye, target, up) {
        const result = new Matrix4();
        let z0 = eye[0] - target[0],
          z1 = eye[1] - target[1],
          z2 = eye[2] - target[2];
        let len = z0 * z0 + z1 * z1 + z2 * z2;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
          z0 *= len;
          z1 *= len;
          z2 *= len;
        }
        let x0 = up[1] * z2 - up[2] * z1,
          x1 = up[2] * z0 - up[0] * z2,
          x2 = up[0] * z1 - up[1] * z0;
        len = x0 * x0 + x1 * x1 + x2 * x2;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
          x0 *= len;
          x1 *= len;
          x2 *= len;
        }
        result[0] = x0;
        result[1] = x1;
        result[2] = x2;
        result[3] = 0;
        result[4] = z1 * x2 - z2 * x1;
        result[5] = z2 * x0 - z0 * x2;
        result[6] = z0 * x1 - z1 * x0;
        result[7] = 0;
        result[8] = z0;
        result[9] = z1;
        result[10] = z2;
        result[11] = 0;
        result[12] = eye[0];
        result[13] = eye[1];
        result[14] = eye[2];
        result[15] = 1;
        
        return result;
    }

    /** Create a new orthographic Matrix4
     * @param {Number} left bound of the frustum
     * @param {Number} right bound of the frustum
     * @param {Number} bottom bound of the frustum
     * @param {Number} top bound of the frustum
     * @param {Number} near bound of the frustum
     * @param {Number} far bound of the frustum
     * @return {Matrix4} the orthographic Matrix4
    */
    static orthographicMatrix(left, right, bottom, top, near, far) {
        const result = new Matrix4();

        const lr = 1 / (left - right);
        const bt = 1 / (bottom - top);
        const nf = 1 / (near - far);

        result[0] = -2 * lr;
        result[5] = -2 * bt;
        result[10] = 2 * nf;
        result[12] = (left + right) * lr;
        result[13] = (top + bottom) * bt;
        result[14] = (far + near) * nf;
        result[15] = 1;

        return result;
    }

    /** Create a new perspective Matrix4to
     * @param {Number} fovy vertical field of view in degrees
     * @param {Number} aspect ratio of the frustum 
     * @param {Number} near bound of the frustum
     * @param {Number} far bound of the frustum
     * @return {Matrix4} the perspective Matrix4
    */
    static perspectiveMatrix(fovy, aspect, near, far) {
        const result = new Matrix4();
        let f = 1.0 / Math.tan(fovy / 2),
            nf;
        result[0] = f / aspect;
        result[5] = f;
        result[11] = -1;
        if (far != null && far !== Infinity) {
            nf = 1 / (near - far);
            result[10] = (far + near) * nf;
            result[14] = 2 * far * near * nf;
        } else {
            result[10] = -1;
            result[14] = -2 * near;
        }

        return result;
    }
}