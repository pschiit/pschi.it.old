import PlaneBuffer from './libs/3d/buffer/PlaneBuffer';
import PerspectiveCamera from './libs/3d/camera/PerspectiveCamera';
import GridMaterial from './libs/3d/material/GridMaterial';
import PickingMaterial from './libs/3d/material/PickingMaterial';
import Color from './libs/core/Color';
import HtmlNode from './libs/html/HtmlNode';
import WebGLCanvas from './libs/html/WebGLCanvas';
import Matrix4 from './libs/math/Matrix4';
import Vector3 from './libs/math/Vector3';
import Node3d from './libs/3d/Node3d';

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

const world = new Node3d();

const camera = new PerspectiveCamera(70, canvas.aspectRatio, 0.1, 100);
camera.translate(7, 5, 7);
camera.target = new Vector3(0, 0, 0);
world.appendChild(camera);

const floor = new Node3d();
floor.material = new GridMaterial();
const plane = new PlaneBuffer(2,2);
plane.setColor(Color.red);
plane.normal = null;
plane.transform(Matrix4.identityMatrix().rotate(Math.PI / 2, new Vector3(1, 0, 0)));
floor.vertexBuffer = plane;
world.appendChild(floor);

let request = requestAnimationFrame(draw);
function draw(time) {
    floor.rotate(0.01, 0, 1, 0);
    canvas.render(camera);
    request = requestAnimationFrame(draw);
}