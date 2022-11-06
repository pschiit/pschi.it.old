import { HtmlNode } from './libs/html/HtmlNode';
import { WebGLCanvas } from './libs/html/WebGLCanvas';
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

const renderer = canvas.context;
renderer.clearColor([0, 0, 0, 1]);

const program = WebGLRenderer.simpleProgram();
renderer.appendChild(program);
renderer.useProgram(program);

program.parameters.a_VertexPosition.set([0, 0, 0, 1]);
program.parameters.a_VertexColor.set([1, 0, 0, 1]);
program.parameters.u_PointSize.set(10);

renderer.clear();
renderer.drawArrays('POINTS', 0, 1);

