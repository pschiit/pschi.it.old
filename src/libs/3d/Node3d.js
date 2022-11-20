import { Node } from '../core/Node';
import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';

export class Node3d extends Node {
    /** Create a new Node3d
    */
    constructor() {
        super();
        this.up = Vector3.yAxis.clone();
        this._matrix = Matrix4.identityMatrix();
    }

    get matrix() {
        return this.parent instanceof Node3d ? this.parent.matrix.clone().multiply(this._matrix)
            : this._matrix;
    }

    set matrix(v) {
        this._matrix = v;
    }

    get position() {
        return this.matrix.matrixPosition();
    }
    /** Translate the Node3d by a Vector3 array
     * @param {Number} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    translate(x = 0, y = 0, z = 0) {
        this._matrix.translate(new Vector3(x, y, z));

        return this;
    }

    /** Rescale the Node3d by a Vector3 array
     * @param {Number} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    rescale(x = 0, y = 0, z = 0) {
        this._matrix.scale(new Vector3(x, y, z));

        return this;
    }

    /** Rotate the Node3d by a Vector3 array
     * @param {Number} radians angle in radians of the rotation
     * @param {Number} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    rotate(radians, x = 0, y = 0, z = 0) {
        this._matrix.rotate(radians, new Vector3(x, y, z));

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
     * @param {Number|Node3d} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    lookAt(x = 0, y = 0, z = 0) {
        const target = x instanceof Node3d ? 
        new Vector3(x.position)
        : new Vector3(x,y,z);
        this._matrix = Matrix4.lookAtMatrix(this.position, target, this.up);

        return this;
    }

    addRender(material, geometry) {
        this.appendChild(geometry.createRender(material));
    }

    static vertexMatrixName = 'vertexMatrix';
    static normalMatrixName = 'normalMatrix';
}