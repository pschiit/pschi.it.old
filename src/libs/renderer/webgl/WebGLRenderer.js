import { Node } from '../../core/Node';
import { Buffer } from '../../core/Buffer';
import { ArrayBuffer } from '../../core/ArrayBuffer';
import { Material } from '../../material/Material';
import { WebGLBuffer } from './WebGLBuffer';
import { WebGLProgram } from './WebGLProgram';
import { WebGLShader } from './WebGLShader';

export class WebGLRenderer extends Node {
    /** Create a WebGLRenderer from a WebGLRenderingContext
     * @param {WebGLRenderingContext} gl the context of the renderer
     */
    constructor(gl) {
        super();
        this.gl = gl;
        this.polyfillExtension();
        this.clearColor([0, 0, 0, 1]);

        this._currentVertexArray = null;
        this._program = null;
        this._arrayBuffer = null;
        this._elementArrayBuffer = null;

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (child instanceof WebGLShader) {
                compileShader(this, child);
            } else if (child instanceof WebGLProgram) {
                linkProgram(this, child);
            } else if (child instanceof WebGLBuffer) {
                createBuffer(this, child);
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
            } else if (child instanceof WebGLBuffer) {
                if (child.index) {
                    this.gl.deleteBuffer(child.index.location);
                    child.index.location = null;
                }
                this.gl.deleteBuffer(child.location);
                child.location = null;
                delete child.update;
                if (this.arrayBuffer === child) {
                    this.currentBuffer = null;
                }
            }
        });
    }

    /** Return the WebGLProgram currently used by the WebGLRenderer
     * @return {WebGLProgram} the WebGLProgram used
     */
    get program() {
        return this._program;
    }

    /** Set a WebGLProgram as the current program of the WebGLRenderer
     * @param {WebGLProgram} v WebGLProgram to use
     */
    set program(v) {
        if (this._program != v) {
            this.gl.useProgram(v.location);
            this._program = v;
        }
    }

    /** Return the WebGLBuffer currently binded as ARRAY_BUFFER to the WebGLRenderer
     * @return {WebGLBuffer} the WebGLBuffer binded
     */
    get arrayBuffer() {
        return this._arrayBuffer;
    }

    /** Bind a WebGLBuffer as the current ARRAY_BUFFER of WebGLRenderer
     * @param {WebGLBuffer} v WebGLBuffer to bind
     */
    set arrayBuffer(v) {
        if (this.arrayBuffer != v) {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, v.location);
            this._arrayBuffer = v;
        }
    }

    /** Return the WebGLBuffer currently binded as ELEMENT_ARRAY_BUFFER to the WebGLRenderer
     * @return {WebGLBuffer} the WebGLBuffer binded
     */
    get elementArrayBuffer() {
        return this._elementArrayBuffer;
    }

    /** Bind a WebGLBuffer as the current ELEMENT_ARRAY_BUFFER of WebGLRenderer
     * @param {WebGLBuffer} v WebGLBuffer to bind
     */
    set elementArrayBuffer(v) {
        if (this._elementArrayBuffer != v) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, v.location);
            this._elementArrayBuffer = v;
        }
    }

    /** Load a Node in the current WebGLRenderer
     * @param {Node} node Node to render
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    load(node) {
        if (node instanceof Material) {
            this.useMaterial(node);
        } else if (node instanceof ArrayBuffer) {
            this.loadBuffer(node);
        } else if (node instanceof Buffer) {
            this.loadBuffer(node);
        }
        return this;
    }

    /** Render a Node in the current WebGLRenderer
     * @param {Node} node Node to render
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    render(node) {
        return this;
    }

    /** Load a Material in the current WebGLRenderer.
     * Will replace the previous program used for this Material
     * @param {Material} material Material to load
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    loadMaterial(material) {
        let program = this[material.id];
        if (program) {
            this.removeChild(program)
        }
        const vertexShader = new WebGLShader(WebGLShader.type.vertexShader, material.vertexShader.source);
        const fragmentShader = new WebGLShader(WebGLShader.type.fragmentShader, material.fragmentShader.source);
        program = new WebGLProgram(vertexShader, fragmentShader);
        this.appendChild(program);
        this[material.id] = program;

        return this;
    }

    /** Load or update a Buffer in the current WebGLRenderer.
     * @param {Buffer | ArrayBuffer} buffer Buffer to load
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    loadBuffer(buffer) {
        let arrayBuffer = this[buffer.id];
        if (!arrayBuffer) {
            arrayBuffer = new WebGLBuffer();
            this.appendChild(arrayBuffer);
            this[buffer.id] = arrayBuffer;
        }
        const usage = getUsage(this, buffer);
        this.arrayBuffer = arrayBuffer;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer.data, usage);

        if (buffer.index) {
            let elementArrayBuffer = this[buffer.index.id];
            if (!elementArrayBuffer) {
                elementArrayBuffer = new WebGLBuffer();
                this.appendChild(elementArrayBuffer);
                this[buffer.index.id] = elementArrayBuffer;
            }
            this.elementArrayBuffer = elementArrayBuffer;
            this.elementArrayBuffer = elementArrayBuffer;
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, buffer.index.data, usage);
        }

        return this;
    }

    /** Set the Material as the current program of the WebGLRenderer.
     * Load the Material if not loaded on the current WebGLRenderer or need an update
     * @param {Material} material Material to use
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    useMaterial(material) {
        if (!this[material.id]) {
            this.loadMaterial(material);
        }
        const program = this[material.id];
        this.program = program;

        return this;
    }

    /** Bind the Buffer as the current buffer of the WebGLRenderer.
     * Load the Buffer if not loaded on the current WebGLRenderer
     * @param {(Buffer | ArrayBuffer)} buffer Buffer to bind
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    bindBuffer(buffer) {
        if (!this[buffer.id]) {
            this.loadBuffer(buffer);
        }
        const webglBuffer = this[buffer.id];
        this.arrayBuffer = webglBuffer;
        if (buffer.index) {
            this.elementArrayBuffer = this[buffer.index.id];
        }

        return this;
    }


    /** Draw the Buffer in the WebGLRenderer.
     * Load the Buffer if not loaded on the current WebGLRenderer
     * @param {(Buffer | ArrayBuffer)} buffer Buffer to bind
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    drawBuffer(mode, buffer) {
        console.log(buffer);
        this.bindBuffer(buffer);
        console.log(buffer.index);
        if (buffer.index) {
            this.drawElements(this.gl[mode], buffer.count, getType(this, buffer.index), buffer.offset);
        }
        this.drawArrays(this.gl[mode], buffer.offset, buffer.count);

        return this;
    }

    createVertexArray(buffer, program) {
        this.useProgram(program);
        this.bindBuffer(buffer);
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
                value: function (mode, first, count, primcount) {
                    return ext.drawArraysInstancedANGLE(mode, first, count, primcount);
                },
                writable: false
            },
            drawElementsInstanced: {
                value: function (mode, count, type, offset, primcount) {
                    return ext.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
                },
                writable: false
            },
            vertexAttribDivisor: {
                value: function (index, divisor) {
                    return ext.vertexAttribDivisorANGLE(index, divisor);
                },
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
                value: function () {
                    return ext.createVertexArrayOES();
                },
                writable: false
            },
            deleteVertexArray: {
                value: function (arrayObject) {
                    return ext.deleteVertexArrayOES(arrayObject);
                },
                writable: false
            },
            isVertexArray: {
                value: function (arrayObject) {
                    return ext.isVertexArray(arrayObject);
                },
                writable: false
            },
            bindVertexArray: {
                value: function (arrayObject) {
                    return ext.bindVertexArrayOES(arrayObject);
                },
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

/** Create a WebGLProgram for the current WebGLRenderer.
 * Compile the WebGLShader if not compile on the current WebGLRenderer
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLProgram} program WebGLProgram to create
 * @returns {WebGLProgram} the linked WebGLProgram
 */
