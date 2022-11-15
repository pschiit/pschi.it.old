import { Camera } from '../../3d/camera/Camera';
import { Node3d } from '../../3d/Node3d';
import { Buffer } from '../../core/Buffer';
import { Node } from '../../core/Node';
import { Matrix4 } from '../../math/Matrix4';
import { Render } from '../Render';
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
        this.resized = true;
        this.gl = gl;
        this.polyfillExtension();
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.clear();
        // gl.enable(gl.CULL_FACE);
        // gl.cullFace(gl.FRONT);

        this.clear();

        this.cameras = [];
        this.renders = [];

        this._vertexArray = null;
        this._program = null;
        this._arrayBuffer = null;
        this._elementArrayBuffer = null;

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            this[child.name] = child;
        });
        this.addEventListener(Node.event.nodeRemoved, (e) => {
            const child = e.removed;
            this[child.name] = null;
            if (child instanceof WebGLShader) {
                this.gl.deleteShader(child.location);
                child.location = null;
            } else if (child instanceof WebGLProgram) {
                this.gl.deleteProgram(child.location);
                child.location = null;
                child.attributes = {};
                child.uniforms = {};
                if (this.program === child) {
                    this.program = null;
                }
            } else if (child instanceof WebGLBuffer) {
                this.gl.deleteBuffer(child.location);
                child.location = null;
                delete child.update;
                if (this.arrayBuffer === child) {
                    this.arrayBuffer = null;
                } else if (this.elementArrayBuffer === child) {
                    this.elementArrayBuffer = null;
                }
            } else if (child instanceof WebGLVertexArray) {
                this.gl.deleteVertexArray(child.location);
                child.location = null;
                if (this.vertexArray === child) {
                    this.vertexArray = null;
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
            this.gl.useProgram(v?.location);
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
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, v?.location);
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
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, v?.location);
            this._elementArrayBuffer = v;
        }
    }

    /** Return the WebGLVertexArray currently used by the WebGLRenderer
     * @return {WebGLVertexArray} the WebGLVertexArray used
     */
    get vertexArray() {
        return this._vertexArray;
    }

    /** Bind a WebGLVertexArray as the current Vertex Array Object of the WebGLRenderer
     * @param {WebGLVertexArray} v WebGLVertexArray to bind
     */
    set vertexArray(v) {
        if (this._vertexArray != v) {
            this.gl.bindVertexArray(v?.location);
            this._vertexArray = v;
        }
    }

    /** Render a Render in the current WebGLRenderer
     * @param {Node} node Render to render
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    render(node) {
        if (this.resized) {
            console.log('resized');
            this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
            this.resized = false;
        }
        this.clear();
        this.renders = [];
        load(this, node);
        if (this.cameras.length == 0) {
            const camera = Matrix4.identityMatrix();
            this.renders.forEach(r => {
                r.parameters[Camera.cameraMatrixName] = camera;
                draw(this, r);
            });
        } else {
            const aspectRatio = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
            this.cameras.forEach(c => {
                if (c.aspectRatio
                    && c.aspectRatio != aspectRatio) {
                        c.aspectRatio = aspectRatio;
                        c.updateProjection();
                }
                this.renders.forEach(r => {
                    r.parameters[Camera.cameraMatrixName] = c.projectionMatrix;
                    draw(this, r);
                });
            });
        }

        this.renders = [];

        return this;



        /** Load a Node in the current WebGLRenderer
         * @param {WebGLRenderer} renderer WebGLRenderer context
         * @param {Node} node Node to load
         */
        function load(renderer, node) {
            if (node instanceof Camera) {
                renderer.cameras.push(node);
            } else if (node instanceof Render) {
                for (const name in node.parameters) {
                    const parameter = node.parameters[name];
                    if (parameter instanceof Buffer) {
                        renderer.arrayBuffer = renderer[parameter.mainBuffer.id] || new WebGLBuffer(renderer, parameter.mainBuffer, renderer.gl.ARRAY_BUFFER);
                        if (parameter.mainBuffer.updated) {
                            renderer.gl.bufferData(renderer.arrayBuffer.target, parameter.mainBuffer.data, renderer.arrayBuffer.usage);
                            parameter.mainBuffer.updated = false;
                        }
                    }
                }
                if (node.index) {
                    renderer.elementArrayBuffer = renderer[node.index.id] || new WebGLBuffer(renderer, node.index, renderer.gl.ELEMENT_ARRAY_BUFFER);
                    if (node.index.updated) {
                        renderer.gl.bufferData(renderer.elementArrayBuffer.target, node.index.data, renderer.elementArrayBuffer.usage);
                        node.index.updated = false;
                    }
                }
                if (!renderer[node.id]) {
                    new WebGLVertexArray(renderer, node);
                }
                if (node.parent instanceof Node3d) {
                    node.setParameter(Node3d.vertexMatrixName, node.parent.matrix);
                }
                renderer.renders.push(node);
            }

            node.childrens.forEach(c => {
                load(renderer, c);
            });
        }

        /** Draw a Render in a WebGLRenderer
         * @param {WebGLRenderer} renderer WebGLRenderer context
         * @param {Render} render Render to draw
         */
        function draw(renderer, render) {
            renderer.vertexArray = renderer[render.id] || new WebGLVertexArray(renderer, render);
            renderer.program = renderer[render.material.id];

            for (const name in renderer.program.uniforms) {
                if (render.parameters[name]) {
                    renderer.program.uniforms[name](render.parameters[name]);
                }
            }
            if (render.index) {
                renderer.elementArrayBuffer = renderer[render.index.id];
                renderer.gl.drawElements(renderer.gl[render.primitive], render.count, renderer.elementArrayBuffer.type, render.offset);
            } else {
                renderer.gl.drawArrays(renderer.gl[render.primitive], render.offset, render.count);
            }
        }
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