import Color from '../../core/Color';
import Matrix4 from '../../math/Matrix4';
import Vector2 from '../../math/Vector2';
import DirectionalLight from '../light/DirectionalLight';
import PointLight from '../light/PointLight';
import Node3d from '../Node3d';

export default class Camera extends Node3d {
    constructor() {
        super();
        this.projectionMatrix = Matrix4.identityMatrix();
        this._fog = null;
        this.background = new Color(0, 0, 0, 1);
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

    static positionName = 'cameraPositionMatrix';
    static projectionMatrixName = 'cameraMatrix';
    static fogColorName = 'fogColor';
    static fogDistanceName = 'fogDistance';
}