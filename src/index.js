import PerspectiveCamera from './libs/3d/camera/PerspectiveCamera';
import DirectionalLight from './libs/3d/light/DirectionalLight';
import PointLight from './libs/3d/light/PointLight';
import Node3d from './libs/3d/Node3d';
import Color from './libs/core/Color';
import HtmlNode from './libs/html/HtmlNode';
import WebGLCanvas from './libs/html/WebGLCanvas';
import PhongMaterial from './libs/3d/material/PhongMaterial';
import BoxBuffer from './libs/3d/buffer/BoxBuffer';
import PlaneBuffer from './libs/3d/buffer/PlaneBuffer';
import Vector3 from './libs/math/Vector3';
import Buffer from './libs/core/Buffer';
import Texture from './libs/renderer/Texture';
import OrthographicCamera from './libs/3d/camera/OrthographicCamera';
import Matrix4 from './libs/math/Matrix4';

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

const cube = new BoxBuffer();
cube.uv = [
    0, 0, //F
    0, 1,
    1, 1,
    1, 0,

    0, 0,//R
    0, 1,
    1, 1,
    1, 0,

    0, 0,//B
    0, 1,
    1, 1,
    1, 0,

    0, 0,//U
    0, 1,
    1, 1,
    1, 0,

    0, 0,//L
    0, 1,
    1, 1,
    1, 0,

    0, 0,//D
    0, 1,
    1, 1,
    1, 0,
];
const plane = new PlaneBuffer(10, 10);
plane.position.transform(Matrix4.identityMatrix().rotate(Math.PI / 2, new Vector3(1, 0, 0)));
plane.uv = [
    0, 0,
    0, 1,
    1, 1,
    1, 0,
];

const world = new Node3d();
const sun = new DirectionalLight(new Color(1, 1, 1, 1), new Vector3(10, 20, 10), new Vector3(0, 0, 0));
world.appendChild(sun);

const textureMaterial = new PhongMaterial();
textureMaterial.texture = new Texture(world, 1024, 1024);

const floor = new Node3d();
floor.material = textureMaterial;
floor.vertexBuffer = plane;
world.appendChild(floor);

const element = new Node3d();
element.material = textureMaterial;
element.translate(0, 1, 0);
element.vertexBuffer = cube;
world.appendChild(element);

const redLight = new PointLight(
    new Color(1, 0, 0, 1),
    new Vector3(5, 3, -5));
redLight.material = textureMaterial;
redLight.vertexBuffer = cube;
world.appendChild(redLight);

const greenLight = new PointLight(
    new Color(0, 1, 0, 1),
    new Vector3(-5, 3, -5));
greenLight.material = textureMaterial;
greenLight.vertexBuffer = cube;
world.appendChild(greenLight);

const blueLight = new PointLight(
    new Color(0, 0, 1, 1),
    new Vector3(-5, 3, 5));
blueLight.material = textureMaterial;
blueLight.vertexBuffer = cube;
world.appendChild(blueLight);

const whiteLight = new PointLight(
    new Color(1, 1, 1, 1),
    new Vector3(5, 3, 5));
whiteLight.material = textureMaterial;
whiteLight.vertexBuffer = cube;
world.appendChild(whiteLight);

// redLight.toggle();
// greenLight.toggle();
// blueLight.toggle();
// whiteLight.toggle();
// sun.toggle();

const camera = new PerspectiveCamera(70, canvas.aspectRatio, 0.1, 100);
camera.translate(5, 5, 5);
camera.target = new Vector3(0,0,0);
camera.projectionUpdated = true;
world.appendChild(camera);
let then = 0;
function draw(time) {
    element.rotate(0.01, 1, 1, 1);
    camera.translate(0.1, 0, 0);
    camera.target = camera.target;
    camera.projectionUpdated = true;
    canvas.render(world);
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);