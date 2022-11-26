import Camera from '../../3d/camera/Camera';
import PerspectiveCamera from '../../3d/camera/PerspectiveCamera';
import DirectionalLight from '../../3d/light/DirectionalLight';
import PointLight from '../../3d/light/PointLight';
import Node3d from '../../3d/Node3d';
import Buffer from '../../core/Buffer';
import Color from '../../core/Color';
import Node from '../../core/Node';
import PhongMaterial from '../../3d/material/PhongMaterial';
import MathArray from '../../math/MathArray';
import Render from '../Render';
import WebGLBuffer from './WebGLBuffer';
import WebGLFramebuffer from './WebGLFramebuffer';
import WebGLProgram from './WebGLProgram';
import WebGLShader from './WebGLShader';
import WebGLVertexArray from './WebGLVertexArray';
import Texture from '../Texture';
import WebGLTexture from './WebGLTexture';
import Material from '../Material';
import Vector2 from '../../math/Vector2';
import Matrix4 from '../../math/Matrix4';
import Vector3 from '../../math/Vector3';
import VertexBuffer from '../VertexBuffer';

export default class WebGLRenderer extends Node {
    /** Create a WebGLRenderer from a WebGLRenderingContext
     * @param {WebGLRenderingContext} gl the context of the renderer
     */
    constructor(gl) {
        super();
        this.resized = true;
        this.gl = gl;
        this.polyfillExtension();
        this.clearColor();
        this.gl.enable(this.gl.DEPTH_TEST);
        this.textureUnit = 0;
        // gl.enable(gl.CULL_FACE);
        // gl.cullFace(gl.BACK);

        this.clear();
        this._vertexArray = null;
        this._program = null;
        this._arrayBuffer = null;
        this._elementArrayBuffer = null;
        this._texture2d = null;
        this._textureCubeMap = null;
        this._framebuffer = null;

        this.renderTargets = null;

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

    /** Return the WebGLFramebuffer currently used by the WebGLRenderer
     * @return {WebGLFramebuffer} the WebGLFramebuffer used
     */
    get framebuffer() {
        return this._framebuffer;
    }

    /** Bind a WebGLFramebuffer as the current framebuffer of the WebGLRenderer
     * @param {WebGLFramebuffer} v WebGLFramebuffer to bind
     */
    set framebuffer(v) {
        if (this._framebuffer != v) {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, v?.location);
            this._framebuffer = v;
        }
    }
    /** Render a Render in the current WebGLRenderer
     * @param {Render} node Node to render
     * @param {Texture} renderTarget Texture to render onto(optional)
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    render(node, renderTarget = null) {
        const renderer = this;
        if (renderTarget) {
            this.renderTargets[renderTarget.id] = true;
            this.framebuffer = this['fb' + renderTarget.id] || new WebGLFramebuffer(this, renderTarget);
            if (this.texture2d == this[renderTarget.id]) {
                this.texture2d = null;
            }
            this.gl.viewport(renderTarget.x, renderTarget.y, renderTarget.width, renderTarget.height);
        } else {
            this.renderTargets = {};
            if (this.resized) {
                this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
                this.resized = false;
            }
        }
        let camera = null;
        const materials = {};
        const pointLightColors = [];
        const pointLightPositions = [];
        const pointLightAmbientStrengths = [];
        const pointLightIntensities = [];
        const directionalLightColors = [];
        const directionalLightDirections = [];
        const directionalLightAmbientStrengths = [];
        let parentMatrix = Matrix4.identityMatrix();
        const renders = [];
        load(node);
        for (const id in materials) {
            const material = materials[id];
            let update = false;
            if (material.pointLigthsCount != pointLightIntensities.length) {
                material.pointLigthsCount = pointLightIntensities.length;
                update = true;
            }
            if (material.directionalLigthsCount != directionalLightAmbientStrengths.length) {
                material.directionalLigthsCount = directionalLightAmbientStrengths.length;
                update = true;
            }
            if (update) {
                if (this[id]) {
                    this.removeChild(this[id]);
                }
            }
            this.program = this[id] || new WebGLProgram(this, material);
            if (camera) {
                this.program.setParameter(Camera.positionName, camera.position);
                this.program.setParameter(Camera.backgroundColorName, camera.backgroundColor.rgb);
                this.program.setParameter(Camera.fogDistanceName, camera.fog);
                this.program.setParameter(Camera.projectionMatrixName, camera.projectionMatrix);
            } else {
                this.program.setParameter(Camera.positionName, new Vector3(0, 0, 0));
                this.program.setParameter(Camera.backgroundColorName, new Vector3(0, 0, 0));
                this.program.setParameter(Camera.fogDistanceName, new Vector2(0, 1000));
                this.program.setParameter(Camera.projectionMatrixName, Matrix4.identityMatrix());
            }
            if (pointLightIntensities.length > 0) {
                this.program.setParameter(PointLight.colorName, new MathArray(pointLightColors));
                this.program.setParameter(PointLight.positionName, new MathArray(pointLightPositions));
                this.program.setParameter(PointLight.ambientStrengthName, new MathArray(pointLightAmbientStrengths));
                this.program.setParameter(PointLight.intensityName, new MathArray(pointLightIntensities));
            }
            if (directionalLightAmbientStrengths.length > 0) {
                this.program.setParameter(DirectionalLight.colorName, new MathArray(directionalLightColors));
                this.program.setParameter(DirectionalLight.directionName, new MathArray(directionalLightDirections));
                this.program.setParameter(DirectionalLight.ambientStrengthName, new MathArray(directionalLightAmbientStrengths));
            }
            if (material instanceof PhongMaterial) {
                this.program.setParameter(PhongMaterial.shininessName, material.shininess);
            }
            if (material.texture) {
                if (material.texture == renderTarget) {
                    this.program.setParameter(Material.textureName, null);
                } else {
                    this.program.setParameter(Material.textureName, material.texture);
                }
            }
        }
        this.clear();
        renders.forEach(draw);
        if (renderTarget) {
            this.framebuffer = null;
            this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
            this.resized = false;
        }
        this.vertexArray = null;

        return this;


        /** Load a Node in the current WebGLRenderer
         * @param {Node} node Node to load
         */
        function load(node) {
            if(node.visible){
                const previousParentMatrix = parentMatrix;
                if (node instanceof Node3d) {
                    const matrix = node.matrix.clone().multiply(parentMatrix);
                    parentMatrix = matrix;
                    node.setParameter(Node3d.vertexMatrixName, matrix);
                    node.setParameter(Node3d.normalMatrixName, matrix.clone().invert().transpose());
                    if (node instanceof Camera) {
                        camera = node;
                        renderer.clearColor(node.backgroundColor);
                        if (node instanceof PerspectiveCamera) {
                            const aspectRatio = renderTarget ? renderTarget.aspectRatio
                                : renderer.parent.aspectRatio;
                            if (aspectRatio != node.aspectRatio) {
                                node.aspectRatio = aspectRatio;
                                node.projectionUpdated = true;
                            }
                        }
                    } else if (node instanceof DirectionalLight && node.on) {
                        directionalLightColors.push(node.color[0]);
                        directionalLightColors.push(node.color[1]);
                        directionalLightColors.push(node.color[2]);
                        const direction = matrix.positionVector.substract(node.target).normalize();
                        directionalLightDirections.push(direction[0]);
                        directionalLightDirections.push(direction[1]);
                        directionalLightDirections.push(direction[2]);
                        directionalLightAmbientStrengths.push(node.ambientStrength);
                    } else if (node instanceof PointLight && node.on) {
                        pointLightColors.push(node.color[0]);
                        pointLightColors.push(node.color[1]);
                        pointLightColors.push(node.color[2]);
                        const position = matrix.positionVector;
                        pointLightPositions.push(position[0]);
                        pointLightPositions.push(position[1]);
                        pointLightPositions.push(position[2]);
                        pointLightAmbientStrengths.push(node.ambientStrength);
                        pointLightIntensities.push(node.intensity);
                    }
                }
                if (node instanceof Render && node.renderable) {
                    if (node.vertexBuffer) {
                        if (!renderer[node.vertexBuffer.id] || node.vertexBuffer.updated) {
                            const buffer = renderer[node.vertexBuffer.id] || new WebGLBuffer(renderer, node.vertexBuffer, renderer.gl.ARRAY_BUFFER);
                            buffer.update(node.vertexBuffer);
                            node.vertexBuffer.updated = false;
                        }
                        if (node.vertexBuffer.index) {
                            if (!renderer[node.vertexBuffer.index.id] || node.vertexBuffer.index.updated) {
                                const index = renderer[node.vertexBuffer.index.id] || new WebGLBuffer(renderer, node.vertexBuffer.index, renderer.gl.ELEMENT_ARRAY_BUFFER);
                                index.update(node.vertexBuffer.index);
                                node.vertexBuffer.index.updated = false;
                            }
                        }
                    }
                    if (node.material.texture && !renderer.renderTargets[node.material.texture.id]) {
                        if (node.material.texture.data instanceof Render) {
                            renderer.render(node.material.texture.data, node.material.texture);
                        } else {
                            renderer.texture2d = renderer[node.material.texture.id] || new WebGLTexture(renderer, node.material.texture);
                            if (node.material.texture.updated) {
                                renderer.texture2d.update(node.material.texture);
                                node.material.texture.updated = false;
                            }
                        }
                    }
                    if (!materials[node.material.id]) {
                        materials[node.material.id] = node.material;
                    }
                    renders.push(node);
                }
                node.childrens.forEach(load);
                parentMatrix = previousParentMatrix;
            }
        }

