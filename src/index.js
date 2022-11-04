import { HtmlNode } from './libs/html/HtmlNode';
import { WebGLCanvas } from './libs/html/WebGLCanvas';

const defaultStyle = {
    width: '100%',
    height: '100%',
    margin: 0,
};
HtmlNode.document.style = defaultStyle;
const body = HtmlNode.body;
body.style = defaultStyle;

const canvas = new WebGLCanvas();
canvas.style =defaultStyle;
body.appendChild(canvas);

const gl = canvas.context;
gl.clearColor(0,0,0,1);
gl.clear(gl.COLOR_BUFFER_BIT);

const type = 'DIV';
const parent = new HtmlNode(type);
const child = new HtmlNode(type);
parent.appendChild(child);
console.log(parent.element)
console.log(child.element)
