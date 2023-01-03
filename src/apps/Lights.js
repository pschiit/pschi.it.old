import BoxBuffer from '../libs/3d/buffer/BoxBuffer';
import PlaneBuffer from '../libs/3d/buffer/PlaneBuffer';
import OrthographicCamera from '../libs/3d/camera/OrthographicCamera';
import PerspectiveCamera from '../libs/3d/camera/PerspectiveCamera';
import DirectionalLight from '../libs/3d/light/DirectionalLight';
import PointLight from '../libs/3d/light/PointLight';
import SpotLight from '../libs/3d/light/SpotLight';
import LightMaterial from '../libs/3d/material/LightMaterial';
import PickingMaterial from '../libs/3d/material/PickingMaterial';
import Node3d from '../libs/3d/Node3d';
import App from '../libs/core/App';
import Buffer from '../libs/core/Buffer';
import Color from '../libs/core/Color';
import Img from '../libs/html/Img';
import Angle from '../libs/math/Angle';
import Matrix4 from '../libs/math/Matrix4';
import Vector3 from '../libs/math/Vector3';
import Vector4 from '../libs/math/Vector4';
import RenderTarget from '../libs/renderer/graphics/RenderTarget';
import Texture from '../libs/renderer/graphics/Texture';

export default class Lights extends App {
    constructor(graphicRenderer, eventInterface) {
        super(graphicRenderer, eventInterface);
        this.width = 0;
        this.height = 0;
    }

