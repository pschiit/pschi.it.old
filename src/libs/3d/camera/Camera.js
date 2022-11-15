import { Matrix4 } from '../../math/Matrix4';
import { Node3d } from '../Node3d';

export class Camera extends Node3d {
    constructor() {
        super();
        this.projectionMatrix = Matrix4.identityMatrix();
    }
    
    static cameraMatrixName = 'cameraMatrix';
}