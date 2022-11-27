import Buffer from '../../core/Buffer';
import GLSLMaterial from '../shader/GLSL/GLSLMaterial';
import Material from '../Material';
import WebGLBuffer from './WebGLBuffer';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';
import WebGLShader from './WebGLShader';
import WebGLTexture from './WebGLTexture';
import MathArray from '../../math/MathArray';

export default class WebGLProgram extends WebGLNode {
    /** Create a WebGLProgram from a Material for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Material} material  associated Material
     */
    constructor(renderer, material) {
        super(renderer, material.id);
        this.parameters = {};
        this.parameters = {};
        this.cache = {
            parameters: {},
        };
        if (!(material instanceof GLSLMaterial)) {
            material = GLSLMaterial.from(material);
        }
        this.location = renderer.gl.createProgram();
        this.vertexShader = WebGLShader.from(renderer, material.vertexShader);
        renderer.gl.attachShader(this.location, this.vertexShader.location);
        this.fragmentShader = WebGLShader.from(renderer, material.fragmentShader);
        renderer.gl.attachShader(this.location, this.fragmentShader.location);
        renderer.gl.linkProgram(this.location);
        if (!renderer.gl.getProgramParameter(this.location, renderer.gl.LINK_STATUS)) {
            const error = new Error(`Failed to create program : ${renderer.gl.getProgramInfoLog(this.location)}`);
            renderer.removeChild(this);
            throw error;
        }
        const uniformsCount = renderer.gl.getProgramParameter(this.location, renderer.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformsCount; i++) {
            const uniform = renderer.gl.getActiveUniform(this.location, i);
            createUniform(renderer, this, uniform);
        }
        const attributesCount = renderer.gl.getProgramParameter(this.location, renderer.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributesCount; i++) {
            const attribute = renderer.gl.getActiveAttrib(this.location, i);
            createAttribute(renderer, this, attribute);
        }
    }

    /** Return whether or not this WebGLProgram has been created from the Material
     * @param {Material} material  Material to compare
     */
    is(material) {
        return this.name == material.id;
    }

    setParameter(name, value) {
        if (this.parameters[name]) {
            this.parameters[name](value);
        }
    }

    /** Get the Material's WebGLProgram from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Material} material  associated Material
     * @param {Boolean} recompile  whether you wish to recompiled a program ( default = false)
     */
    static from(renderer, material, recompile = false) {
        return recompile ? new WebGLProgram(renderer, material)
            : renderer.nodes[material.id] || new WebGLProgram(renderer, material);
    }
}

/** Create a attribute for a WebGLProgram with the current WebGLRenderer.
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLProgram} program WebGLProgram to update
 * @param {WebGLActiveInfo} attribute WebGL location of Attribute
 */
function createAttribute(renderer, program, attribute) {
    const location = renderer.gl.getAttribLocation(program.location, attribute.name);
    program.parameters[attribute.name] = (v) => {
        if (v instanceof Buffer) {
            renderer.arrayBuffer = WebGLBuffer.from(renderer, v.mainBuffer, renderer.gl.ARRAY_BUFFER);
            renderer.gl.enableVertexAttribArray(location);
            renderer.gl.vertexAttribPointer(location, v.step, renderer.arrayBuffer.type, v.normalize, v.BYTES_PER_PARENT_STEP, v.BYTES_PER_OFFSET);
        } else {
            renderer.gl.disableVertexAttribArray(location);
            if (Number.isFinite(v)) {
                renderer.gl.vertexAttrib1f(location, v);
            } else {
                switch (v.length) {
                    case 4:
                        renderer.gl.vertexAttrib4fv(location, v);
                        break;
                    case 3:
                        renderer.gl.vertexAttrib3fv(location, v);
                        break;
                    case 2:
                        renderer.gl.vertexAttrib2fv(location, v);
                        break;
                    case 1:
                        renderer.gl.vertexAttrib1fv(location, v);
                        break;
                    default:
                        throw new Error('the length of a float constant value must be between 1 and 4!');
                }
            }
        }
    };
}

