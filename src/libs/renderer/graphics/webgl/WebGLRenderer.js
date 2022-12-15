import Color from '../../../core/Color';
import Node from '../../../core/Node';
import Vector4 from '../../../math/Vector4';
import GraphicsNode from '../GraphicsNode';
import GraphicsRenderer from '../GraphicsRenderer';
import Material from '../Material';
import Render from '../Render';
import RenderTarget from '../RenderTarget';
import Texture from '../Texture';
import WebGLBuffer from './WebGLBuffer';
import WebGLFramebuffer from './WebGLFramebuffer';
import WebGLProgram from './WebGLProgram';
import WebGLShader from './WebGLShader';
import WebGLTexture from './WebGLTexture';
import WebGLVertexArray from './WebGLVertexArray';

export default class WebGLRenderer extends GraphicsRenderer {
    /** Create a WebGLRenderer from a WebGLRenderingContext
     * @param {WebGLRenderingContext} gl the context of the renderer
     */
    constructor(gl) {
        super();
        this.gl = gl;
        polyfillExtension(this);
        this.viewport = new Vector4();
        this.clearColor = new Color();
        this.scissor = null;
        this.culling = null;
        this.depth = null;

        this.textureUnit = 0;

        this.nodes = {};
        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (this.nodes[child.name]) {
                this.removeChild(this.nodes[child.name]);
            }
            this.nodes[child.name] = child;
        });
        this.addEventListener(Node.event.nodeRemoved, (e) => {
            const child = e.removed;
            this.nodes[child.name] = null;
            if (child instanceof WebGLShader) {
                this.gl.deleteShader(child.location);
                child.location = null;
            } else if (child instanceof WebGLProgram) {
                this.gl.deleteProgram(child.location);
                child.location = null;
                child.parameters = {};
                child.parameters = {};
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
            } else if (child instanceof WebGLTexture) {
                this.gl.deleteTexture(child.location);
                child.location = null;
                if (this.texture2d === child) {
                    this.texture2d = null;
                } else if (this.textureCubeMap === child) {
                    this.textureCubeMap = null;
                }
            } else if (child instanceof WebGLFramebuffer) {
                this.gl.deleteFramebuffer(child.location);
                this.gl.deleteRenderbuffer(child.renderBuffer);
                if (this.framebuffer === child) {
                    this.framebuffer = null;
                }
            }
        });
    }

    /** Render a GraphicsNode in the current WebGLRenderer
     * @param {GraphicsNode} node Node to render
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    render(node) {
        let renderTarget = this.parent.renderTarget;
        if (node instanceof Render && renderTarget.data != node) {
            renderTarget.data = node;
        } else if (node instanceof Texture) {
            if (!this.framebuffer?.is(node)) {
                this.framebuffer = WebGLFramebuffer.from(this, node);
            }
            if (this.texture2d?.is(node)) {
                this.texture2d = null;
            }
            renderTarget = node.data;
        } else if (node instanceof RenderTarget) {
            renderTarget = node;
        }

        render(this, renderTarget);
        const read = renderTarget.read;
        if (read) {
            this.gl.readPixels(read[0], read[1], read[2], read[3], WebGLRenderer.formatFrom(this, renderTarget.format), WebGLRenderer.typeFrom(this, renderTarget.type), renderTarget.output);
        }
        if (this.framebuffer) {
            this.framebuffer = null;
        }

        return this;
    }

    /** Remove all dependencies from GraphicsNode in the current WebGLRenderer
     * @param {GraphicsNode} node GraphicsNode to render
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    remove(node) {
        const toRemove = this.childrens.filter(c => c.is(node));
        toRemove.forEach(this.removeChild.bind(this));

        return this;
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

    /** Return the WebGLFramebuffer currently used by the WebGLRenderer
     * @return {WebGLFramebuffer} the WebGLFramebuffer used
     */
    get framebuffer() {
        return this._framebuffer;
    }

    /** Bind a WebGLFramebuffer as the current texture of the WebGLRenderer
     * @param {WebGLFramebuffer} v WebGLFramebuffer to bind
     */
    set framebuffer(v) {
        if (this._framebuffer != v) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, v?.location);
            this._framebuffer = v;
        }
    }

    /** Return the WebGLTexture currently used by the WebGLRenderer
     * @return {WebGLTexture} the WebGLVertexArray used
     */
    get texture2d() {
        return this._texture2d;
    }

    /** Bind a WebGLTexture as the current texture of the WebGLRenderer
     * @param {WebGLTexture} v WebGLTexture to bind
     */
    set texture2d(v) {
        if (this._texture2d != v) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, v?.location);
            this._texture2d = v;
        }
    }

    /** Return the WebGLTexture currently used by the WebGLRenderer
     * @return {WebGLTexture} the WebGLVertexArray used
     */
    get textureCubeMap() {
        return this._textureCubeMap;
    }

    /** Bind a WebGLTexture as the current texture of the WebGLRenderer
     * @param {WebGLTexture} v WebGLTexture to bind
     */
    set textureCubeMap(v) {
        if (this._textureCubeMap != v) {
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, v?.location);
            this._textureCubeMap = v;
        }
    }

    get material() {
        return this._material;
    }

    set material(v) {
        if (this._material != v) {
            this._material = v;
            if (v) {
                this.program = WebGLProgram.from(this, v);
                const culling = v.culling;
                if (culling) {
                    if (!this.culling) {
                        this.gl.enable(this.gl.CULL_FACE);
                    }
                    if (this.culling != culling) {
                        this.culling = culling;
                        if (culling == Material.culling.front) {
                            this.gl.cullFace(this.gl.FRONT);
                        } else if (culling == Material.culling.back) {
                            this.gl.cullFace(this.gl.BACK);
                        } else if (culling == Material.culling.doubleside) {
                            this.gl.cullFace(this.gl.FRONT_AND_BACK);
                        }
                    }
                } else if (this.culling) {
                    this.gl.disable(this.gl.CULL_FACE);
                    this.culling = null;
                }
                const depth = v.depth;
                if (depth) {
                    if (!this.depth) {
                        this.gl.enable(this.gl.DEPTH_TEST);
                    }
                    if (this.depth != depth) {
                        this.depth = depth;
                        if (depth == Material.depth.less) {
                            this.gl.depthFunc(this.gl.LESS);
                        } else if (depth == Material.depth.nedepther) {
                            this.gl.depthFunc(this.gl.NEVER);
                        } else if (depth == Material.depth.always) {
                            this.gl.depthFunc(this.gl.ALWAYS);
                        } else if (depth == Material.depth.equal) {
                            this.gl.depthFunc(this.gl.EQUAL);
                        } else if (depth == Material.depth.notEqual) {
                            this.gl.depthFunc(this.gl.NOTEQUAL);
                        } else if (depth == Material.depth.greater) {
                            this.gl.depthFunc(this.gl.GREATER);
                        } else if (depth == Material.depth.lessEqual) {
                            this.gl.depthFunc(this.gl.LEQUAL);
                        } else if (depth == Material.depth.greaterEqual) {
                            this.gl.depthFunc(this.gl.GEQUAL);
                        }
                    }
                } else if (this.depth) {
                    this.gl.disable(this.gl.DEPTH_TEST);
                    this.depth = null;
                }
                this.depth = v.depth;
            } else {
                this.program = null;
            }
        }
    }

    static formatFrom(renderer, format) {
        return format === RenderTarget.format.rgba ? renderer.gl.RGBA
            : format === RenderTarget.format.rbg ? renderer.gl.RGB
                : renderer.gl.ALPHA;
    }

    static typeFrom(renderer, typeArray) {
        return typeArray === Float32Array ? renderer.gl.FLOAT
            : typeArray === Uint32Array ? renderer.gl.UNSIGNED_INT
                : typeArray === Uint16Array ? renderer.gl.UNSIGNED_SHORT
                    : renderer.gl.UNSIGNED_BYTE;
    }
}

