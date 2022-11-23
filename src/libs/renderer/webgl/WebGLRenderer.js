import Camera from '../../3d/camera/Camera';
import PerspectiveCamera from '../../3d/camera/PerspectiveCamera';
import DirectionalLight from '../../3d/light/DirectionalLight';
import Light from '../../3d/light/Light';
import PointLight from '../../3d/light/PointLight';
import Node3d from '../../3d/Node3d';
import Buffer from '../../core/Buffer';
import Color from '../../core/Color';
import Node from '../../core/Node';
import PhongMaterial from '../../3d/material/PhongMaterial';
import MathArray from '../../math/MathArray';
import Matrix4 from '../../math/Matrix4';
import Render from '../Render';
import WebGLBuffer from './WebGLBuffer';
import WebGLProgram from './WebGLProgram';
import WebGLShader from './WebGLShader';
import WebGLVertexArray from './WebGLVertexArray';

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
        // gl.enable(gl.CULL_FACE);
        // gl.cullFace(gl.FRONT);

        this.clear();

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

    get programs() {
        return this.childrens.filter(c => c instanceof WebGLProgram);
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
     * @param {Render} node Node to render
     * @returns {WebGLRenderer} the current WebGLRenderer
     */
    render(node) {
        if (this.resized) {
            this.gl.viewport(0, 0, this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
            this.resized = false;
        }
        let camera = null;
        const materials = {};
        const pointLights = [];
        const directionalLights = [];
        const renders = [];
        load(this, node);

        const pointLightColors = new MathArray(pointLights.length * 3);
        const pointLightPositions = new MathArray(pointLights.length * 3);
        const pointLightAmbientStrengths = new MathArray(pointLights.length);
        const pointLightIntensities = new MathArray(pointLights.length);
        pointLights.forEach((l, i) => {
            const iv3 = i * 3;
            pointLightColors[iv3] = l.color[0];
            pointLightColors[iv3 + 1] = l.color[1];
            pointLightColors[iv3 + 2] = l.color[2];
            pointLightPositions[iv3] = l.position[0];
            pointLightPositions[iv3 + 1] = l.position[1];
            pointLightPositions[iv3 + 2] = l.position[2];
            pointLightAmbientStrengths[i] = l.ambientStrength;
            pointLightIntensities[i] = l.intensity;
        });
        const directionalLightColors = new MathArray(directionalLights.length * 3);
        const directionalLightDirections = new MathArray(directionalLights.length * 3);
        const directionalLightAmbientStrengths = new MathArray(directionalLights.length);
        directionalLights.forEach((l, i) => {
            const iv3 = i * 3;
            directionalLightColors[iv3] = l.color[0];
            directionalLightColors[iv3 + 1] = l.color[1];
            directionalLightColors[iv3 + 2] = l.color[2];
            directionalLightDirections[iv3] = l.direction[0];
            directionalLightDirections[iv3 + 1] = l.direction[1];
            directionalLightDirections[iv3 + 2] = l.direction[2];
            directionalLightAmbientStrengths[i] = l.ambientStrength;
        });
        for (const id in materials) {
            const material = materials[id];
            let update = false;
            if(material.pointLigthsCount != pointLights.length){
                material.pointLigthsCount = pointLights.length;
                update = true;
            }
            if(material.directionalLigthsCount != directionalLights.length){
                material.directionalLigthsCount = directionalLights.length;
                update = true;
            }
            if(update){
                if(this[id]){
                    this.removeChild(this[id]);
                }
            }
            this.program = this[id]  || new WebGLProgram(this, material);
            if(camera){
                this.program.setUniform(Camera.positionName, camera.position);
                this.program.setUniform(Camera.backgroundColorName, camera.backgroundColor.rgb);
                this.program.setUniform(Camera.fogDistanceName, camera.fog);
                this.program.setUniform(Camera.projectionMatrixName, camera.projectionMatrix);
            }
            if(pointLights.length > 0){
                this.program.setUniform(PointLight.colorName, pointLightColors);
                this.program.setUniform(PointLight.positionName, pointLightPositions);
                this.program.setUniform(PointLight.ambientStrengthName, pointLightAmbientStrengths);
                this.program.setUniform(PointLight.intensityName, pointLightIntensities);
            }
            if(directionalLights.length > 0){
                this.program.setUniform(DirectionalLight.colorName, directionalLightColors);
                this.program.setUniform(DirectionalLight.directionName, directionalLightDirections);
                this.program.setUniform(DirectionalLight.ambientStrengthName, directionalLightAmbientStrengths);
            }
            if(material instanceof PhongMaterial){
                this.program.setUniform(PhongMaterial.shininessName, material.shininess)
            }
        }
        this.programs.forEach(p => {
            this.program = p;
        });
        this.clear();
        renders.forEach(r => {
            draw(this, r);
        });

        return this;


        /** Load a Node in the current WebGLRenderer
         * @param {WebGLRenderer} renderer WebGLRenderer context
         * @param {Node} node Node to load
         */
        function load(renderer, node) {
            if (node instanceof Camera) {
                camera = node;
                renderer.clearColor(node.backgroundColor);
                if (node instanceof PerspectiveCamera) {
                    const aspectRatio = renderer.parent.aspectRatio;
                    if (aspectRatio != node.aspectRatio) {
                        node.aspectRatio = aspectRatio;
                        node.updateProjection();
                    }
                }
            } else if (node instanceof DirectionalLight) {
                directionalLights.push(node);
            } else if (node instanceof PointLight) {
                pointLights.push(node);
            }
            if (node instanceof Render && node.count > 0) {
                for (const name in node.parameters) {
                    const parameter = node.parameters[name];
                    if (parameter instanceof Buffer) {
                        if (!renderer[parameter.mainBuffer.id] || parameter.mainBuffer.updated) {
                            renderer.arrayBuffer = renderer[parameter.mainBuffer.id] || new WebGLBuffer(renderer, parameter.mainBuffer, renderer.gl.ARRAY_BUFFER);
                            renderer.gl.bufferData(renderer.arrayBuffer.target, parameter.mainBuffer.data, renderer.arrayBuffer.usage);
                            parameter.mainBuffer.updated = false;
                        }
                    }
                }
                if (node.index) {
                    if (!renderer[node.index.id] || node.index.updated) {
                        renderer.elementArrayBuffer = renderer[node.index.id] || new WebGLBuffer(renderer, node.index, renderer.gl.ELEMENT_ARRAY_BUFFER);
                        renderer.gl.bufferData(renderer.elementArrayBuffer.target, node.index.data, renderer.elementArrayBuffer.usage);
                        node.index.updated = false;
                    }
                }
                if(!materials[node.material.id]){
                    materials[node.material.id] = node.material;
                }
                if (node instanceof Node3d) {
                    node.setParameter(Node3d.vertexMatrixName, node.matrix);
                    node.setParameter(Node3d.normalMatrixName, node.parameters[Node3d.vertexMatrixName].clone().invert().transpose());
                }
                renders.push(node);
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

            for (const name in render.parameters) {
                renderer.program.setUniform(name, render.parameters[name]);
            }
            if (render.index) {
                renderer.gl.drawElements(renderer.gl[render.primitive], render.count, renderer[render.index.id].type, render.offset);
            } else {
                renderer.gl.drawArrays(renderer.gl[render.primitive], render.offset, render.count);
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