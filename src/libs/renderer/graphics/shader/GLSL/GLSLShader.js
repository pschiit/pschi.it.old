import MathArray from '../../../../math/MathArray';
import Matrix2 from '../../../../math/Matrix2';
import Matrix3 from '../../../../math/Matrix3';
import Matrix4 from '../../../../math/Matrix4';
import Vector2 from '../../../../math/Vector2';
import Vector3 from '../../../../math/Vector3';
import Vector4 from '../../../../math/Vector4';
import Texture from '../../Texture';
import Operation from '../Operation';
import Parameter from '../Parameter';
import Shader from '../Shader';
import ShaderFunction from '../ShaderFunction';
import GLSLParameter from './GLSLParameter';

export default class GLSLShader extends Shader {
    /** Create a GLSLShader
     * @param {GLSLParameter[]} parameters GLSLShader parameters
     * @param {string} script source code of GLSL without parameter declaration
     * @param {string} precision GLSLShader precision
     */
    constructor(parameters = [], script = '', precision = null) {
        super();
        this.parameters = parameters;
        this.script = script;
        this.precision = precision;
    }

    /** Return all the attributes of the current GLSLShader.
     * @returns {GLSLParameter[]} the attributes list
    */
    get attributes() {
        return this.parameters.filter(p => p.type == GLSLParameter.qualifier.attribute);
    }

    /** Return all the uniforms of the current GLSLShader.
     * @returns {GLSLParameter[]} the uniforms list
    */
    get uniforms() {
        return this.parameters.filter(p => p.type == GLSLParameter.qualifier.uniform);
    }

    /** Return all the varyings of the current GLSLShader.
     * @returns {GLSLParameter[]} the varyings list
    */
    get varyings() {
        return this.parameters.filter(p => p.type == GLSLParameter.qualifier.varying);
    }

    /** Return the source code of the GLSLShader.
     * @returns {string} the shader source code
    */
    get source() {
        const result = [];
        if (this.precision) {
            result.push(`precision ${this.precision} float;`);
        }
        this.parameters.forEach(p => {
            result.push(p.declaration);
        });
        result.push(this.script);

        return result.join('\n');
    }