        /** Draw a Render in the current WebGLRenderer
         * @param {Render} render Render to draw
         */
        function draw(render) {
            if (render.vertexBuffer) {
                renderer.vertexArray = renderer[render.vertexBuffer.id + '_' + render.material.id] || new WebGLVertexArray(renderer, render.vertexBuffer, render.material);
                renderer.program = renderer[render.material.id];

                for (const name in render.parameters) {
                    renderer.program.setParameter(name, render.parameters[name]);
                }
                if (render.vertexBuffer.index) {
                    renderer.gl.drawElements(renderer.gl[render.vertexBuffer.primitive], render.vertexBuffer.count, renderer[render.vertexBuffer.index.id].type, render.vertexBuffer.offset);
                } else {
                    renderer.gl.drawArrays(renderer.gl[render.vertexBuffer.primitive], render.vertexBuffer.offset, render.vertexBuffer.count);
                }
            } else {
                renderer.program = renderer[render.material.id];

                for (const name in render.parameters) {
                    renderer.program.setParameter(name, render.parameters[name]);
                }
                if (render.index) {
                    const index = renderer[render.index.id] || new WebGLBuffer(renderer, render.index, renderer.gl.ELEMENT_ARRAY_BUFFER);
                    index.update(render.index);
                    renderer.gl.drawElements(renderer.gl[render.primitive], render.count, renderer[render.index.id].type, render.offset);
                } else {
                    renderer.gl.drawArrays(renderer.gl[render.primitive], render.offset, render.count);
                }
            }
        }
    }

    clearColor(color = new Color(0, 0, 0, 1)) {
        if (color != this._clearColor) {
            this.gl.clearColor(color[0], color[1], color[2], color[3]);
            this._clearColor = color;
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