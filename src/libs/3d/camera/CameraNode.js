import Vector2 from '../../math/Vector2';
import Material from '../../renderer/graphics/Material';
import Node3d from '../Node3d';

export default class CameraNode extends Node3d {
    constructor() {
        super();
        this.fog = new Vector2(0, 10);
        this.projectionUpdated = true;
    }

    get projectionMatrix() {
        return this.invertMatrix;
    }

    setScene(scene) {
        super.setScene(scene);
        scene.setParameter(Material.parameters.fogDistance, this.fog);
        scene.setParameter(Material.parameters.cameraPosition, this.vertexMatrix.positionVector);
    }
}