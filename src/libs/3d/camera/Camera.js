import Color from '../../core/Color';
import Matrix4 from '../../math/Matrix4';
import Vector2 from '../../math/Vector2';
import Node3d from '../Node3d';

export default class Camera extends Node3d {
    constructor() {
        super();
        this.projectionMatrix = Matrix4.identityMatrix();
        this.fog = [0,100];
        this.backgroundColor = new Color(0, 0, 0, 1);
    }

    get fog() {
        return this._fog;
    }

    set fog(v) {
        if (!(v instanceof Vector2)) {
            v = new Vector2(v);
        }
        this._fog = v;
    }

    static positionName = 'cameraPosition';
    static projectionMatrixName = 'cameraMatrix';
    static backgroundColorName = 'backgroundColor';
    static fogDistanceName = 'fogDistance';
}