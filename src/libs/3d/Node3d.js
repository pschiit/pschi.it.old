import Matrix4 from '../math/Matrix4';
import Vector3 from '../math/Vector3';
import Render from '../renderer/Render';

export default class Node3d extends Render {
    /** Create a new Node3d
    */
    constructor() {
        super();
        this.up = Vector3.yAxis.clone();
        this._matrix = Matrix4.identityMatrix();
        this.target = new Vector3();
    }

    get matrix() {
        return this.parent instanceof Node3d ? this.parent.matrix.clone().multiply(this._matrix)
            : this._matrix;
    }

    set matrix(v) {
        this._matrix = v;
    }

    /** Return a Vector3 reflecting the position of the current Node3d
     * @return {Vector3} scale vector
    */
    get position() {
        return this.matrix.positionVector;
    }

    /** Return a Vector3 reflecting the scale of the current Node3d
     * @return {Vector3} scale vector
    */
    get scale() {
        return this.matrix.scale;
    }

    /** Translate the Node3d by a Vector3 array
     * @param {Number|Vector3} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    translate(x = 0, y = 0, z = 0) {
        this._matrix.translate(x instanceof Vector3 ? x : new Vector3(x, y, z));

        return this;
    }

    /** Rescale the Node3d by a Vector3 array
     * @param {Number|Vector3} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    rescale(x = 0, y = 0, z = 0) {
        this._matrix.scale(x instanceof Vector3 ? x : new Vector3(x, y, z));

        return this;
    }

    /** Rotate the Node3d by a Vector3 array
     * @param {Number} radians angle in radians of the rotation
     * @param {Number|Vector3} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    rotate(radians, x = 0, y = 0, z = 0) {
        this._matrix.rotate(radians, x instanceof Vector3 ? x : new Vector3(x, y, z));

        return this;
    }

    /** Apply a Matrix4 to the Node3d
     * @param {Matrix4} matrix translation vector
     * @return the current Node3d
    */
    transform(matrix) {
        this._matrix.multiply(matrix);

        return this;
    }

    /** Look at the position of a Vector3 array
     * @param {Number|Vector3|Node3d} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    lookAt(x = 0, y = 0, z = 0) {
        this.target = x instanceof Node3d ? x.position
            : x instanceof Vector3 ? x
                : new Vector3(x, y, z);
        this._matrix = Matrix4.targetMatrix(this.position, this.target, this.up);

        return this;
    }

    static vertexMatrixName = 'vertexMatrix';
    static normalMatrixName = 'normalMatrix';
}