import Buffer from'../../core/Buffer';
import GLSLMaterial from'../shader/GLSL/GLSLMaterial';
import Material from'../../material/Material';
import WebGLBuffer from'./WebGLBuffer';
import WebGLNode from'./WebGLNode';
import WebGLRenderer from'./WebGLRenderer';
import WebGLShader from'./WebGLShader';

export default class  WebGLProgram extends WebGLNode {
    /** Create a WebGLProgram from a Material for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Material} material  associated Material
     */
    constructor(renderer, material) {
        super(renderer, material.id);
        this.attributes = {};
        this.uniforms = {};
        this.cache = {
            uniforms: {},
        };
        this.location = renderer.gl.createProgram();
        if (!(material instanceof GLSLMaterial)) {
            material = GLSLMaterial.from(material);
        }
        this.vertexShader = renderer[material.vertexShader.id] || new WebGLShader(renderer, material.vertexShader);
        renderer.gl.attachShader(this.location, this.vertexShader.location);
        this.fragmentShader = renderer[material.fragmentShader.id] || new WebGLShader(renderer, material.fragmentShader);
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
}

/** Create a attribute for a WebGLProgram with the current WebGLRenderer.
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLProgram} program WebGLProgram to update
 * @param {WebGLActiveInfo} attribute WebGL location of Attribute
 */
function createAttribute(renderer, program, attribute) {
    const location = renderer.gl.getAttribLocation(program.location, attribute.name);
    program.attributes[attribute.name] = (v) => {
        if (v instanceof Buffer) {
            renderer.arrayBuffer = renderer[v.mainBuffer.id] || new WebGLBuffer(renderer, v.mainBuffer, renderer.gl.ARRAY_BUFFER);
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
    switch (uniform.type) {
        case renderer.gl.FLOAT:
            program.uniforms[uniform.name] = (v) => {
                if (program.cache.uniforms[uniform.name] != v) {
                    renderer.gl.uniform1f(location, v);
                    program.cache.uniforms[uniform.name] = v;
                }
            };
            break;
        case renderer.gl.FLOAT_VEC2:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniform2fv(location, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_VEC3:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniform3fv(location, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_VEC4:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniform4fv(location, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.BOOL:
        case renderer.gl.INT:
            program.uniforms[uniform.name] = (v) => {
                if (program.cache.uniforms[uniform.name] != v) {
                    renderer.gl.uniform1i(location, v);
                    program.cache.uniforms[uniform.name] = v;
                }
            };
            break;
        case renderer.gl.BOOL_VEC2:
        case renderer.gl.INT_VEC2:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniform2iv(location, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.BOOL_VEC3:
        case renderer.gl.INT_VEC3:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniform3iv(location, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.BOOL_VEC4:
        case renderer.gl.INT_VEC4:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniform4iv(location, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_MAT2:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniformMatrix2fv(location, false, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_MAT3:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniformMatrix3fv(location, false, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.FLOAT_MAT4:
            program.uniforms[uniform.name] = (v) => {
                if (!program.cache.uniforms[uniform.name]?.equals(v)) {
                    renderer.gl.uniformMatrix4fv(location, false, v);
                    program.cache.uniforms[uniform.name] = v.clone();
                }
            };
            break;
        case renderer.gl.SAMPLER_2D:
        case renderer.gl.SAMPLER_CUBE:
            throw new Error(`${uniform.type} is missing createUniform implementation.`);
    }
}