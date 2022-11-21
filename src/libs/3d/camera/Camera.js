import { Color } from '../../core/Color';
import { Matrix4 } from '../../math/Matrix4';
import { Vector3 } from '../../math/Vector3';
import { Node3d } from '../Node3d';

export class Camera extends Node3d {
    constructor() {
        super();
        this.projectionMatrix = Matrix4.identityMatrix();
        this.ambientLight = null;
        this.fog = null;
        this.background = new Color(0,0,0,1);
    }

    /** Look at the position of a Vector3 array
     * @param {Number|Node3d} x first coordinate of the  Vector3
     * @param {Number} y second coordinate of the  Vector3
     * @param {Number} z third coordinate of the  Vector3
     * @return the current Node3d
    */
    lookAt(x = 0, y = 0, z = 0) {
        this.target = x instanceof Node3d ?
            x.position
            : new Vector3(x, y, z);
        this._matrix = Matrix4.lookAtMatrix(this.position, this.target, this.up);

        return this;
    }
    
    static cameraMatrixName = 'cameraMatrix';
    static ambientLightColorName = 'ambientLightColor';
}