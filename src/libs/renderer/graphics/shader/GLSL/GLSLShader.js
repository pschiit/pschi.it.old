import Matrix2 from '../../../../math/Matrix2';
import Matrix3 from '../../../../math/Matrix3';
import Matrix4 from '../../../../math/Matrix4';
import Vector2 from '../../../../math/Vector2';
import Vector3 from '../../../../math/Vector3';
import Vector4 from '../../../../math/Vector4';
import Texture from '../../Texture';
import Conversion from '../Conversion';
import Operation from '../Operation';
import Parameter from '../Parameter';
import Shader from '../Shader';
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

        var parameters = {};
        var main = [
            'void main(){'
        ];
        shader.operations.forEach(o => {
            o.operands.forEach(addParameter);
            main.push(`${toString(o)};`);
        });
        if (shader.precision) {
            main.unshift(`precision ${shader.precision}p float;`);
        }
        main.push('}');

        var result = main.join('\n');
        result = result.replace(Shader.parameters.output.name, getOutput(shader.type));
        result = result.replace(Shader.parameters.pointSize.name, 'gl_PointSize');

        return result;

        function addParameter(parameter) {
            if (parameter.qualifier && !parameters[parameter.name]) {
                parameters[parameter.name] = parameter;
                main.unshift(getDeclaration(parameter));
            } else if (parameter instanceof Operation) {
                parameter.operands.forEach(addParameter)
            } else if (parameter instanceof Conversion) {
                addParameter(parameter.parameter);
            }
        }

        function getDeclaration(parameter) {
            return `${qualifierOf(parameter.qualifier)} ${typeOf(parameter.type)} ${parameter}${parameter.length > 0 ? `[${parameter.length}]` : ''};`
        }

        function toString(value) {
            if (value instanceof Conversion) {
                let defaultValue = '';
                const count = value.missingValueCount;
                if (count > 0) {
                    for (let i = 0; i < count; i++) {
                        defaultValue += ' , ' + toString(value.defaultValue);
                    }
                }
                return `${typeOf(value.output)}(${toString(value.parameter)}${defaultValue})`;
            };
            return value instanceof Operation ? value.operands.flatMap(toString).join(' ' + value.symbol + ' ')
                : value instanceof Vector4 ? 'vec4(' + value[0] + ',' + value[1] + ',' + value[2] + ',' + value[3] + ')'
                    : value instanceof Vector3 ? 'vec3(' + value[0] + ',' + value[1] + ',' + value[2] + ')'
                        : value instanceof Vector2 ? 'vec2(' + value[0] + ',' + value[1] + ')'
                            : Number.isInteger(value) ? value + '.0'
                                : value === Shader.parameters.output ? getOutput(shader)
                                    : value === Shader.parameters.pointSize ? 'gl_PointSize'
                                        : value;
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