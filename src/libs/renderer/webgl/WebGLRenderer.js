import { Node } from '../../core/Node';
import { Program } from './shader/Program';
import { FragmentShader } from './shader/FragmentShader';
import { Attribute } from './shader/parameter/Attribute';
import { Uniform } from './shader/parameter/Uniform';
import { Varying } from './shader/parameter/Varying';
import { VertexShader } from './shader/VertexShader';

export class WebGLRenderer extends Node {
    /** Create a WebGLRenderer from a WebGLRenderingContext
     * @param {WebGLRenderingContext} gl the context of the renderer
     */
    constructor(gl) {
        super();
        this.gl = gl;
        this.polyfillExtension();
        this.programs = {};
        this.addEventListener(Node.event.nodeInserted, (e) => {
            const program = e.inserted;
            if (program instanceof Program) {
                this.createProgram(program);
            }
        });
        this.addEventListener(Node.event.nodeRemoved, (e) => {
            const program = e.removed;
            if (program instanceof Program) {
                this.deleteProgram(program);
            }
        });
    }

    /** Validate type of Node (used for appendChild) 
     * @param {Node} node node to validate
     * @throws {Error} when node is not of type Program
     */
    validateType(node) {
        if (!(node instanceof Program)) {
            throw new Error(`${node.constructor.name} can't be child of ${this.constructor.name}.`);
        }
    }

    createProgram(program) {
        try {
            const compiledShaders = program.childrens.map(s => this.compileShader(s.type, s.source));
            const webGLProgram = this.linkShaders(compiledShaders);

            for (const key in program.parameters) {
                if (Object.hasOwnProperty.call(program.parameters, key)) {
                    const p = program.parameters[key];
                    if (p instanceof Attribute) {
                        p.set = this.getAttributeSetter(webGLProgram, p);
                    } else if (p instanceof Uniform) {
                        p.set = this.getUniformSetter(webGLProgram, p);
                    }
                }
            }
            this.programs[program.id] = webGLProgram;
        } catch (error) {
            this.removeChild(program);
            throw error;
        }

        return program;
    }

    deleteProgram(program) {
        if (this.programs[program.id]) {
            this.gl.deleteProgram(this.programs[program.id]);
        }
        this.programs[program.id] = null;
    }

    useProgram(program) {
        this.gl.useProgram(this.programs[program.id]);
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(this.gl[type]);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        else {
            const error = new Error(`Failed to create ${type} :\n${this.gl.getShaderInfoLog(shader)}\n\n${source}`);
            this.gl.deleteShader(shader);
            throw error;
        }
    }

