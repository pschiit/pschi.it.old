import PerspectiveCamera from './libs/3d/camera/PerspectiveCamera';
import DirectionalLight from './libs/3d/light/DirectionalLight';
import PointLight from './libs/3d/light/PointLight';
import Node3d from './libs/3d/Node3d';
import Color from './libs/core/Color';
import HtmlNode from './libs/html/HtmlNode';
import WebGLCanvas from './libs/html/WebGLCanvas';
import PhongMaterial from './libs/material/PhongMaterial';
import BoxGeometry from './libs/math/geometry/BoxGeometry';
import PlaneGeometry from './libs/math/geometry/PlaneGeometry';
import Vector3 from './libs/math/Vector3';

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

const world = new Node3d();

const redLight = new PointLight(
    new Color(1, 0, 0, 1),
    new Vector3(5, 3, -5));
redLight.addRender(material, new BoxGeometry(1, 1, 1, redLight.color));
redLight.childrens[0].parameters['vertexNormal'].data = new Float32Array([
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
]);
redLight.intensity = 1;
world.appendChild(redLight);

const greenLight = new PointLight(
    new Color(0, 1, 0, 1),
    new Vector3(-5, 3, -5));
greenLight.addRender(material, new BoxGeometry(1, 1, 1, greenLight.color));
greenLight.childrens[0].parameters['vertexNormal'].data = new Float32Array([
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
]);
greenLight.intensity = 1;
world.appendChild(greenLight);

const blueLight = new PointLight(
    new Color(0, 0, 1, 1),
    new Vector3(-5, 3, 5));
blueLight.addRender(material, new BoxGeometry(1, 1, 1, blueLight.color));
blueLight.childrens[0].parameters['vertexNormal'].data = new Float32Array([
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
]);
blueLight.intensity = 1;
world.appendChild(blueLight);

const cube = new Node3d();
cube.translate(0, 1, 0);
cube.addRender(material, new BoxGeometry(1, 1, 1, new Color(0.3, 0.2, 0.5, 1)));
world.appendChild(cube);

const plane = new Node3d();
plane.rotate(Math.PI / 2, 1, 0, 0);
plane.addRender(material, new PlaneGeometry(10, 10, new Color(1, 1, 1, 1)));
world.appendChild(plane);


const camera = new PerspectiveCamera(70, canvas.aspectRatio, 0.1, 100);
//const camera = new OrthographicCamera(-5,5,-5,5,-50,50);
camera.translate(5, 5, 5);
camera.lookAt(plane);
camera.updateProjection();
camera.background = new Color(0.1, 0.1, 0.1, 1);
camera.fog = [0, 1000];
world.appendChild(camera);

function draw() {
    camera.translate(0.1, 0, 0);
    camera.lookAt(camera.target);
    camera.updateProjection();
    canvas.render(camera);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);