    /** Create a new GLSLShader code source from a Shader
     * @param {Shader} shader Shader to convert
     * @returns {string} the GLSLShader code source
    */
    static from(shader) {
        if (shader instanceof GLSLShader) {
            return shader.source;
        }

        var initialized = {};
        var extensions = [];
        var declarations = [];
        var main = [
            'void main(){'
        ];
        shader.operations.forEach(o => {
            o.parameters.forEach(addNode);
            let code = toString(o);
            if (code.slice(-1) != '}') {
                code += ';'
            }
            main.push(code);
        });
        if (shader.precision) {
            declarations.unshift(`precision ${shader.precision}p float;`);
        }
        if (extensions) {
            declarations = extensions.concat(declarations);
        }
        main.push('}');

        var result = declarations.concat(main).join('\n');

        return result;

        function addNode(shaderNode) {
            if (shaderNode instanceof Parameter && !initialized[shaderNode.name]) {
                if (shaderNode.qualifier) {
                    declarations.unshift(getDeclaration(shaderNode));
                } else {
                    shaderNode._init = typeOf(shaderNode.type) + ' ' + shaderNode;
                }
                initialized[shaderNode.name] = true;
            }
            if (shaderNode instanceof Operation) {
                if (shaderNode.symbol instanceof ShaderFunction && !initialized[shaderNode.symbol.name]) {
                    const shaderFunction = shaderNode.symbol;
                    shaderFunction.parameters.forEach(addNode);
                    shaderFunction.operations.forEach(addNode);
                    let code = toString(shaderFunction);
                    declarations.push(code);
                    initialized[shaderFunction.name] = true;
                }
                shaderNode.parameters.forEach(addNode);
            }
        }

        function getDeclaration(parameter) {
            return `${qualifierOf(parameter.qualifier)} ${typeOf(parameter.type)} ${parameter}${parameter.length > 0 ? `[${parameter.length}]` : ''};`
        }

        function toString(shaderNode) {
            if (shaderNode instanceof ShaderFunction) {
                return `${typeOf(shaderNode.output)} ${shaderNode.name}(${toString(shaderNode.parameters.map(toString).join(', '))}){\n${shaderNode.operations.map(toString).join(';\n')};\n}`
            }
            if (shaderNode instanceof Operation) {
                if (shaderNode.symbol instanceof ShaderFunction) {
                    return `${shaderNode.symbol.name}(${shaderNode.parameters.map(toString).join(', ')})`
                }
                if (shaderNode.symbol === Operation.symbol.discard) {
                    return 'discard';
                }
                if (shaderNode.symbol === Operation.symbol.return) {
                    return `return ${toString(shaderNode.parameters[0])}`;
                }
                if (shaderNode.symbol === Operation.symbol.if) {
                    const condition = shaderNode.parameters[0];
                    const operations = shaderNode.parameters[1];
                    return `${shaderNode.symbol}(${toString(condition)}){\n${operations.map(toString).join(';\n')};\n}`;
                }
                //convertTo
                if (shaderNode.symbol.prototype instanceof MathArray) {
                    return `${typeOf(shaderNode.symbol)}(${shaderNode.parameters.flatMap(toString).join(', ')})`;
                }
                if (shaderNode.symbol === Operation.symbol.fWidth) {
                    extensions.push('#extension GL_OES_standard_derivatives : enable');
                    return `fwidth(${shaderNode.parameters.flatMap(toString).join(', ')})`;
                }
                if (shaderNode.symbol === Operation.symbol.normalize
                    || shaderNode.symbol === Operation.symbol.abs
                    || shaderNode.symbol === Operation.symbol.fract
                    || shaderNode.symbol === Operation.symbol.min
                    || shaderNode.symbol === Operation.symbol.max
                    || shaderNode.symbol === Operation.symbol.distance
                    || shaderNode.symbol === Operation.symbol.pow
                    || shaderNode.symbol === Operation.symbol.mix) {
                    return `${shaderNode.symbol}(${shaderNode.parameters.flatMap(toString).join(', ')})`;
                }
                return shaderNode.parameters.flatMap(toString).join(shaderNode.symbol);
            }
            if (shaderNode instanceof Parameter) {
                if (shaderNode === Shader.parameters.output) {
                    return getOutput(shader);
                }
                if (shaderNode === Shader.parameters.pointSize) {
                    return 'gl_PointSize';
                }
                // init local variable (non-system or non-qualified variable)
                if (shaderNode._init) {
                    const result = shaderNode._init;
                    shaderNode._init = null;
                    return result;
                }
                return shaderNode;
            }
            return shaderNode instanceof Vector4 ? 'vec4(' + shaderNode[0] + ', ' + shaderNode[1] + ', ' + shaderNode[2] + ', ' + shaderNode[3] + ')'
                : shaderNode instanceof Vector3 ? 'vec3(' + shaderNode[0] + ', ' + shaderNode[1] + ', ' + shaderNode[2] + ')'
                    : shaderNode instanceof Vector2 ? 'vec2(' + shaderNode[0] + ', ' + shaderNode[1] + ')'
                        : Number.isInteger(shaderNode) ? shaderNode + '.0'
                            : shaderNode;
        }

        function qualifierOf(type) {
            return type == Parameter.qualifier.const ? 'uniform'
                : type == Parameter.qualifier.let ? 'attribute'
                    : type == Parameter.qualifier.var ? 'varying'
                        : null;
        }

        function typeOf(value) {
            return value === Matrix4 ? 'mat4'
                : value === Matrix3 ? 'mat3'
                    : value === Matrix2 ? 'mat2'
                        : value === Vector4 ? 'vec4'
                            : value === Vector3 ? 'vec3'
                                : value === Vector2 ? 'vec2'
                                    : value === Number ? 'float'
                                        : value === Boolean ? 'bool'
                                            : value === Texture ? 'sampler2D'
                                                : null;
            //     samplerCube: 'samplerCube',
        }

        function getOutput(shader) {
            return shader.type == Shader.type.vertexShader ? 'gl_Position'
                : shader.type == Shader.type.fragmentShader ? 'gl_FragColor'
                    : null;
        }
    }
}