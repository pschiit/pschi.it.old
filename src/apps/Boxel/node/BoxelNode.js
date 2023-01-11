import Node3d from '../../../libs/3d/Node3d';
import Material from '../../../libs/renderer/graphics/Material';
import Operation from '../../../libs/renderer/graphics/shader/Operation';
import Parameter from '../../../libs/renderer/graphics/shader/Parameter';
import Shader from '../../../libs/renderer/graphics/shader/Shader';
import BoxelBuffer from '../buffer/BoxelBuffer';

export default class BoxelNode extends Node3d {
    constructor(boxel) {
        super();
        this.vertexBuffer = vertexBuffer;
        this.material = material;
        this.boxel = boxel;
        this.translate(boxel.position);
        this.setParameter(colorParameter, this.boxel.color);
    }

    setScene(parameters) {
        super.setScene(this.parameters);
        //this.boxel.position = this.position.floor();
    }
}
const vertexBuffer = new BoxelBuffer();
const material = new Material();
material.culling = Material.culling.back;
material.depth = Material.depth.less;
material.setParameter(Material.parameters.projectionMatrix);
material.vertexShader = Shader.vertexShader([
    Operation.equal(
        Shader.parameters.output,
        Operation.multiply(
            Material.parameters.projectionMatrix,
            Material.parameters.vertexMatrix,
            Material.parameters.position))]);

const colorParameter = Parameter.vector3('boxelColor', Parameter.qualifier.const);
material.fragmentShader = Shader.fragmentShader([
    Operation.equal(
        Shader.parameters.output,
        Operation.toVector4(colorParameter, 1)),
    Material.operation.gammaCorrection]);