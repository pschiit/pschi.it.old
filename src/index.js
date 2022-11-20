import { PerspectiveCamera } from './libs/3d/camera/PerspectiveCamera';
import { Fog } from './libs/3d/Fog';
import { DirectionalLight } from './libs/3d/light/DirectionalLight';
import { Node3d } from './libs/3d/Node3d';
import { Color } from './libs/core/Color';
import { HtmlNode } from './libs/html/HtmlNode';
import { WebGLCanvas } from './libs/html/WebGLCanvas';
import { LambertMaterial } from './libs/material/LambertMaterial';
import { PhongMaterial } from './libs/material/PhongMaterial';
import { Angle } from './libs/math/Angle';
import { BoxGeometry } from './libs/math/geometry/BoxGeometry';
import { GeometryBuffer } from './libs/math/geometry/GeometryBuffer';
import { Vector3 } from './libs/math/Vector3';

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

const boxGeometry = new BoxGeometry();

const world = new Node3d();

const camera = new PerspectiveCamera(55, canvas.aspectRatio, 0.1, 100);
camera.ambientLight = new Color(0.5, 0.5, 0.5, 1);
camera.background = new Color(0.1, 0.1, 0.1, 1);
camera.fog = new Fog(0, 10, camera.background);
camera.rotate(Angle.toRadian(180), 0, 1, 0);
camera.translate(0, 0, 5);
camera.updateProjection();
world.appendChild(camera);

const directionalLight = new DirectionalLight(
    new Color(0.5, 0.5, 0.5, 1),
    new Vector3(10, -20, 10)
);
world.appendChild(directionalLight);

var cubes = [];
for (let i = 0; i < 1000; i++) {
    const cube = new Node3d();
    cubes.push(cube);
    cube.addRender(material, boxGeometry);
    cube.translate((Math.random() * 2 - 1) * 10, (Math.random() * 2 - 1) * 10, (Math.random() * 2 - 1) * 10);
    world.appendChild(cube);
}


function draw() {
    cubes.forEach(c => {
        c.rotate(Angle.toRadian(1), 1, 1, 1);
    });
    canvas.render(camera);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);