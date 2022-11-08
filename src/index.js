import { HtmlNode } from './libs/html/HtmlNode';
import { WebGLCanvas } from './libs/html/WebGLCanvas';
import { WebGLBuffer } from './libs/renderer/webgl/WebGLBuffer';
import { GLSLParameter } from './libs/shader/GLSLParameter';
import { WebGLProgram } from './libs/renderer/webgl/WebGLProgram';
import { WebGLShader } from './libs/renderer/webgl/WebGLShader';
import { GLSLShader } from './libs/shader/GLSLShader';
import { WebGLRenderer } from './libs/renderer/webgl/WebGLRenderer';

const defaultStyle = {
    width: '100%',
    height: '100%',
    margin: 0,
};
HtmlNode.document.style = defaultStyle;
const body = HtmlNode.body;
body.style = defaultStyle;

const canvas = new WebGLCanvas();
canvas.style = defaultStyle;
body.appendChild(canvas);
canvas.fitParent();

const renderer = canvas.context;
renderer.clearColor([0, 0, 0, 1]);
renderer.enable(WebGLRenderer.capability.scissor);

const aVertexPosition = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, 'a_VertexPosition');
const aVertexColor = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, 'a_VertexColor');

const uPointSize = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.float, 'u_PointSize');

const vVertexColor = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_VertexColor');

const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
    aVertexPosition, aVertexColor,
    uPointSize,
    vVertexColor], [
        'void main(){',
        `gl_PointSize = ${uPointSize};`,
        `gl_Position = ${aVertexPosition};`,
        `${vVertexColor} = ${aVertexColor};`,
        '}'
    ].join('')
);

const fragmentShader = new GLSLShader(GLSLShader.type.fragmentShader, [
    vVertexColor], [
        'void main(){',
        `gl_FragColor = ${vVertexColor};`,
        '}'
    ].join(''),
    'highp'
);

const program = new WebGLProgram(
    new WebGLShader(vertexShader.type, vertexShader.source),
    new WebGLShader(fragmentShader.type, fragmentShader.source)
);

renderer.useProgram(program);

const width = canvas.element.clientWidth / 2;
const height = canvas.element.clientHeight / 2;

const buffer = new WebGLBuffer(WebGLBuffer.type.arrayBuffer, WebGLBuffer.usage.staticDraw);
buffer.data = new Float32Array([
    0, 0, 0, 1, 0, 0, 1,
    0, 0, 0, 0, 1, 0, 1,
    0, 0, 0, 0, 0, 1, 1,
    0, 0, 0, 1, 1, 0, 1,]);

renderer.bindBuffer(buffer);
program.attributes[aVertexColor] = [1, 0, 0, 1];
program.attributes[aVertexPosition] = [0, 0, 0, 1];
program.uniforms[uPointSize] = [10];

renderer.scissor(0, 0, width, height);
renderer.clear();

renderer.drawArrays('POINTS', 0, 1);

renderer.scissor(width, 0, width, height);
renderer.clear();
renderer.drawArrays('POINTS', 0, 1);

renderer.scissor(0, height, width, height);
renderer.clear();
renderer.drawArrays('POINTS', 0, 1);

renderer.scissor(width, height, width, height);
renderer.clear();
renderer.drawArrays('POINTS', 0, 1);