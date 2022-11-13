import { GeometryBuffer } from './libs/math/GeometryBuffer';
import { Node3d } from './libs/3d/Node3d';
import { Buffer } from './libs/core/Buffer';
import { HtmlNode } from './libs/html/HtmlNode';
import { WebGLCanvas } from './libs/html/WebGLCanvas';
import { Angle } from './libs/math/Angle';
import { Vector3 } from './libs/math/Vector3';
import { GLSLMaterial } from './libs/renderer/material/GLSLMaterial';
import { Render } from './libs/renderer/Render';
import { GLSLParameter } from './libs/renderer/shader/GLSL/GLSLParameter';
import { GLSLShader } from './libs/renderer/shader/GLSL/GLSLShader';

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

const vertexMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Node3d.vertexMatrixName);

const vColor = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_' + GeometryBuffer.colorName);

const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
    position,
    color,
    vertexMatrix,
    vColor
], [
    'void main(){',
    `${vColor} = ${color};`,
    `gl_Position = ${vertexMatrix} * ${position};`,
    '}'
].join('\n'))

const fragmentShader = new GLSLShader(GLSLShader.type.fragmentShader, [
    vColor,
], [
    'void main(){',
    `gl_FragColor = ${vColor};`,
    '}'
].join('\n'), GLSLShader.precision.high)

const material = new GLSLMaterial(vertexShader, fragmentShader);

const geometry = new GeometryBuffer();
geometry.primitive = Render.primitive.triangles;
geometry.index = [
    0, 1, 2, 2, 3, 0,
    4, 5, 6, 6, 7, 4,
    8, 9, 10, 10, 11, 8,
    12, 13, 14, 14, 15, 12,
    16, 17, 18, 18, 19, 16,
    20, 21, 22, 22, 23, 20];
geometry.position = [
    0, 0, 0,//F
    0, 1, 0,
    1, 1, 0,
    1, 0, 0,

    1, 0, 0,//R
    1, 1, 0,
    1, 1, 1,
    1, 0, 1,

    1, 0, 1,//B
    1, 1, 1,
    0, 1, 1,
    0, 0, 1,

    1, 1, 1,//U
    1, 1, 0,
    0, 1, 0,
    0, 1, 1,

    0, 0, 1,//L
    0, 1, 1,
    0, 1, 0,
    0, 0, 0,

    0, 0, 1,//D
    0, 0, 0,
    1, 0, 0,
    1, 0, 1,];
geometry.color = [
    0, 0, 0, 1,
    0, 1, 0, 1,
    1, 1, 0, 1,
    1, 0, 0, 1,

    1, 0, 0, 1,
    1, 1, 0, 1,
    1, 1, 1, 1,
    1, 0, 1, 1,

    1, 0, 1, 1,
    1, 1, 1, 1,
    0, 1, 1, 1,
    0, 0, 1, 1,

    1, 1, 1, 1,
    1, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 1, 1,

    0, 0, 1, 1,
    0, 1, 1, 1,
    0, 1, 0, 1,
    0, 0, 0, 1,

    0, 0, 1, 1,
    0, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 1, 1,];


const node3d = new Node3d();
node3d.rescale(new Vector3(0.5, 0.5, 0.5));
node3d.translate(new Vector3(-1.5, -0.5, -0.5));
node3d.addRender(material, geometry);
const node3d2 = new Node3d();
node3d2.rescale(new Vector3(0.5, 0.5, 0.5));
node3d2.translate(new Vector3(0.5, -0.5, -0.5));
node3d2.addRender(material, geometry);
node3d.appendChild(node3d2);


function draw() {
    node3d.rotate(Angle.toRadian(0.1), new Vector3(1, 1, 1));
    node3d2.rotate(Angle.toRadian(-0.1), new Vector3(1, 1, 1));
    renderer.render(node3d);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);