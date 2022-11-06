import { Shader } from './Shader';

export class VertexShader extends Shader {
    constructor(parameters, script) {
        super('VERTEX_SHADER', parameters, script);
    }
}