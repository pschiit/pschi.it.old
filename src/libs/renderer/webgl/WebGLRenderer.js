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
import SpotLight from '../../3d/light/SpotLight';

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
        this.culling = null;
        this.depth = null;
        this.clear();

        this.textureUnit = 0;

        this.renderTargets = null;

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

    get depth() {
        return this._depth;
    }

    set depth(v) {
        if (this._depth != v) {
            if (!this._depth) {
                this.gl.enable(this.gl.DEPTH_TEST);
                if (v == Material.depth.less) {
                    this.gl.depthFunc(this.gl.LESS);
                } else if (v == Material.depth.never) {
                    this.gl.depthFunc(this.gl.NEVER);
                } else if (v == Material.depth.always) {
                    this.gl.depthFunc(this.gl.ALWAYS);
                } else if (v == Material.depth.equal) {
                    this.gl.depthFunc(this.gl.EQUAL);
                } else if (v == Material.depth.notEqual) {
                    this.gl.depthFunc(this.gl.NOTEQUAL);
                } else if (v == Material.depth.greater) {
                    this.gl.depthFunc(this.gl.GREATER);
                } else if (v == Material.depth.lessEqual) {
                    this.gl.depthFunc(this.gl.LEQUAL);
                } else if (v == Material.depth.greaterEqual) {
                    this.gl.depthFunc(this.gl.GEQUAL);
                }
            } else if (!v) {
                this.gl.disable(this.gl.DEPTH_TEST);
            }
            this._depth = v;
        }
    }

    get culling() {
        return this._culling;
    }

    set culling(v) {
        if (this._culling != v) {
            if (!this._culling) {
                this.gl.enable(this.gl.CULL_FACE);
                if (v == Material.culling.front) {
                    this.gl.cullFace(this.gl.FRONT);
                } else if (v == Material.culling.back) {
                    this.gl.cullFace(this.gl.BACK);
                } else if (v == Material.culling.doubleside) {
                    this.gl.cullFace(this.gl.FRONT_AND_BACK);
                }
            } else if (!v) {
                this.gl.disable(this.gl.CULL_FACE);
            }
            this._culling = v;
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
                this.culling = v.culling;
                this.depth = v.depth;
            } else {
                this.program = null;
            }
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
            this.framebuffer = WebGLFramebuffer.from(this, renderTarget);
            if (this.texture2d?.is(renderTarget)) {
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

        const spotLightColors = [];
        const spotLightPositions = [];
        const spotLightDirections = [];
        const spotLightInnerRadius = [];
        const spotLightRadius = [];
        const spotLightAmbientStrengths = [];
        const spotLightIntensities = []

        let parentMatrix = Matrix4.identityMatrix();
        const renders = [];
        load(node);
        for (const id in materials) {
            const material = materials[id];
            let recompile = false;
            if (material.pointLigthsCount != pointLightAmbientStrengths.length) {
                material.pointLigthsCount = pointLightAmbientStrengths.length;
                recompile = true;
            }
            if (material.directionalLigthsCount != directionalLightAmbientStrengths.length) {
                material.directionalLigthsCount = directionalLightAmbientStrengths.length;
                recompile = true;
            }
            if (material.spotLigthsCount != spotLightAmbientStrengths.length) {
                material.spotLigthsCount = spotLightAmbientStrengths.length;
                recompile = true;
            }
            this.program = WebGLProgram.from(this, material, recompile);
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
            if (pointLightAmbientStrengths.length > 0) {
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
            if (spotLightAmbientStrengths.length > 0) {
                this.program.setParameter(SpotLight.colorName, new MathArray(spotLightColors));
                this.program.setParameter(SpotLight.positionName, new MathArray(spotLightPositions));
                this.program.setParameter(SpotLight.directionName, new MathArray(spotLightDirections));
                this.program.setParameter(SpotLight.innerRadiusName, new MathArray(spotLightInnerRadius));
                this.program.setParameter(SpotLight.radiusName, new MathArray(spotLightRadius));
                this.program.setParameter(SpotLight.ambientStrengthName, new MathArray(spotLightAmbientStrengths));
                this.program.setParameter(SpotLight.intensityName, new MathArray(spotLightIntensities));
            }
            if (material instanceof PhongMaterial) {
                this.program.setParameter(PhongMaterial.shininessName, material.shininess);
                this.program.setParameter(PhongMaterial.ambientColorName, material.ambientColor.rgb);
                this.program.setParameter(PhongMaterial.diffuseColorName, material.diffuseColor.rgb);
                this.program.setParameter(PhongMaterial.specularColorName, material.specularColor.rgb);
                this.program.setParameter(PhongMaterial.emissiveColorName, material.emissiveColor.rgb);
                if (material.ambientTexture) {
                    if (material.ambientTexture == renderTarget) {
                        this.program.setParameter(PhongMaterial.ambientTextureName, null);
                    } else {
                        this.program.setParameter(PhongMaterial.ambientTextureName, material.ambientTexture);
                    }
                }
                if (material.diffuseTexture) {
                    if (material.diffuseTexture == renderTarget) {
                        this.program.setParameter(PhongMaterial.diffuseTextureName, null);
                    } else {
                        this.program.setParameter(PhongMaterial.diffuseTextureName, material.diffuseTexture);
                    }
                }
                if (material.specularTexture) {
                    if (material.specularTexture == renderTarget) {
                        this.program.setParameter(PhongMaterial.specularTextureName, null);
                    } else {
                        this.program.setParameter(PhongMaterial.specularTextureName, material.specularTexture);
                    }
                }
                if (material.emissiveTexture) {
                    if (material.emissiveTexture == renderTarget) {
                        this.program.setParameter(PhongMaterial.emissiveTextureName, null);
                    } else {
                        this.program.setParameter(PhongMaterial.emissiveTextureName, material.emissiveTexture);
                    }
                }
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
            if (node.visible) {
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
                    } else if (node instanceof SpotLight && node.on) {
                        spotLightColors.push(node.color[0]);
                        spotLightColors.push(node.color[1]);
                        spotLightColors.push(node.color[2]);
                        const position = matrix.positionVector;
                        spotLightPositions.push(position[0]);
                        spotLightPositions.push(position[1]);
                        spotLightPositions.push(position[2]);
                        const direction = position.substract(node.target).normalize();
                        spotLightDirections.push(direction[0]);
                        spotLightDirections.push(direction[1]);
                        spotLightDirections.push(direction[2]);
                        spotLightRadius.push(node.radius);
                        spotLightInnerRadius.push(node.innerRadius);
                        spotLightAmbientStrengths.push(node.ambientStrength);
                        spotLightIntensities.push(node.intensity);
                    }
                }
                if (node instanceof Render && node.renderable) {
                    if (node.vertexBuffer) {
                        const buffer = WebGLBuffer.from(renderer, node.vertexBuffer, renderer.gl.ARRAY_BUFFER);
                        if (node.vertexBuffer.updated) {
                            buffer.update(node.vertexBuffer);
                        }
                        if (node.vertexBuffer.index) {
                            const index = WebGLBuffer.from(renderer, node.vertexBuffer.index, renderer.gl.ELEMENT_ARRAY_BUFFER);
                            if (node.vertexBuffer.index.updated) {
                                index.update(node.vertexBuffer.index);
                            }
                        }
                    }
                    if (node.material.texture && !renderer.renderTargets[node.material.texture.id]) {
                        if (node.material.texture.data instanceof Render) {
                            renderer.render(node.material.texture.data, node.material.texture);
                        } else {
                            renderer.texture2d = WebGLTexture.from(renderer, node.material.texture);
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
            let index = render.index;
            let primitive = render.primitive;
            let offset = render.offset;
            let count = render.count;
            if (render.vertexBuffer) {
                index = render.vertexBuffer.index;
                primitive = render.vertexBuffer.primitive;
                offset = render.vertexBuffer.offset;
                count = render.vertexBuffer.count;
                renderer.vertexArray = WebGLVertexArray.from(renderer, render.vertexBuffer, render.material);
            }
            renderer.material = render.material;

            for (const name in render.parameters) {
                renderer.program.setParameter(name, render.parameters[name]);
            }
            if (index) {
                const webGLIndex = WebGLBuffer.from(renderer, index, renderer.gl.ELEMENT_ARRAY_BUFFER);
                renderer.gl.drawElements(renderer.gl[primitive], count, webGLIndex.type, offset);
            } else {
                renderer.gl.drawArrays(renderer.gl[primitive], offset, count);
            }
        }
    }

    clearColor(color = Color.black) {
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