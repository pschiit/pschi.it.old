import BoxBuffer from './libs/3d/buffer/BoxBuffer';
import ColorMaterial from './libs/3d/material/ColorMaterial';
import Node3d from './libs/3d/Node3d';
import Color from './libs/core/Color';
import HtmlNode from './libs/html/HtmlNode';
import WebGLCanvas from './libs/html/WebGLCanvas';
import Buffer from './libs/core/Buffer';

const defaultStyle = {
    width: '100%',
    height: '100%',
    margin: 0,
    background: '#000000'
};
HtmlNode.document.style = defaultStyle;
const body = HtmlNode.body;
body.style = defaultStyle;

const canvas = new WebGLCanvas();
body.appendChild(canvas);
canvas.style = defaultStyle;
canvas.fitParent();

const cube = new BoxBuffer();
cube.setColor(new Color(122, 92, 27));
console.log(cube);

const mainBuffer = new Buffer();
cube.buffers.forEach(b => {
    if (b instanceof Buffer) {
        mainBuffer.appendChild(b)
    }
})

const node = new Node3d();
node.vertexBuffer = cube;
node.material = new ColorMaterial();


let request = requestAnimationFrame(draw);
function draw(time) {
    node.rotate(0.01, 1, 1, 1);

    canvas.render(node);
    request = requestAnimationFrame(draw);
}
console.log(canvas.context)