function linkProgram(renderer, program) {
    program.location = renderer.gl.createProgram();

    if (program.vertexShader.parent != renderer) {
        renderer.appendChild(program.vertexShader);
    }
    renderer.gl.attachShader(program.location, program.vertexShader.location);

    if (program.fragmentShader.parent != renderer) {
        renderer.appendChild(program.fragmentShader);
    }
    renderer.gl.attachShader(program.location, program.fragmentShader.location);

    renderer.gl.linkProgram(program.location);

    if (renderer.gl.getProgramParameter(program.location, renderer.gl.LINK_STATUS)) {
        const uniformsCount = renderer.gl.getProgramParameter(program.location, renderer.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformsCount; i++) {
            const uniform = renderer.gl.getActiveUniform(program.location, i);
            createUniform(renderer, program, uniform);
        }
        const attributesCount = renderer.gl.getProgramParameter(program.location, renderer.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributesCount; i++) {
            const attribute = renderer.gl.getActiveAttrib(program.location, i);
            createAttribute(renderer, program, attribute);
        }
        return program;
    }
    const error = new Error(`Failed to create program : ${renderer.gl.getProgramInfoLog(program.location)}`);
    renderer.removeChild(program);
    throw error;
}

/** Compile a WebGLShader for the current WebGLRenderer
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLShader} shader WebGLShader to compile
 * @returns {WebGLShader} the compiled WebGLShader
 */