    linkShaders(compiledShaders) {
        const program = this.gl.createProgram();
        compiledShaders.forEach(s => {
            this.gl.attachShader(program, s);
        });
        this.gl.linkProgram(program);

        if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            return program;
        }
        const error = new Error(`Failed to create program : ${this.gl.getProgramInfoLog(program)}`);
        throw error;
    }

    getUniformSetter(program, uniform) {
        const location = this.gl.getUniformLocation(program, uniform);
        switch (uniform.type) {
            case 'sampler2D':
            case 'bool':
                return (value) => {
                    this.gl.uniform1i(location, value);
                };
            case 'mat2':
                return (value) => {
                    this.gl.uniformMatrix2fv(location, false, value);
                };
            case 'mat3':
                return (value) => {
                    this.gl.uniformMatrix3fv(location, false, value)
                };
            case 'mat4':
                return (value) => {
                    this.gl.uniformMatrix4fv(location, false, value);
                };
            case 'float':
                return (value) => {
                    if (Number.isFinite(value)) {
                        this.gl.uniform1f(location, value);
                    } else {
                        this.gl.uniform1fv(location, value);
                    }
                };
            case 'vec2':
                return (value) => {
                    this.gl.uniform2fv(location, value);
                };
            case 'vec3':
                return (value) => {
                    this.gl.uniform3fv(location, value);
                };
            case 'vec4':
                return (value) => {
                    this.gl.uniform4fv(location, value);
                };
            case 'samplerCube':
            default:
                throw new Error(`${uniform.type} is missing getUniformSetter implementation.`);
        }
    }

    getAttributeSetter(program, attribute) {
        attribute.location = this.gl.getAttribLocation(program, attribute);
        switch (attribute.type) {
            case 'float':
                return (value) => {
                    if (Number.isFinite(value)) {
                        this.gl.vertexAttrib1f(attribute.location, value);
                    } else {
                        this.gl.vertexAttrib1fv(attribute.location, value);
                    }
                };
            case 'mat2':
            case 'vec2':
                return (value) => {
                    this.gl.vertexAttrib2fv(attribute.location, value);
                };
            case 'mat3':
            case 'vec3':
                return (value) => {
                    this.gl.vertexAttrib3fv(attribute.location, value);
                };
            case 'mat4':
            case 'vec4':
                return (value) => {
                    this.gl.vertexAttrib4fv(attribute.location, value);
                };
            case 'samplerCube':
            default:
                throw new Error(`${attribute.type} is missing getAttributeSetter implementation.`);
        }
    }

    enableVertexAttribArray(attribute, size, type, normalized, stride, offset) {
        attribute.vertexAttribArray = true;
        this.gl.vertexAttribPointer(attribute.location, size, type, normalized, stride, offset);
        this.gl.enableVertexAttribArray(attribute.location);
    }

    disableVertexAttribArray(attribute) {
        this.gl.disableVertexAttribArray(attribute.location);
        return this;
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
        const instancedArrays = this.extensions['ANGLE_instanced_arrays'];
        if (instancedArrays) {
            this.gl.drawArraysInstanced = instancedArrays.drawArraysInstancedANGLE;
            this.gl.drawElementsInstanced = instancedArrays.drawElementsInstancedANGLE;
            this.gl.vertexAttribDivisor = instancedArrays.vertexAttribDivisorANGLE;
        }
    }

    static simpleProgram() {
        const program = new Program();
        const aVertexPosition = new Attribute('vec4', 'a_VertexPosition');
        const aVertexColor = new Attribute('vec4', 'a_VertexColor');

        const uPointSize = new Uniform('float', 'u_PointSize');

        const vVertexColor = new Varying('vec4', 'v_VertexColor');

        program.appendChild(new VertexShader(
            [
                aVertexPosition, aVertexColor,
                uPointSize,
                vVertexColor,
            ],
            [
                'void main(){',
                `gl_PointSize = ${uPointSize};`,
                `gl_Position = ${aVertexPosition};`,
                `${vVertexColor} = ${aVertexColor};`,
                '}'
            ].join('')
        ));

        program.appendChild(new FragmentShader(
            'highp',
            [
                vVertexColor,
            ],
            [
                'void main(){',
                `gl_FragColor = ${vVertexColor};`,
                '}'
            ].join('')
        ));
        return program;
    }

    static defaultProgram() {
        const program = new Program();
        const aVertexPosition = new Attribute('vec4', 'a_VertexPosition');
        const aVertexColor = new Attribute('vec4', 'a_VertexColor');
        const aVertexNormal = new Attribute('vec4', 'a_VertexNormal');

        const uViewMatrix = new Uniform('mat4', 'u_ViewMatrix');
        const uVertexMatrix = new Uniform('mat4', 'u_VertexMatrix');
        const uNormalMatrix = new Uniform('mat4', 'u_NormalMatrix');
        const uPointSize = new Uniform('float', 'u_PointSize');
        const uClicked = new Uniform('bool', 'u_Clicked');

        const vVertexColor = new Varying('vec4', 'v_VertexColor');
        const vVertexNormal = new Varying('vec3', 'v_VertexNormal');
        const vVertexPosition = new Varying('vec3', 'v_VertexPosition');
        const vDistance = new Varying('float', 'v_Distance');

        program.appendChild(new VertexShader(
            [
                aVertexPosition, aVertexColor, aVertexNormal,
                uViewMatrix, , uVertexMatrix, uNormalMatrix, uPointSize, uClicked,
                vVertexColor, vVertexNormal, vVertexPosition, vDistance,
            ],
            [
                'void main(){',
                `gl_PointSize = ${uPointSize};`,
                `gl_Position = ${uViewMatrix} * ${uVertexMatrix} * ${aVertexPosition};`,
                `${vVertexColor} = ${aVertexColor};`,
                `if(${uClicked}) {`,
                `return;`,
                `}`,
                `${vVertexNormal} = normalize(vec3(${uNormalMatrix} * ${aVertexNormal}));`,
                `${vVertexPosition} = vec3(${uVertexMatrix} * ${aVertexPosition});`,
                `${vDistance} = gl_Position.w;`,
                '}'
            ].join('')
        ));

        const uLightColor = new Uniform('vec3', 'u_LightColor');
        const uLightPosition = new Uniform('vec3', 'u_LightPosition');
        const uAmbientLight = new Uniform('vec3', 'u_AmbientLight');
        const uFogColor = new Uniform('vec3', 'u_FogColor');
        const uFogDistance = new Uniform('vec2', 'u_FogDist');

        program.appendChild(new FragmentShader(
            'highp',
            [
                uLightColor, uLightPosition, uAmbientLight, uClicked, uFogColor, uFogDistance,
                vVertexColor, vVertexNormal, vVertexPosition, vDistance,
            ],
            [
                'void main(){',
                `if(${uClicked}) {`,
                `gl_FragColor = ${vVertexColor};`,
                `return;`,
                `}`,
                `vec3 lightDirection = normalize(${uLightPosition} - ${vVertexPosition});`,
                `float nDotL = max(dot(lightDirection, ${vVertexNormal}), 0.0);`,
                `vec3 diffuse = ${uLightColor} * ${vVertexColor}.rgb * nDotL;`,
                `vec3 ambient = ${uAmbientLight} * ${vVertexColor}.rgb;`,
                `float fogFactor = clamp((${uFogDistance}.y - ${vDistance}) / (${uFogDistance}.y - ${uFogDistance}.x), 0.0, 1.0);`,
                `vec3 color = mix(${uFogColor}, vec3(diffuse + ambient), fogFactor);`,
                `gl_FragColor = vec4(color, ${vVertexColor}.a);`,
                '}'
            ].join('')
        ));
        return program;
    }
}