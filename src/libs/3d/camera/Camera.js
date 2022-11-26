import Color from '../../core/Color';
import Matrix4 from '../../math/Matrix4';
import Vector2 from '../../math/Vector2';
import Node3d from '../Node3d';

export default class Camera extends Node3d {
    constructor() {
        super();
        this.fog = new Vector2(0,100);
        this.backgroundColor = new Color(0, 0, 0, 1);
        this.projectionUpdated = true;
    }

    get fog() {
        return this._fog;
    }

    set fog(v) {
        this._fog = v;
    }

    get lookAtMatrix(){
        const worldMatrix = this.worldMatrix;
        return Matrix4.lookAtMatrix(worldMatrix.positionVector, this.target, this.up);
    }

    get projectionMatrix(){
        if(this.projectionUpdated){
            this._projectionMatrix = this.lookAtMatrix;
        }
        return this._projectionMatrix;
    }

    static positionName = 'cameraPosition';
    static projectionMatrixName = 'cameraMatrix';
    static backgroundColorName = 'backgroundColor';
    static fogDistanceName = 'fogDistance';
}