function compileShader(renderer, shader) {
    shader.location = renderer.gl.createShader(renderer.gl[shader.type]);
    renderer.gl.shaderSource(shader.location, shader.source);
    renderer.gl.compileShader(shader.location);
    const success = renderer.gl.getShaderParameter(shader.location, renderer.gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    const error = new Error(`Failed to create ${shader.type} :\n${renderer.gl.getShaderInfoLog(shader.location)}\n\n${shader.source}`);
    renderer.removeChild(shader);
    throw error;
}

/** Create a WebGLBuffer for the current WebGLRenderer
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLBuffer} buffer WebGLBuffer to create
 * @returns {WebGLBuffer} the created WebGLBuffer
 */
function createBuffer(renderer, buffer) {
    buffer.location = renderer.gl.createBuffer();
    return buffer;
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
            if (v instanceof Buffer) {
                renderer.bindBuffer(v.parent || v);
                renderer.gl.enableVertexAttribArray(location);
                renderer.gl.vertexAttribPointer(location, v.step, getType(renderer, v), v.normalize, v.parent?.BYTES_PER_STEP || 0, v.BYTES_PER_OFFSET);
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
                    renderer.gl.uniform1f(location, v);
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


/** return the value of Buffer.usage in a WebGLRenderer
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {Buffer | ArrayBuffer} buffer a buffer with usage
 * @returns {Number} gl.STATIC_DRAW || gl.DYNAMIC_DRAW || gl.STREAM_DRAW
*/
function getUsage(renderer, buffer) {
    if (buffer.usage === Buffer.usage.static) {
        return renderer.gl.STATIC_DRAW;
    } else if (buffer.usage === Buffer.usage.dynamic) {
        return renderer.gl.DYNAMIC_DRAW;
    } else if (buffer.usage === Buffer.usage.stream) {
        return renderer.gl.STREAM_DRAW;
    } else {
        throw new Error(`${buffer.usage} is missing implementation for ${getUsage.name}.`)
    }
}

/** return the value of Buffer.type in a WebGLRenderer
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {Buffer | ArrayBuffer} buffer a buffer with usage
 * @returns {Number} gl.FLOAT || gl.UNSIGNED_INT || gl.UNSIGNED_SHORT || gl.UNSIGNED_BYTE
*/
function getType(renderer, buffer) {
    if (buffer.data instanceof Float32Array) {
        return renderer.gl.FLOAT;
    } else if (buffer.data instanceof Uint32Array) {
        return renderer.gl.UNSIGNED_INT;
    } else if (buffer.data instanceof Uint16Array) {
        return renderer.gl.UNSIGNED_SHORT;
    } else if (buffer.data instanceof Uint8Array) {
        return renderer.gl.UNSIGNED_BYTE;
    } else {
        throw new Error(`${buffer.data.constructor.name} is missing implementation for ${getType.name}.`)
    }
}