/** Render a Scene in a WebGLRenderer
 * @param {WebGLRenderer} renderer drawing context
 * @param {RenderTarget} renderTarget to render
 */
function render(renderer, renderTarget) {
    const scene = renderTarget.scene;
    for (const id in scene.buffers) {
        const buffer = scene.buffers[id];
        const webGLBuffer = WebGLBuffer.from(renderer, buffer, renderer.gl.ARRAY_BUFFER);
        webGLBuffer.update(buffer);
    }
    for (const id in scene.indexes) {
        const buffer = scene.indexes[id];
        const webGLBuffer = WebGLBuffer.from(renderer, buffer, renderer.gl.ELEMENT_ARRAY_BUFFER);
        webGLBuffer.update(buffer);
    }
    for (const id in scene.textures) {
        const texture = scene.textures[id];
        const webGLTexture = WebGLTexture.from(renderer, texture);
        webGLTexture.update(texture);
    }
    for (const id in scene.materials) {
        const material = scene.materials[id];
        renderer.program = WebGLProgram.from(renderer, material);
        for (const name in material.parameters) {
            renderer.program.setParameter(name, material.parameters[name]);
        }
        for (const name in scene.parameters) {
            if (renderer.program.parameters[name]) {
                const param = scene.parameters[name];
                renderer.program.setParameter(name, param);
            }
        }
        scene.programs.push(renderer.program);
    }
    const viewport = renderTarget.viewport;
    const scissor = renderTarget.scissor;
    const clearColor = scene.camera?.backgroundColor || Color.black;
    if (scissor) {
        if (!renderer.scissor) {
            renderer.gl.enable(renderer.gl.SCISSOR_TEST);
        }
        if (!renderer.scissor?.equals(scissor)) {
            renderer.gl.scissor(scissor[0], scissor[1], scissor[2], scissor[3]);
            renderer.scissor = scissor;
        }
    } else if (renderer.scissor) {
        renderer.gl.disable(renderer.gl.SCISSOR_TEST);
        renderer.scissor = null;
    }
    if (!renderer.viewport.equals(viewport)) {
        renderer.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
        renderer.viewport = viewport;
    }
    if (!renderer.clearColor.equals(clearColor)) {
        renderer.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);
        renderer.clearColor = clearColor;
    }
    clear();
    scene.renders.forEach(r => {
        if (renderTarget.material) {
            draw(r, renderTarget.material);
        } else {
            draw(r, r.material);
        }
    });
    renderer.vertexArray = null;


    function clear(color = true, depth = true, stencil = true) {
        let bits = 0;

        if (color) bits |= renderer.gl.COLOR_BUFFER_BIT;
        if (depth) bits |= renderer.gl.DEPTH_BUFFER_BIT;
        if (stencil) bits |= renderer.gl.STENCIL_BUFFER_BIT;

        renderer.gl.clear(bits);
    }

    /** Draw a Render in a WebGLRenderer
     * @param {Render} render to use
     * @param {Material} material to use
     */
    function draw(render, material) {
        renderer.vertexArray = WebGLVertexArray.from(renderer, render.vertexBuffer, material);
        renderer.material = material;

        for (const name in render.parameters) {
            renderer.program.setParameter(name, render.parameters[name]);
        }
        const divisorCount = render.vertexBuffer.divisorCount;
        if (render.vertexBuffer.index) {
            const webGLIndex = WebGLBuffer.from(renderer, render.vertexBuffer.index, renderer.gl.ELEMENT_ARRAY_BUFFER);
            if (divisorCount) {
                renderer.gl.drawElementsInstanced(renderer.gl[render.vertexBuffer.primitive], render.vertexBuffer.count, WebGLRenderer.typeFrom(renderer, render.vertexBuffer.index.type), render.vertexBuffer.offset, divisorCount);
            } else {
                renderer.gl.drawElements(renderer.gl[render.vertexBuffer.primitive], render.vertexBuffer.count, WebGLRenderer.typeFrom(renderer, render.vertexBuffer.index.type), render.vertexBuffer.offset);
            }
        } else if (divisorCount) {
            renderer.gl.drawArraysInstanced(renderer.gl[render.vertexBuffer.primitive], render.vertexBuffer.offset, render.vertexBuffer.count, divisorCount);
        } else {
            renderer.gl.drawArrays(renderer.gl[render.vertexBuffer.primitive], render.vertexBuffer.offset, render.vertexBuffer.count);
        }
    }
}

