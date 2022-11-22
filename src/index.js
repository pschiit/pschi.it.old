import PerspectiveCamera from './libs/3d/camera/PerspectiveCamera';
import DirectionalLight from './libs/3d/light/DirectionalLight';
import PointLight from './libs/3d/light/PointLight';
import Node3d from './libs/3d/Node3d';
import Color from './libs/core/Color';
import HtmlNode from './libs/html/HtmlNode';
import WebGLCanvas from './libs/html/WebGLCanvas';
import PhongMaterial from './libs/material/PhongMaterial';
import BoxGeometry from './libs/3d/geometry/BoxGeometry';
import PlaneGeometry from './libs/3d/geometry/PlaneGeometry';
import Vector3 from './libs/math/Vector3';
import Buffer from './libs/core/Buffer';

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

const material = new PhongMaterial();
const cube = new BoxGeometry();
cube.setColor(new Color(1, 1, 1, 1));
const plane = new PlaneGeometry(10, 10, new Color(1, 1, 1, 1));
const lightNormalBuffer = new Buffer(new Float32Array([
    0, 0, 1,//F
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    -1, 0, 0,//R
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,

    0, 0, -1,//B
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,

    0, -1, 0,//U
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,

    1, 0, 0,//L
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    0, 1, 0,//D
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
]), 3);

const world = new Node3d();

const floor = new Node3d();
floor.material = material;
floor.setBuffer(plane);
floor.rotate(Math.PI / 2, 1, 0, 0);
world.appendChild(floor);

const element = new Node3d();
element.material = material;
element.translate(0, 1, 0);
element.setBuffer(cube);
world.appendChild(element);

const redLight = new PointLight(
    new Color(1, 0, 0, 1),
    new Vector3(5, 3, -5));
redLight.material = material;
redLight.setBuffer(cube);
redLight.setParameter(BoxGeometry.normalName, lightNormalBuffer);
world.appendChild(redLight);

const greenLight = new PointLight(
    new Color(0, 1, 0, 1),
    new Vector3(-5, 3, -5));
greenLight.material = material;
greenLight.setBuffer(cube);
greenLight.setParameter(BoxGeometry.normalName, lightNormalBuffer);
world.appendChild(greenLight);

const blueLight = new PointLight(
    new Color(0, 0, 1, 1),
    new Vector3(-5, 3, 5));
blueLight.material = material;
blueLight.setBuffer(cube);
blueLight.setParameter(BoxGeometry.normalName, lightNormalBuffer);
world.appendChild(blueLight);

const whiteLight = new PointLight(
    new Color(1, 1, 1, 1),
    new Vector3(5, 3, 5));
whiteLight.material = material;
whiteLight.setBuffer(cube);
whiteLight.setParameter(BoxGeometry.normalName, lightNormalBuffer);
world.appendChild(whiteLight);


const camera = new PerspectiveCamera(70, canvas.aspectRatio, 0.1, 100);
//const camera = new OrthographicCamera(-5,5,-5,5,-50,50);
camera.translate(5, 5, 5);
camera.lookAt(floor);
camera.updateProjection();
world.appendChild(camera);

function draw() {
    element.rotate(0.01, 1, 1, 1);
    camera.translate(0.1, 0, 0);
    camera.lookAt(camera.target);
    camera.updateProjection();
    canvas.render(world);
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);