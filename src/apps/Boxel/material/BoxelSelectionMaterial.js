import Material from '../../../libs/renderer/graphics/Material';
import Operation from '../../../libs/renderer/graphics/shader/Operation';
import Parameter from '../../../libs/renderer/graphics/shader/Parameter';
import Shader from '../../../libs/renderer/graphics/shader/Shader';
import BoxelMaterial from './BoxelMaterial';

export default class BoxelSelectionMaterial extends Material {
    constructor() {
        super();
        this.culling = Material.culling.back;
        this.depth = Material.depth.less;
        this.setParameter(Material.parameters.projectionMatrix);
        this.divisor = 256;
        
        const position = Parameter.vector4('position');
        const vPosition = Parameter.vector3('v_' + Material.parameters.position, Parameter.qualifier.out);;
        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Operation.declare(position),
                Operation.add(
                    Material.parameters.position,
                    Operation.toVector4(BoxelMaterial.parameters.instancePosition, 0))),
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    Material.parameters.projectionMatrix,
                    Material.parameters.vertexMatrix,
                    position)),
            Operation.equal(vPosition, Operation.divide(BoxelMaterial.parameters.instancePosition, BoxelSelectionMaterial.parameters.selectionDivisor)),]);

        this.fragmentShader = Shader.fragmentShader(
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(vPosition, 1)));
    }

    get divisor() {
        return this.getParameter(BoxelSelectionMaterial.parameters.selectionDivisor);
    }

    set divisor(v) {
        this.setParameter(BoxelSelectionMaterial.parameters.selectionDivisor, v);
    }



    static parameters = {
        selectionDivisor: Parameter.number('selectionDivisor', Parameter.qualifier.const),
    }
}