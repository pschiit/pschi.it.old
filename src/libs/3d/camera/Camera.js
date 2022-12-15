import Color from '../../core/Color';
import Vector2 from '../../math/Vector2';
import Node3d from '../Node3d';

export default class Camera extends Node3d {
    constructor() {
        super();
        this.fog = new Vector2(0, 100);
        this.backgroundColor = Color.black;
        this.projectionUpdated = true;
        this.active = true;
    }

    get projectionMatrix(){
        return this.invertMatrix;
    }

    setScene(scene) {
        super.setScene(scene);
        scene.setParameter(Camera.fogDistanceName, this.fog);
        scene.setParameter(Camera.backgroundColorName, this.backgroundColor);
        scene.setParameter(Camera.positionName, this.vertexMatrix.positionVector);
    }

    static positionName = 'viewPosition';
    static projectionMatrixName = 'projectionMatrix';
    static backgroundColorName = 'backgroundColor';
    static fogDistanceName = 'fogDistance';
}