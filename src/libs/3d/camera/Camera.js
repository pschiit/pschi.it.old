import { Color } from '../../core/Color';
import { Matrix4 } from '../../math/Matrix4';
import { Node3d } from '../Node3d';

export class Camera extends Node3d {
    constructor() {
        super();
        this.projectionMatrix = Matrix4.identityMatrix();
        this.ambientLight = null;
        this.fog = null;
        this.background = new Color(0,0,0,1);
    }
    
    static cameraMatrixName = 'cameraMatrix';
    static ambientLightColorName = 'ambientLightColor';
}