function polyfillExtension(renderer) {
    renderer.extensions = {};
    renderer.gl.getSupportedExtensions().forEach(e => renderer.extensions[e] = renderer.gl.getExtension(e));
    const standardDerivative = getExtension('OES_standard_derivatives');
    const instancedArrays = getExtension('ANGLE_instanced_arrays');
    const vertexArray = getExtension('OES_vertex_array_object');
    Object.defineProperties(renderer.gl, {
        //OES_standard_derivatives
        FRAGMENT_SHADER_DERIVATIVE_HINT:{
            value: standardDerivative.FRAGMENT_SHADER_DERIVATIVE_HINT_OES,
            writable: false
        },
        //ANGLE_instanced_arrays
        VERTEX_ATTRIB_ARRAY_DIVISOR: {
            value: instancedArrays.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE,
            writable: false
        },
        drawArraysInstanced: {
            value: function (mode, first, count, primcount) {
                return instancedArrays.drawArraysInstancedANGLE(mode, first, count, primcount);
            },
            writable: false
        },
        drawElementsInstanced: {
            value: function (mode, count, type, offset, primcount) {
                return instancedArrays.drawElementsInstancedANGLE(mode, count, type, offset, primcount);
            },
            writable: false
        },
        vertexAttribDivisor: {
            value: function (index, divisor) {
                return instancedArrays.vertexAttribDivisorANGLE(index, divisor);
            },
            writable: false
        },
        //OES_vertex_array_object
        VERTEX_ARRAY_BINDING: {
            value: vertexArray.VERTEX_ARRAY_BINDING_OES,
            writable: false
        },
        createVertexArray: {
            value: function () {
                return vertexArray.createVertexArrayOES();
            },
            writable: false
        },
        deleteVertexArray: {
            value: function (arrayObject) {
                return vertexArray.deleteVertexArrayOES(arrayObject);
            },
            writable: false
        },
        isVertexArray: {
            value: function (arrayObject) {
                return vertexArray.isVertexArray(arrayObject);
            },
            writable: false
        },
        bindVertexArray: {
            value: function (arrayObject) {
                return vertexArray.bindVertexArrayOES(arrayObject);
            },
            writable: false
        },
    });

    function getExtension(name) {
        return renderer.extensions[name]
            || renderer.extensions['MOZ_' + name]
            || renderer.extensions['OP_' + name]
            || renderer.extensions['WEBKIT_' + name];
    }
}