    init() {
        const lightMaterial = new LightMaterial();

        const mainBuffer = new Buffer();
        const mainIndexBuffer = new Buffer();

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
        mainBuffer.appendChild(cube.arrayBuffer);
        mainIndexBuffer.appendChild(cube.index);

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
        mainBuffer.appendChild(reverseCube.arrayBuffer);
        mainIndexBuffer.appendChild(reverseCube.index);

        const plane = new PlaneBuffer(10, 10);
        plane.setColor(Color.white);
        plane.transform(Matrix4.identityMatrix().rotate(Math.PI / 2, new Vector3(1, 0, 0)));
        plane.uv = [
            0, 0,
            0, 1,
            1, 1,
            1, 0,
        ];
        mainBuffer.appendChild(plane.arrayBuffer);
        mainIndexBuffer.appendChild(plane.index);

        const world = new Node3d();

        const floor = new Node3d();
        floor.material = lightMaterial;
        floor.vertexBuffer = plane;
        world.appendChild(floor);

        this.rotatingBox = new Node3d();
        this.rotatingBox.material = lightMaterial;
        this.rotatingBox.translate(0, 2, 0);
        this.rotatingBox.vertexBuffer = cube;
        floor.appendChild(this.rotatingBox);

        const sun = new DirectionalLight(
            Color.white.scale(0.5),
            new Vector3(10, 20, 10),
            new Vector3(0, 0, 0));
        floor.appendChild(sun);
        this.rotatingBox.addEventListener('click', (e) => {
            console.log('toggle sun');
            sun.light.toggle();
        });

        const redLight = new PointLight(
            Color.red,
            new Vector3(5, 3, -5));
        redLight.material = lightMaterial;
        redLight.vertexBuffer = reverseCube;
        floor.appendChild(redLight);
        redLight.addEventListener('click', (e) => {
            console.log('toggle red');
            redLight.light.toggle();
        });

        const greenLight = new PointLight(
            Color.green,
            new Vector3(-5, 3, -5));
        greenLight.material = lightMaterial;
        greenLight.vertexBuffer = reverseCube;
        floor.appendChild(greenLight);
        greenLight.addEventListener('click', (e) => {
            console.log('toggle green');
            greenLight.light.toggle();
        });

        const blueLight = new PointLight(
            Color.blue,
            new Vector3(-5, 3, 5));
        blueLight.material = lightMaterial;
        blueLight.vertexBuffer = reverseCube;
        floor.appendChild(blueLight);
        blueLight.addEventListener('click', (e) => {
            console.log('toggle blue');
            blueLight.light.toggle();
        });

        const whiteLight = new PointLight(
            Color.white,
            new Vector3(5, 3, 5));
        whiteLight.material = lightMaterial;
        whiteLight.vertexBuffer = reverseCube;
        floor.appendChild(whiteLight);
        whiteLight.addEventListener('click', (e) => {
            console.log('toggle white');
            whiteLight.light.toggle();
        });


        const spotLight = new SpotLight(
            Color.magenta,
            Math.cos(Angle.toRadian(40)),
            new Vector3(-3, 3, -3),
            new Vector3(0, 0, 0));
        spotLight.innerRadius = Math.cos(Angle.toRadian(30));
        spotLight.material = lightMaterial;
        spotLight.vertexBuffer = reverseCube;
        floor.appendChild(spotLight);
        spotLight.addEventListener('click', (e) => {
            console.log('toggle spot');
            spotLight.light.toggle();
        });

        const pickingMaterial = new PickingMaterial();
        const pickingTexture = new Texture();

        const perspectiveCamera = new PerspectiveCamera(70, 1, 0.1, 100);
        perspectiveCamera.translate(7, 5, 7);
        perspectiveCamera.target = new Vector3(0, 0, 0);
        world.appendChild(perspectiveCamera);
        this.leftTarget = new RenderTarget(perspectiveCamera);


        const orthographicCamera = new OrthographicCamera(-4, 4, -4, 6, 0.1, 100);
        orthographicCamera.translate(-7, 5, -7);
        orthographicCamera.target = new Vector3(0, 0, 0);
        world.appendChild(orthographicCamera);
        this.rightTarget = new RenderTarget(orthographicCamera);


        this.sunRenderTarget = new RenderTarget(null, 1024, 1024);
        sun.shadow = this.sunRenderTarget;

        this.spotLightRenderTarget = new RenderTarget(null, 1024, 1024);
        spotLight.shadow = this.spotLightRenderTarget;


        this.renders = [
            this.sunRenderTarget,
            this.spotLightRenderTarget,
            this.leftTarget,
            this.rightTarget
        ];
        
        this.rotatingBox.castShadow = true;

        this.addEventListener('pointerdown', e => {
            const mousePosition = this.getPointerPosition(e);
            const renderTarget = this.leftTarget.isIn(mousePosition) ?
                this.leftTarget :
                this.rightTarget;

            renderTarget.read = new Vector4(mousePosition[0], mousePosition[1], 1, 1);
            renderTarget.material = pickingMaterial;
            renderTarget.colorTexture = pickingTexture;

            this.graphicsRenderer.render(renderTarget);
            const color = new Color(renderTarget.output);
            const node = Node3d.search(color.normalize());
            if (node) {
                node.dispatchEvent({ type: 'click' });
            }
            renderTarget.read = null;
            renderTarget.material = null;
            renderTarget.colorTexture = null;
        });

        this.addEventListener('keydown', e => {
            const step = 0.1;
            switch (e.code) {
                case 'a':
                case 'KeyA':
                case 'ArrowLeft':
                    perspectiveCamera.rotate(step * 0.1, 0, 1, 0);
                    perspectiveCamera.projectionUpdated = true;
                    orthographicCamera.projectionUpdated = true;
                    break;
                case 'd':
                case 'KeyD':
                case 'ArrowRight':
                    perspectiveCamera.rotate(step * 0.1, 0, -1, 0);
                    perspectiveCamera.projectionUpdated = true;
                    orthographicCamera.projectionUpdated = true;
                    break;
                case 'w':
                case 'KeyW':
                case 'ArrowUp':
                    perspectiveCamera.translate(0, 0, -step);
                    perspectiveCamera.projectionUpdated = true;
                    orthographicCamera.projectionUpdated = true;
                    break;
                case 's':
                case 'KeyS':
                case 'ArrowDown':
                    perspectiveCamera.translate(0, 0, step);
                    perspectiveCamera.projectionUpdated = true;
                    orthographicCamera.projectionUpdated = true;
                    break;
                case 'ControlLeft':
                    perspectiveCamera.rotate(step * 0.1, -1, 0, 0);
                    perspectiveCamera.projectionUpdated = true;
                    orthographicCamera.projectionUpdated = true;
                    break;
                case 'Space':
                    perspectiveCamera.rotate(step * 0.1, 1, 0, 0);
                    perspectiveCamera.projectionUpdated = true;
                    orthographicCamera.projectionUpdated = true;
                    break;
                case 'q':
                case 'KeyQ':
                    perspectiveCamera.rotate(step * 0.1, 0, 0, 1,);
                    perspectiveCamera.projectionUpdated = true;
                    orthographicCamera.projectionUpdated = true;
                    break;
                case 'e':
                case 'KeyE':
                    perspectiveCamera.rotate(step * 0.1, 0, 0, -1);
                    perspectiveCamera.projectionUpdated = true;
                    orthographicCamera.projectionUpdated = true;
                    break;
                default:
                    return;
            }
        });
    }

    run() {
        if (!this.renders) {
            this.init();
        }
        const renderTarget = this.renderTarget;
        if (this.width != renderTarget.width) {
            this.width = renderTarget.width;
            this.leftTarget.viewport = new Vector4(0, 0, this.width / 2, this.height);
            this.leftTarget.scissor = this.leftTarget.viewport;
            this.rightTarget.viewport = new Vector4(this.width / 2, 0, this.width / 2, this.height);
            this.rightTarget.scissor = this.rightTarget.viewport;
        }
        if (this.height != renderTarget.height) {
            this.height = renderTarget.height;
            this.leftTarget.height = this.height;
            this.rightTarget.height = this.height;
        }

        this.rotatingBox.rotate(0.01, 1, 1, 1);
        this.renders.forEach(r => this.graphicsRenderer.render(r));
    }
}