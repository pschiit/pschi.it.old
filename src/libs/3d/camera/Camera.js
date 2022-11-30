import Color from '../../core/Color';
import Matrix4 from '../../math/Matrix4';
import Vector2 from '../../math/Vector2';
import Node3d from '../Node3d';

export default class Camera extends Node3d {
    constructor() {
        super();
        this.cameraParameters = {};
        this.renderTarget = null;
        this.fog = new Vector2(0, 100);
        this.backgroundColor = Color.black;
        this.projectionUpdated = true;
        this.active = true;
    }

    get fog() {
        return this.cameraParameters[Camera.fogDistanceName];
    }

    set fog(v) {
        this.setCameraParameter(Camera.fogDistanceName, v);
    }

    get backgroundColor() {
        return this.cameraParameters[Camera.backgroundColorName];
    }

    set backgroundColor(v) {
        this.setCameraParameter(Camera.backgroundColorName, v);
    }

    get lookAtMatrix() {
        return this.matrix.clone().invert();
    }

    get projectionMatrix(){
        return this.cameraParameters[Camera.projectionMatrixName];
    }

    updateParameters(scene) {
        super.updateParameters(scene);
        if(this.active){
            scene.cameras.push(this);
            if(this.projectionUpdated){
                this.setCameraParameter(Camera.positionName, this.worldPosition);
            }
        }

        return this;
    }

    setCameraParameter(name, value) {
        this.cameraParameters[name] = value;
    }

    static positionName = 'viewPosition';
    static lookAtMatrixName = 'lookAtMatrix';
    static projectionMatrixName = 'projectionMatrix';
    static backgroundColorName = 'backgroundColor';
    static fogDistanceName = 'fogDistance';
}