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
import SpotLight from './libs/3d/light/SpotLight';
import Angle from './libs/math/Angle';

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
cube.setColor(Color.white);
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
const reverseCube = new BoxBuffer();
reverseCube.reverseNormal();
reverseCube.setColor(Color.white);
reverseCube.uv = [
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
plane.transform(Matrix4.identityMatrix().rotate(Math.PI / 2, new Vector3(1, 0, 0)));
plane.setColor(Color.white);
plane.uv = [
    0, 0,
    0, 1,
    1, 1,
    1, 0,
];

const world = new Node3d();

const textureMaterial = new PhongMaterial();
//textureMaterial.texture = new Texture(world, 1024, 1024);

const floor = new Node3d();
floor.material = textureMaterial;
floor.vertexBuffer = plane;
world.appendChild(floor);

const element = new Node3d();
element.material = textureMaterial;
element.translate(0, 1, 0);
element.vertexBuffer = cube;
//world.appendChild(element);

const redLight = new PointLight(
    Color.red,
    new Vector3(5, 3, -5));
redLight.material = textureMaterial;
redLight.vertexBuffer = reverseCube;
world.appendChild(redLight);

const greenLight = new PointLight(
    Color.green,
    new Vector3(-5, 3, -5));
greenLight.material = textureMaterial;
greenLight.vertexBuffer = reverseCube;
world.appendChild(greenLight);

const blueLight = new PointLight(
    Color.blue,
    new Vector3(-5, 3, 5));
blueLight.material = textureMaterial;
blueLight.vertexBuffer = reverseCube;
world.appendChild(blueLight);

const whiteLight = new PointLight(
    Color.white,
    new Vector3(5, 3, 5));
whiteLight.material = textureMaterial;
whiteLight.vertexBuffer = reverseCube;
world.appendChild(whiteLight);

const sun = new DirectionalLight(
    Color.white.scale(0.2),
    new Vector3(10, 20, 10),
    new Vector3(0, 0, 0));
world.appendChild(sun);

const spotLight = new SpotLight(
    Color.magenta,
    Math.cos(Angle.toRadian(35)),
    new Vector3(3, 2, 3),
    new Vector3(0, 0, 0));
spotLight.innerRadius = Math.cos(Angle.toRadian(17.5));
spotLight.material = textureMaterial;
spotLight.vertexBuffer = new BoxBuffer();
spotLight.vertexBuffer.setColor(Color.white);
spotLight.vertexBuffer.normal = [
    0, 0, 1,//F
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    1, 0, 0,//R
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    0, 0, 1,//B
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    0, 1, 0,//U
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,

    -1, 0, 0,//L
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    0, -1, 0,//D
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
];
world.appendChild(spotLight);

// redLight.toggle();
// greenLight.toggle();
// blueLight.toggle();
// whiteLight.toggle();
// sun.toggle();
// spotLight.toggle();

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