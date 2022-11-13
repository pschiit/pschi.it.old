import { Geometry3d } from './libs/3d/geometry/Geometry3d';
import { Buffer } from './libs/core/Buffer';
import { HtmlNode } from './libs/html/HtmlNode';
import { WebGLCanvas } from './libs/html/WebGLCanvas';
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

const position = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, Geometry3d.positionName);
const color = new GLSLParameter(GLSLParameter.qualifier.attribute, GLSLParameter.type.vec4, Geometry3d.colorName);
const vColor = new GLSLParameter(GLSLParameter.qualifier.varying, GLSLParameter.type.vec4, 'v_' + Geometry3d.colorName);

const vertexShader = new GLSLShader(GLSLShader.type.vertexShader, [
    position,
    color,
    vColor
], [
    'void main(){',
    `${vColor} = ${color};`,
    `gl_PointSize = 15.0;`,
    `gl_Position = ${position};`,
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

const geometry = new Geometry3d();
geometry.index = [0, 1, 2];
geometry.position = [
    -.5, -0.5, 0,
    0, 0.5, 0,
    0.5, -0.5, 0];
geometry.color = [
    1, 0, 0, 1,
    0, 1, 0, 1,
    0, 0, 1, 1];

const render = new Render();
render.primitive = Render.primitive.triangles;
render.material = material;
render.index = new Buffer(
    new Uint8Array([0, 1, 2])
);
render.parameters[position] = geometry.position;
render.parameters[color] = geometry.color;
render.count = 3;
renderer.render(render);
console.log(renderer.childrens);