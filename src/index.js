import { GeometryBuffer } from './libs/math/GeometryBuffer';
import { Node3d } from './libs/3d/Node3d';
import { Buffer } from './libs/core/Buffer';
import { HtmlNode } from './libs/html/HtmlNode';
import { WebGLCanvas } from './libs/html/WebGLCanvas';
import { Angle } from './libs/math/Angle';
import { Vector3 } from './libs/math/Vector3';
import { GLSLMaterial } from './libs/material/GLSLMaterial';
import { Render } from './libs/renderer/Render';
import { GLSLParameter } from './libs/renderer/shader/GLSL/GLSLParameter';
import { GLSLShader } from './libs/renderer/shader/GLSL/GLSLShader';
import { PerspectiveCamera } from './libs/3d/camera/PerspectiveCamera';
import { Camera } from './libs/3d/camera/Camera';
import { OrthographicCamera } from './libs/3d/camera/OrthographicCamera';

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
const cameraMatrix = new GLSLParameter(GLSLParameter.qualifier.uniform, GLSLParameter.type.mat4, Camera.cameraMatrixName);

const vColor = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_' + GeometryBuffer.colorName);

const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
    position,
    color,
    vertexMatrix,
    cameraMatrix,
    vColor
], [
    'void main(){',
    `${vColor} = ${color};`,
    `gl_Position = ${cameraMatrix} * ${vertexMatrix} * ${position};`,
    '}'
].join('\n'));

const fragmentShader = new GLSLShader(GLSLShader.type.fragmentShader, [
    vColor,
], [
    'void main(){',
    `gl_FragColor = ${vColor};`,
    '}'
].join('\n'), GLSLShader.precision.high);

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
    -0.5, -0.5, -0.5,//F
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,

    0.5, -0.5, -0.5,//R
    0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,

    0.5, -0.5, 0.5,//B
    0.5, 0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,

    0.5, 0.5, 0.5,//U
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,

    -0.5, -0.5, 0.5,//L
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,

    -0.5, -0.5, 0.5,//D
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5, 0.5,];
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

const world = new Node3d();

const a = new Node3d();
a.addRender(material, geometry);
a.translate(-2, 0, 0);
world.appendChild(a);

const b = new Node3d();
b.addRender(material, geometry);
b.translate(2, 0, 0);
world.appendChild(b);

const camera = new PerspectiveCamera(55, canvas.aspectRatio, 0.1, 100);
//const camera = new OrthographicCamera(-5, 5, -5, 5, -5, 5);
camera.rotate(Angle.toRadian(180), 0, 1, 0);
camera.translate(0, 0, 2);
camera.updateProjection();
world.appendChild(camera);


function draw() {
    a.rotate(Angle.toRadian(1), 1, 1, 1);
    b.rotate(Angle.toRadian(-1), 1, 1, 1);
    renderer.render(world);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);