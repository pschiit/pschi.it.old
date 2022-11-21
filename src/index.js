import OrthographicCamera from'./libs/3d/camera/OrthographicCamera';
import PerspectiveCamera from'./libs/3d/camera/PerspectiveCamera';
import Fog from'./libs/3d/Fog';
import DirectionalLight from'./libs/3d/light/DirectionalLight';
import PointLight from'./libs/3d/light/PointLight';
import Node3d from'./libs/3d/Node3d';
import Color from'./libs/core/Color';
import HtmlNode from'./libs/html/HtmlNode';
import WebGLCanvas from'./libs/html/WebGLCanvas';
import LambertMaterial from'./libs/material/LambertMaterial';
import PhongMaterial from'./libs/material/PhongMaterial';
import Angle from'./libs/math/Angle';
import BoxGeometry from'./libs/math/geometry/BoxGeometry';
import PlaneGeometry from'./libs/math/geometry/PlaneGeometry';
import Matrix4 from'./libs/math/Matrix4';
import Vector3 from'./libs/math/Vector3';

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

const material = new LambertMaterial();

const world = new Node3d();

const directionalLight = new DirectionalLight(
    new Color(0.5, 0.5, 0.5, 1),
    new Vector3(-2, 3, -2),
    new Vector3(0, 0, 0));
directionalLight.addRender(material, new BoxGeometry(1, 1, 1, new Color(1, 1, 1, 1)));
world.appendChild(directionalLight);


const pointLight = new PointLight(
    new Color(0.5, 0.5, 1, 1),
    new Vector3(-2, 3, 3));
pointLight.addRender(material, new BoxGeometry(1, 1, 1, new Color(1, 1, 0, 1)));
world.appendChild(pointLight);


const cube = new Node3d();
cube.translate(0, 1, 0);
cube.addRender(material, new BoxGeometry(1, 1, 1, new Color(1, 0, 0, 1)));
world.appendChild(cube);

const plane = new Node3d();
plane.rotate(Math.PI / 2, 1, 0, 0);
plane.addRender(material, new PlaneGeometry(10, 10, new Color(0, 1, 0, 1)));
world.appendChild(plane);


const camera = new PerspectiveCamera(70, canvas.aspectRatio, 0.1, 100);
//const camera = new OrthographicCamera(-10,10,-10,10,-10,10);
camera.translate(5, 5, 5);
camera.lookAt(plane);
camera.updateProjection();
camera.ambientLight = new Color(0.2, 0.2, 0.2, 1);
camera.background = new Color(0.1, 0.1, 0.1, 1);
camera.fog = new Fog(0, 1000, camera.background);
world.appendChild(camera);

function draw() {
    cube.rotate(0.01, 1, 1, 1);
    canvas.render(camera);
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);