import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Shader from '../../renderer/graphics/shader/Shader';
import VertexBuffer from '../../renderer/graphics/VertexBuffer';
import CameraNode from '../camera/CameraNode';
import Node3d from '../Node3d';

export default class PickingMaterial extends Material {
    constructor() {
        super();

        this.vertexShader = Shader.vertexShader(
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    CameraNode.parameters.projectionMatrix,
                    Node3d.parameters.vertexMatrix,
                    VertexBuffer.parameters.position)));

        this.fragmentShader = Shader.fragmentShader(
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(Node3d.parameters.colorId, 1)));
    }
}