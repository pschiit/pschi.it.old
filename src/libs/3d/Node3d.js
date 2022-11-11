import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
import { Node } from '../core/Node';

export class Node3d extends Node {
    /** Create a new Node3d
    */
    constructor() {
        super();
        this.matrix = Matrix4.identityMatrix();
    }

    /** Translate the Node3d by a Vector3 array
     * @param {Vector3} vector3 translation vector
     * @return the current Node3d
    */
    translate(vector3) {
        this.matrix.translate(vector3);

        return this;
    }

    /** Rescale the Node3d by a Vector3 array
     * @param {Vector3} vector3 scaling vector
     * @return the current Node3d
    */
    rescale(vector3) {
        this.matrix.scale(vector3);

        return this;
    }

    /** Rotate the Node3d by a Vector3 array
     * @param {Vector3} vector3 rotation vector
     * @return the current Node3d
    */
    rotate(radians, vector3) {
        this.matrix.rotate(radians, vector3);

        return this;
    }

    /** Apply a Matrix4 to the Node3d
     * @param {Matrix4} matrix translation vector
     * @return the current Node3d
    */
    applyMatrix(matrix) {
        this.matrix.multiply(matrix);

        return this;
    }
}