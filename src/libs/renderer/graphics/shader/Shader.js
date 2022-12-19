import Parameter from './Parameter';
import ShaderNode from './ShaderNode';

export default class Shader extends ShaderNode {
    /** Create a Shader
     */
    constructor(type, operations, precision) {
        super();
        this.compiled = false;
        this.type = type;
        this.operations = operations;
        this.precision = precision || Shader.precision.high;
    }

    static vertexShader(operations, precision = Shader.precision.high) {
        if(!Array.isArray(operations)){
            operations = [operations];
        }
        return new Shader(Shader.type.vertexShader, operations, precision);
    }

    static fragmentShader(operations, precision = Shader.precision.low) {
        if(!Array.isArray(operations)){
            operations = [operations];
        }
        return new Shader(Shader.type.fragmentShader, operations, precision);
    }

    /** Shader parameters
    */
    static parameters = {
        output: Parameter.vector4('output'),
        pointSize:Parameter.number('pointSize'),
    };

    /** Shader type value
    */
    static type = {
        vertexShader: 'vertexShader',
        fragmentShader: 'fragmentShader'
    };

    /** GLSLShader precision value
    */
    static precision = {
        low: 'low',
        medium: 'medium',
        high: 'high'
    };
}