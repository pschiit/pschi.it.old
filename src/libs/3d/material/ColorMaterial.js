import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';
import VertexBuffer from '../../renderer/graphics/VertexBuffer';
import CameraNode from '../camera/CameraNode';
import Node3d from '../Node3d';

export default class Color extends Material {
    constructor() {
        super();
        const vColor = Parameter.vector4('v_' + VertexBuffer.parameters.color, Parameter.qualifier.var);
        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    CameraNode.parameters.projectionMatrix,
                    Node3d.parameters.vertexMatrix,
                    VertexBuffer.parameters.position)),
            Operation.equal(vColor, VertexBuffer.parameters.color),]);

        this.fragmentShader = Shader.fragmentShader(
            Operation.equal(
                Shader.parameters.output,
                vColor));
    }
}