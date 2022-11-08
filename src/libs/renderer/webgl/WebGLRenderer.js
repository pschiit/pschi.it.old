import { Node } from '../../core/Node';
import { WebGLBuffer } from './WebGLBuffer';
import { WebGLProgram } from './WebGLProgram';
import { WebGLShader } from './WebGLShader';
import { WebGLVertexArray } from './WebGLVertexArray';

export class WebGLRenderer extends Node {
    /** Create a WebGLRenderer from a WebGLRenderingContext
     * @param {WebGLRenderingContext} gl the context of the renderer
     */
    constructor(gl) {
        super();
        this.gl = gl;
        this.polyfillExtension();

        this.vertexArray = null;
        this.currentProgram = null;
        this.currentBuffer = null;

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (child instanceof WebGLShader) {
                child.location = this.gl.createShader(this.gl[child.type]);
            }
            if (child instanceof WebGLProgram) {
                child.location = this.gl.createProgram();
            }
            if (child instanceof WebGLVertexArray) {
                child.location = this.gl.createVertexArray();
            }
            if (child instanceof WebGLBuffer) {
                child.location = this.gl.createBuffer();
            }
        });
        this.addEventListener(Node.event.nodeRemoved, (e) => {
            const child = e.removed;
            if (child instanceof WebGLShader) {
                this.gl.deleteShader(child.location);
                child.location = null;
            } else if (child instanceof WebGLProgram) {
                this.gl.deleteProgram(child.location);
                child.location = null;
                child.attributes = {};
                child.uniforms = {};
                if (this.currentProgram === child) {
                    this.currentProgram = null;
                }
            } else if (child instanceof WebGLVertexArray) {
                child.location = this.gl.deleteVertexArray(child.location);
                if (this.vertexArray === child) {
                    this.vertexArray = null;
                }
            } else if (child instanceof WebGLBuffer) {
                this.gl.deleteBuffer(child.location);
                child.location = null;
                if (this.currentBuffer === child) {
                    this.currentBuffer = null;
                }
            }
        });
    }

    /** Compile a WebGLShader with the current WebGLRenderer
     * @param {WebGLShader} shader WebGLShader to compile
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    compileShader(shader) {
        this.appendChild(shader);
        this.gl.shaderSource(shader.location, shader.source);
        this.gl.compileShader(shader.location);
        const success = this.gl.getShaderParameter(shader.location, this.gl.COMPILE_STATUS);
        if (success) {
            return this;
        }
        const error = new Error(`Failed to create ${shader.type} :\n${this.gl.getShaderInfoLog(shader.location)}\n\n${shader.source}`);
        this.removeChild(shader);
        throw error;
    }

    /** Create a WebGLProgram with the current WebGLRenderer.
     * Compile the WebGLShader if not compile on the current WebGLRenderer
     * @param {WebGLProgram} program WebGLProgram to create
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    linkProgram(program) {
        this.appendChild(program);
        if (program.vertexShader.parent != this) {
            this.compileShader(program.vertexShader);
        }
        this.gl.attachShader(program.location, program.vertexShader.location);
        if (program.fragmentShader.parent != this) {
            this.compileShader(program.fragmentShader);
        }
        this.gl.attachShader(program.location, program.fragmentShader.location);
        this.gl.linkProgram(program.location);

        if (this.gl.getProgramParameter(program.location, this.gl.LINK_STATUS)) {
            const uniformsCount = this.gl.getProgramParameter(program.location, this.gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < uniformsCount; i++) {
                const uniform = this.gl.getActiveUniform(program.location, i);
                createUniform(this, program, uniform);
            }
            console.log(program.uniforms);
            const attributesCount = this.gl.getProgramParameter(program.location, this.gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < attributesCount; i++) {
                const attribute = this.gl.getActiveAttrib(program.location, i);
                createAttribute(this, program, attribute);
            }
            console.log(program.attributes);
            return this;
        }
        const error = new Error(`Failed to create program : ${this.gl.getProgramInfoLog(program.location)}`);
        this.removeChild(program);
        throw error;
    }

    /** Set the WebGLProgram as the current program of the WebGLRenderer.
     * Link the WebGLProgram if not linked on the current WebGLRenderer
     * @param {WebGLProgram} program program to use
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    useProgram(program) {
        if (this.currentProgram != program) {
            if (program.parent != this) {
                this.linkProgram(program);
            }
            this.gl.useProgram(program.location);
            this.currentProgram = program;
        }

        return this;
    }

    /** Bind the buffer as the current buffer of the WebGLRenderer.
     * Create the WebGLBuffer if not created on the current WebGLRenderer
     * @param {WebGLBuffer} buffer WebGLBuffer to bind
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    bindBuffer(buffer) {
        if (this.currentBuffer != buffer) {
            if (buffer.parent != this) {
                this.appendChild(buffer);
            }
            this.gl.bindBuffer(this.gl[buffer.type], buffer.location);
            this.currentBuffer = buffer;
        }

        return this;
    }

    setBufferData(buffer) {
        if (this.currentBuffer != buffer) {
            this.bindBuffer(buffer);
        }
        this.gl.bufferData(buffer.type, buffer.data, this.gl[buffer.usage]);
    }

    setBufferSubData(buffer, offset, subData) {
        if (this.currentBuffer != buffer) {
            this.bindBuffer(buffer);
        }
        this.gl.bufferSubData(buffer.type, offset, subData);
    }

    enableBuffer(buffer) {
        buffer.childrens.forEach(a => {
            this.gl.vertexAttribPointer(a.location, a.size, a.type, a.normalized, buffer.stride, a.offset);
            this.gl.enableVertexAttribArray(a.location);
        });
    }

    setParameterValue(parameter, value) {
        this.gl[parameter.setter](parameter.location, value);
    }

    //to be removed
    enable(capability) {
        this.gl.enable(this.gl[capability]);
    }

    disable(capability) {
        this.gl.disable(this.gl[capability]);
    }

    scissor(x, y, width, height) {
        console.log(x, y, width, height);
        this.gl.viewport(x, y, width, height);
        this.gl.scissor(x, y, width, height);
    }

    viewport(x, y, width, height) {
        this.gl.viewport(x, y, width, height);
    }

    clearColor(color) {
        if (color) {
            this.gl.clearColor(color[0], color[1], color[2], color[3]);
        } else {
            this.gl.clearColor(0, 0, 0, 1);
        }
    }

    clear(color = true, depth = true, stencil = true) {
        let bits = 0;

        if (color) bits |= this.gl.COLOR_BUFFER_BIT;
        if (depth) bits |= this.gl.DEPTH_BUFFER_BIT;
        if (stencil) bits |= this.gl.STENCIL_BUFFER_BIT;

        this.gl.clear(bits);
    }

    drawElements(mode, count, type, offset) {
        //console.log(count,offset);
        this.gl.drawElements(mode, count, type, offset);

        return this;
    }

    drawArrays(drawMode, first, drawCount) {
        this.gl.drawArrays(drawMode, first, drawCount);

        return this;
    }

    polyfillExtension() {
        this.extensions = {};
        this.gl.getSupportedExtensions().forEach(e => this.extensions[e] = this.gl.getExtension(e))
        let ext = this.getExtension('ANGLE_instanced_arrays');
        Object.defineProperties(this.gl, {
            VERTEX_ATTRIB_ARRAY_DIVISOR: {
                value: ext.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE,
                writable: false
            },
            drawArraysInstanced: {
                value: ext.drawArraysInstancedANGLE,
                writable: false
            },
            drawElementsInstanced: {
                value: ext.drawElementsInstancedANGLE,
                writable: false
            },
            vertexAttribDivisor: {
                value: ext.vertexAttribDivisorANGLE,
                writable: false
            },
        });
        ext = this.getExtension('OES_vertex_array_object');
        Object.defineProperties(this.gl, {
            VERTEX_ARRAY_BINDING: {
                value: ext.VERTEX_ARRAY_BINDING_OES,
                writable: false
            },
            createVertexArray: {
                value: ext.createVertexArrayOES,
                writable: false
            },
            deleteVertexArray: {
                value: ext.deleteVertexArrayOES,
                writable: false
            },
            isVertexArray: {
                value: ext.isVertexArray,
                writable: false
            },
            bindVertexArray: {
                value: ext.bindVertexArrayOES,
                writable: false
            },
        });
    }

    getExtension(name) {
        return this.extensions[name]
            || this.extensions['MOZ_' + name]
            || this.extensions['OP_' + name]
            || this.extensions['WEBKIT_' + name];
    }

    static capability = {
        blend: 'BLEND',
        cullFace: 'CULL_FACE',
        depth: 'DEPTH_TEST',
        dither: 'DITHER',
        polygonOffsetFill: 'POLYGON_OFFSET_FILL',
        sampleAlphaToCoverage: 'SAMPLE_ALPHA_TO_COVERAGE',
        sampleCoverage: 'SAMPLE_COVERAGE',
        scissor: 'SCISSOR_TEST',
        stencil: 'STENCIL_TEST',
    };
}

/** Create a attribute for a WebGLProgram with the current WebGLRenderer.
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLProgram} program WebGLProgram to update
 * @param {WebGLActiveInfo} attribute WebGL location of Attribute
 */