/** Create a uniform for a WebGLProgram with the current WebGLRenderer.
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLProgram} program WebGLProgram to update
 * @param {WebGLActiveInfo} uniform WebGL location of Uniform
 */
function createUniform(renderer, program, uniform) {
    const location = renderer.gl.getUniformLocation(program.location, uniform.name);
    const name = uniform.name.replace('[0]', '');
    switch (uniform.type) {
        case renderer.gl.FLOAT:
            if (uniform.size > 1) {
                program.parameters[name] = (v) => {
                    if (!program.cache.parameters[name]?.equals(v)) {
                        renderer.gl.uniform1fv(location, v);
                        program.cache.parameters[name] = v.clone();
                    }
                };
            } else {
                program.parameters[name] = (v) => {
                    if(v?.length == 1){
                        v = v[0];
                    }
                    if (program.cache.parameters[name] != v) {
                        renderer.gl.uniform1f(location, v);
                        program.cache.parameters[name] = v;
                    }
                };
            }
            break;
        case renderer.gl.FLOAT_VEC2:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniform2fv(location, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_VEC3:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniform3fv(location, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_VEC4:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniform4fv(location, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.BOOL:
        case renderer.gl.INT:
            if (uniform.size > 1) {
                program.parameters[name] = (v) => {
                    if (!program.cache.parameters[name]?.equals(v)) {
                        renderer.gl.uniform1iv(location, v);
                        program.cache.parameters[name] = v.clone();
                    }
                };
            } else {
                program.parameters[name] = (v) => {
                    if(v?.length == 1){
                        v = v[0];
                    }
                    if (program.cache.parameters[name] != v) {
                        renderer.gl.uniform1i(location, v);
                        program.cache.parameters[name] = v;
                    }
                };
            }
            break;
        case renderer.gl.BOOL_VEC2:
        case renderer.gl.INT_VEC2:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniform2iv(location, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.BOOL_VEC3:
        case renderer.gl.INT_VEC3:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniform3iv(location, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.BOOL_VEC4:
        case renderer.gl.INT_VEC4:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniform4iv(location, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_MAT2:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniformMatrix2fv(location, false, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_MAT3:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniformMatrix3fv(location, false, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_MAT4:
            program.parameters[name] = (v) => {
                if (!program.cache.parameters[name]?.equals(v)) {
                    renderer.gl.uniformMatrix4fv(location, false, v);
                    program.cache.parameters[name] = v.clone();
                }
            };
            break;
        case renderer.gl.SAMPLER_2D:
        case renderer.gl.SAMPLER_CUBE:
            if (uniform.size > 1) {
                program.parameters[name] = (v) => {
                    if (v) {
                        const textures = v.map(t => WebGLTexture.from(renderer, t));
                        const units = textures.map(t => t.units);
                        if (program.cache.parameters[name] != units) {
                            renderer.gl.uniform1iv(location, units);
                            program.cache.parameters[name] = units;
                            textures.forEach(t => {
                                renderer.gl.activeTexture(renderer.gl.TEXTURE0 + t.unit);
                                renderer.texture2d = t;
                            });
                        }
                    } else if (program.cache.parameters[name] = null) {
                        renderer.gl.uniform1iv(location, null);
                        program.cache.parameters[name] = null;
                    };
                }
            } else {
                program.parameters[name] = (v) => {
                    if (v) {
                        var texture = WebGLTexture.from(renderer, v);
                        if (program.cache.parameters[name] != texture.unit) {
                            renderer.gl.uniform1i(location, texture.unit);
                            program.cache.parameters[name] = texture.unit;
                            renderer.gl.activeTexture(renderer.gl.TEXTURE0 + texture.unit);
                            renderer.texture2d = texture;
                        }
                    } else if (program.cache.parameters[name] != null) {
                        renderer.gl.uniform1i(location, null);
                        program.cache.parameters[name] = null;
                    };
                }
            }
            break;
        default:
            throw new Error(`${uniform.type} is missing createUniform implementation.`);
    }
}