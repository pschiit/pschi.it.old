import Color from '../../core/Color';
import Matrix4 from '../../math/Matrix4';
import Vector2 from '../../math/Vector2';
import Render from '../../renderer/Render';
import RenderTarget from '../../renderer/RenderTarget';
import Scene from '../../renderer/Scene';
import Node3d from '../Node3d';

export default class Camera extends Node3d {
    constructor() {
        super();
        this.fog = new Vector2(0, 100);
        this.backgroundColor = Color.black;
        this.projectionUpdated = true;
        this.active = true;
    }

    get lookAtMatrix() {
        return this.matrix.clone().invert();
    }

    get projectionMatrix(){
        return this.lookAtMatrix;
    }

    get scene() {
        const scene = super.scene;
        scene.camera = this;

        scene.setParameter(Camera.fogDistanceName, this.fog);
        scene.setParameter(Camera.backgroundColorName, this.backgroundColor);
        scene.setParameter(Camera.positionName, this.worldPosition);
        scene.setParameter(Camera.projectionMatrixName, this.projectionMatrix);
        return scene;
    }

    setScene(scene) {
        super.setScene(scene);
        return this;
    }

    static positionName = 'viewPosition';
    static projectionMatrixName = 'projectionMatrix';
    static backgroundColorName = 'backgroundColor';
    static fogDistanceName = 'fogDistance';
}