function createAttribute(renderer, program, attribute) {
    const location = renderer.gl.getAttribLocation(program.location, attribute.name);
    Object.defineProperty(program.attributes, attribute.name, {
        get() { return location },
        set(v) {
            if (v instanceof WebGLBuffer) {
                renderer.bindBuffer(v);
                renderer.gl.enableVertexAttribArray(location);
                //renderer.vertexAttribPointer(i, v.numComponents || v.size, v.type || gl.FLOAT, v.normalize || false, v.stride || 0, v.offset || 0);
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
        }
    });
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
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniform1fv(location, v);
                }
            });
            break;
        case renderer.gl.FLOAT_VEC2:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniform2fv(location, v);
                }
            });
            break;
        case renderer.gl.FLOAT_VEC3:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniform3fv(location, v);
                }
            });
            break;
        case renderer.gl.FLOAT_VEC4:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniform4fv(location, v);
                }
            });
            break;
        case renderer.gl.BOOL:
        case renderer.gl.INT:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniform1i(location, v);
                }
            });
            break;
        case renderer.gl.BOOL_VEC2:
        case renderer.gl.INT_VEC2:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniform2iv(location, v);
                }
            });
            break;
        case renderer.gl.BOOL_VEC3:
        case renderer.gl.INT_VEC3:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniform3iv(location, v);
                }
            });
            break;
        case renderer.gl.BOOL_VEC4:
        case renderer.gl.INT_VEC4:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniform4iv(location, v);
                }
            });
            break;
        case renderer.gl.FLOAT_MAT2:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniformMatrix2fv(location, false, v);
                }
            });
            break;
        case renderer.gl.FLOAT_MAT3:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniformMatrix3fv(location, false, v);
                }
            });
            break;
        case renderer.gl.FLOAT_MAT4:
            Object.defineProperty(program.uniforms, uniform.name, {
                get() { return location },
                set(v) {
                    renderer.gl.uniformMatrix4fv(location, false, v);
                }
            });
            break;
        case renderer.gl.SAMPLER_2D:
        case renderer.gl.SAMPLER_CUBE:
            throw new Error(`${uniform.type} is missing createUniform implementation.`);
    }
}