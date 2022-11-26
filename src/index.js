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
import Texture from './libs/3d/texture/Texture';
import OrthographicCamera from './libs/3d/camera/OrthographicCamera';

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
const plane = new PlaneBuffer(10, 10);

const world = new Node3d();
const sun = new DirectionalLight(new Color(1, 1, 1, 1), new Vector3(10, 20, 10), new Vector3(0, 0, 0));
world.appendChild(sun);

const textureMaterial = new PhongMaterial();
textureMaterial.texture = new Texture(world, 1024, 1024);

const floor = new Node3d();
floor.material = textureMaterial;
floor.vertexBuffer = plane;
floor.rotate(Math.PI / 2, 1, 0, 0);
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
redLight.setParameter(BoxBuffer.colorName, new Color(1, 0, 0, 1));
world.appendChild(redLight);

const greenLight = new PointLight(
    new Color(0, 1, 0, 1),
    new Vector3(-5, 3, -5));
greenLight.material = textureMaterial;
greenLight.vertexBuffer = cube;
greenLight.setParameter(BoxBuffer.colorName, new Color(0, 1, 0, 1));
world.appendChild(greenLight);

const blueLight = new PointLight(
    new Color(0, 0, 1, 1),
    new Vector3(-5, 3, 5));
blueLight.material = textureMaterial;
blueLight.vertexBuffer = cube;
blueLight.setParameter(BoxBuffer.colorName, new Color(0, 0, 1, 1));
world.appendChild(blueLight);

const whiteLight = new PointLight(
    new Color(1, 1, 1, 1),
    new Vector3(5, 3, 5));
whiteLight.material = textureMaterial;
whiteLight.vertexBuffer = cube;
whiteLight.setParameter(BoxBuffer.colorName, new Color(1, 1, 1, 1));
world.appendChild(whiteLight);

// redLight.on = false;
// greenLight.on = false;
// blueLight.on = false;
// whiteLight.on = false;
// sun.on = false;

const camera = new PerspectiveCamera(70, canvas.aspectRatio, 0.1, 100);
//const camera = new OrthographicCamera(-5,5,-5,5,-50,50);
camera.translate(5, 5, 5);
camera.lookAt(element);
camera.updateProjection();
world.appendChild(camera);

let then = 0;
function draw(time) {
    element.rotate(0.01, 1, 1, 1);
    camera.translate(0.1, 0, 0);
    camera.lookAt(camera.target);
    camera.updateProjection();
    canvas.render(world);
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);