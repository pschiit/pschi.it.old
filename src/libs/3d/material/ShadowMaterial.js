import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Shader from '../../renderer/graphics/shader/Shader';

export default class ShadowMaterial extends Material {
    constructor() {
        super();
        
        this.setParameter(Material.parameters.projectionMatrix);

        this.vertexShader = Shader.vertexShader(
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    Material.parameters.projectionMatrix,
                    Material.parameters.vertexMatrix,
                    Material.parameters.position)));

        this.fragmentShader = Shader.fragmentShader(
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(Operation.selection(Shader.parameters.fragmentCoordinate, '.z'), 0, 0, 0)));
    }
}