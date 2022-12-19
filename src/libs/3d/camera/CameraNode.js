import Color from '../../core/Color';
import Vector2 from '../../math/Vector2';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Node3d from '../Node3d';

export default class CameraNode extends Node3d {
    constructor() {
        super();
        this.fog = new Vector2(0, 100);
        this.backgroundColor = Color.black;
        this.projectionUpdated = true;
        this.active = true;
    }

    get projectionMatrix() {
        return this.invertMatrix;
    }

    setScene(scene) {
        super.setScene(scene);
        scene.renderTarget.backgroundColor = this.backgroundColor;
        scene.setParameter(CameraNode.parameters.fogDistance, this.fog);
        scene.setParameter(CameraNode.parameters.backgroundColor, this.backgroundColor.rgb);
        scene.setParameter(CameraNode.parameters.cameraPosition, this.vertexMatrix.positionVector);
    }
    
    static parameters = {
        projectionMatrix: Parameter.matrix4('projectionMatrix', Parameter.qualifier.const),
        cameraPosition: Parameter.vector3('cameraPosition', Parameter.qualifier.const),
        backgroundColor: Parameter.vector3('backgroundColor', Parameter.qualifier.const),
        fogDistance: Parameter.vector2('fogDistance', Parameter.qualifier.const),
    }

    static positionName = 'viewPosition';
    static projectionMatrixName = 'projectionMatrix';
    static backgroundColorName = 'backgroundColor';
    static fogDistanceName = 'fogDistance';
}