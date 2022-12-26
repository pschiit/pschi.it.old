import BoxBuffer from './libs/3d/buffer/BoxBuffer';
import PlaneBuffer from './libs/3d/buffer/PlaneBuffer';
import PerspectiveCamera from './libs/3d/camera/PerspectiveCamera';
import DirectionalLight from './libs/3d/light/DirectionalLight';
import PointLight from './libs/3d/light/PointLight';
import SpotLight from './libs/3d/light/SpotLight';
import LightMaterial from './libs/3d/material/LightMaterial';
import PickingMaterial from './libs/3d/material/PickingMaterial';
import Node3d from './libs/3d/Node3d';
import Buffer from './libs/core/Buffer';
import Color from './libs/core/Color';
import HtmlNode from './libs/html/HtmlNode';
import WebGLCanvas from './libs/html/WebGLCanvas';
import Angle from './libs/math/Angle';
import Matrix4 from './libs/math/Matrix4';
import Vector3 from './libs/math/Vector3';
import Vector4 from './libs/math/Vector4';
import RenderTarget from './libs/renderer/graphics/RenderTarget';
import Texture from './libs/renderer/graphics/Texture';

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
reverseCube.normal.scale(-1);
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
plane.setColor(Color.white);
plane.transform(Matrix4.identityMatrix().rotate(Math.PI / 2, new Vector3(1, 0, 0)));
plane.uv = [
    0, 0,
    0, 1,
    1, 1,
    1, 0,
];

const mainBuffer = new Buffer();
const mainIndexBuffer = new Buffer();
mainBuffer.appendChild(cube.arrayBuffer);
mainIndexBuffer.appendChild(cube.index);
mainBuffer.appendChild(reverseCube.arrayBuffer);
mainIndexBuffer.appendChild(reverseCube.index);
mainBuffer.appendChild(plane.arrayBuffer);
mainIndexBuffer.appendChild(plane.index);

const world = new Node3d();

const camera = new PerspectiveCamera(70, canvas.aspectRatio, 0.1, 100);
camera.translate(7, 5, 7);
camera.target = new Vector3(0, 0, 0);
world.appendChild(camera);

const pickingMaterial = new PickingMaterial();
const textureMaterial = new LightMaterial();
textureMaterial.texture = new Texture(new RenderTarget(camera, 1024, 1024));
const floor = new Node3d();
floor.material = textureMaterial;
floor.vertexBuffer = plane;
world.appendChild(floor);

const element = new Node3d();
element.material = textureMaterial;
element.translate(0, 1, 0);
element.vertexBuffer = cube;
floor.appendChild(element);

const redLight = new PointLight(
    Color.red,
    new Vector3(5, 3, -5));
redLight.material = textureMaterial;
redLight.vertexBuffer = reverseCube;
floor.appendChild(redLight);

const greenLight = new PointLight(
    Color.green,
    new Vector3(-5, 3, -5));
greenLight.material = textureMaterial;
greenLight.vertexBuffer = reverseCube;
floor.appendChild(greenLight);

const blueLight = new PointLight(
    Color.blue,
    new Vector3(-5, 3, 5));
blueLight.material = textureMaterial;
blueLight.vertexBuffer = reverseCube;
floor.appendChild(blueLight);

const whiteLight = new PointLight(
    Color.white,
    new Vector3(5, 3, 5));
whiteLight.material = textureMaterial;
whiteLight.vertexBuffer = reverseCube;
floor.appendChild(whiteLight);

const sun = new DirectionalLight(
    Color.white.scale(0.5),
    new Vector3(10, 20, 10),
    new Vector3(0, 0, 0));
floor.appendChild(sun);

const spotLight = new SpotLight(
    Color.magenta,
    Math.cos(Angle.toRadian(50)),
    new Vector3(-3, 2, -3),
    new Vector3(0, 0, 0));
spotLight.innerRadius = Math.cos(Angle.toRadian(40));
spotLight.material = textureMaterial;
spotLight.vertexBuffer = reverseCube;
floor.appendChild(spotLight);

element.addEventListener('onclick', (e) => {
    console.log('toggle sun');
    sun.toggle();
});
redLight.addEventListener('onclick', (e) => {
    console.log('toggle red');
    redLight.toggle();
});
greenLight.addEventListener('onclick', (e) => {
    console.log('toggle green');
    greenLight.toggle();
});
blueLight.addEventListener('onclick', (e) => {
    console.log('toggle blue');
    blueLight.toggle();
});
whiteLight.addEventListener('onclick', (e) => {
    console.log('toggle white');
    whiteLight.toggle();
});
spotLight.addEventListener('onclick', (e) => {
    console.log('toggle spot');
    spotLight.toggle();
});
let then = 0;

const renderTarget = canvas.renderTarget;

let request = requestAnimationFrame(draw);
function draw(time) {
    element.rotate(0.01, 1, 1, 1);
    floor.rotate(0.01, 0, 1, 0);

    canvas.render(textureMaterial.texture);
    canvas.render(camera);
    request = requestAnimationFrame(draw);
}

const pickingTexture = new Texture(renderTarget);
canvas.element.onpointerdown = (e) => {
    const mousePosition = canvas.getPointerPosition(e);

    renderTarget.read = new Vector4(mousePosition[0], mousePosition[1], 1, 1);
    renderTarget.material = pickingMaterial;

    canvas.render(pickingTexture);
    const color = new Color(renderTarget.output);
    const node = Node3d.search(color);
    if (node) {
        node.dispatchEvent({ type: 'onclick' });
    }
    renderTarget.read = null;
    renderTarget.material = null;
}

document.onkeydown = e => {
    const step = 0.1;
    switch (e.code) {
        case 'a':
        case 'KeyA':
        case 'ArrowLeft':
            camera.rotate(step * 0.1, 0, 1, 0);
            camera.projectionUpdated = true;
            break;
        case 'd':
        case 'KeyD':
        case 'ArrowRight':
            camera.rotate(step * 0.1, 0, -1, 0);
            camera.projectionUpdated = true;
            break;
        case 'w':
        case 'KeyW':
        case 'ArrowUp':
            camera.translate(0, 0, -step);
            camera.projectionUpdated = true;
            break;
        case 's':
        case 'KeyS':
        case 'ArrowDown':
            camera.translate(0, 0, step);
            camera.projectionUpdated = true;
            break;
        case 'ControlLeft':
            camera.rotate(step * 0.1, -1, 0, 0);
            camera.projectionUpdated = true;
            break;
        case 'Space':
            camera.rotate(step * 0.1, 1, 0, 0);
            camera.projectionUpdated = true;
            break;
        case 'q':
        case 'KeyQ':
            camera.rotate(step * 0.1, 0, 0, -1,);
            camera.projectionUpdated = true;
            break;
        case 'e':
        case 'KeyE':
            camera.rotate(step * 0.1, 0, 0, 1);
            camera.projectionUpdated = true;
            break;
        default:
            return;
    }
}