import { Node3d } from './libs/3d/Node3d';
import { Buffer } from './libs/core/Buffer';
import { ArrayBuffer } from './libs/core/ArrayBuffer';
import { HtmlNode } from './libs/html/HtmlNode';
import { WebGLCanvas } from './libs/html/WebGLCanvas';
import { GLSLMaterial } from './libs/material/GLSLMaterial';
import { GeometryBuffer } from './libs/3d/geometry/GeometryBuffer';
import { GLSLShader } from './libs/renderer/shader/GLSL/GLSLShader';
import { GLSLParameter } from './libs/renderer/shader/GLSL/GLSLParameter';

const defaultStyle = {
    width: '100%',
    height: '100%',
    margin: 0,
};
HtmlNode.document.style = defaultStyle;
const body = HtmlNode.body;
body.style = defaultStyle;

const canvas = new WebGLCanvas();
body.appendChild(canvas);
canvas.style = defaultStyle;
canvas.fitParent();

const renderer = canvas.context;

const position = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, GeometryBuffer.positionName);
const color = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, GeometryBuffer.colorName);
const vColor = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_' + GeometryBuffer.colorName);

const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
    position,
    color,
    vColor
], [
    'void main(){',
    `${vColor} = ${color};`,
    `gl_Position = ${position};`,
    '}'
].join('\n'))

const fragmentShader = new GLSLShader(GLSLShader.type.vertexShader, [
    vColor,
], [
    'void main(){',
    `gl_FragColor = ${vColor};`,
    '}'
].join('\n'), GLSLShader.precision.high)

const material = new GLSLMaterial(vertexShader, fragmentShader);
const geometry = new GeometryBuffer();

geometry.index = [0, 1, 2];
geometry.position = [
    -.5, -0.5, 0,
    0, 0.5, 0,
    0.5, -0.5, 0];
geometry.color = [
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1];

renderer.load(geometry);
renderer.load(material);
renderer.program.attributes[GeometryBuffer.positionName] = geometry.position;
renderer.program.attributes[GeometryBuffer.colorName] = geometry.color;
renderer.viewport(0, 0, canvas.element.clientWidth, canvas.element.clientHeight);
renderer.clear();
renderer.drawBuffer(geometry.primitive, geometry);