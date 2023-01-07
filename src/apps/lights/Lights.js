import BoxBuffer from '../../libs/3d/buffer/BoxBuffer';
import PlaneBuffer from '../../libs/3d/buffer/PlaneBuffer';
import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import PerspectiveCamera from '../../libs/3d/camera/PerspectiveCamera';
import DirectionalLight from '../../libs/3d/light/DirectionalLight';
import PointLight from '../../libs/3d/light/PointLight';
import SpotLight from '../../libs/3d/light/SpotLight';
import LightMaterial from '../../libs/3d/material/LightMaterial';
import PickingMaterial from '../../libs/3d/material/PickingMaterial';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Buffer from '../../libs/core/Buffer';
import Color from '../../libs/core/Color';
import Angle from '../../libs/math/Angle';
import Matrix4 from '../../libs/math/Matrix4';
import Quaternion from '../../libs/math/Quaternion';
import Vector3 from '../../libs/math/Vector3';
import Vector4 from '../../libs/math/Vector4';
import RenderTarget from '../../libs/renderer/graphics/RenderTarget';
import Texture from '../../libs/renderer/graphics/Texture';

export default class Lights extends App {
    constructor(canvas) {
        super(canvas);
        this.width = 0;
        this.height = 0;
    }

    init() {
        const lightMaterial = new LightMaterial();

        const mainBuffer = new Buffer();
        const mainIndexBuffer = new Buffer();

        const cube = new BoxBuffer();
        cube.setColor(Color.white());
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
        reverseCube.setColor(Color.white());
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
        plane.setColor(Color.white());
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

        this.sun = new DirectionalLight(
            Color.grey(),
            new Vector3(10, 20, 10),
            new Vector3(0, 0, 0));
        floor.appendChild(this.sun);
        this.sun.light.toggle();
        this.rotatingBox.addEventListener('click', (e) => {
            this.sun.light.toggle();
        });

        const redLight = new PointLight(
            Color.red(),
            new Vector3(5, 3, -5));
        redLight.material = lightMaterial;
        redLight.vertexBuffer = reverseCube;
        floor.appendChild(redLight);
        redLight.addEventListener('click', (e) => {
            redLight.light.toggle();
        });

        const greenLight = new PointLight(
            Color.green(),
            new Vector3(-5, 3, -5));
        greenLight.material = lightMaterial;
        greenLight.vertexBuffer = reverseCube;
        floor.appendChild(greenLight);
        greenLight.addEventListener('click', (e) => {
            greenLight.light.toggle();
        });

        const blueLight = new PointLight(
            Color.blue(),
            new Vector3(-5, 3, 5));
        blueLight.material = lightMaterial;
        blueLight.vertexBuffer = reverseCube;
        floor.appendChild(blueLight);
        blueLight.addEventListener('click', (e) => {
            blueLight.light.toggle();
        });

        this.spotLight = new SpotLight(
            Color.magenta(),
            Math.cos(Angle.toRadian(40)),
            new Vector3(-3, 3, -3),
            new Vector3(0, 0, 0));
        this.spotLight.innerRadius = Math.cos(Angle.toRadian(30));
        this.spotLight.material = lightMaterial;
        this.spotLight.vertexBuffer = reverseCube;
        this.spotLight.light.intensity = 5;
        floor.appendChild(this.spotLight);
        this.spotLight.addEventListener('click', (e) => {
            this.spotLight.light.toggle();
        });

        const pickingMaterial = new PickingMaterial();
        const pickingTexture = new Texture();

        this.cameraLeft = new PerspectiveCamera(55, 1, 0.1, 2000);
        this.cameraLeft.translate(7, 5, 7);
        this.cameraLeft.lookAt(new Vector3(0, 0, 0));
        this.cameraLeft.frustum = new Node3d();
        world.appendChild(this.cameraLeft);

        this.cameraRight = new OrthographicCamera(-4, 4, -4, 8, 0.1, 100);
        this.cameraRight.translate(-7, 5, -7);
        this.cameraRight.target = new Vector3(0, 0, 0);
        const cameraHolder = new Node3d();
        cameraHolder.appendChild(this.cameraRight);
        world.appendChild(cameraHolder);

        this.sun.shadow = new RenderTarget(null, 2048, 2048);
        this.spotLight.shadow = new RenderTarget(null, 2048, 2048);

        const renderTarget = this.canvas.renderTarget;
        renderTarget.data = [this.cameraLeft, this.cameraRight];
        this.renders = [
            this.sun.shadow,
            this.spotLight.shadow,
            renderTarget
        ];

        this.rotatingBox.castShadow = true;

        this.canvas.addEventListener('pointerdown', e => {
            const mousePosition = this.canvas.getPointerPosition(e);

            const renderTarget = this.canvas.renderTarget;
            this.updateCameras(renderTarget);

            renderTarget.read = new Vector4(mousePosition[0], mousePosition[1], 1, 1);
            renderTarget.material = pickingMaterial;
            renderTarget.colorTexture = pickingTexture;
            const x = mousePosition[0];
            const camera = x < this.cameraLeft.viewport[2] ? this.cameraLeft : this.cameraRight;

            this.canvas.render(camera);
            const color = new Color(renderTarget.output).normalize();
            world.dispatchCallback((node) => {
                if (node.colorId.equals(color)) {
                    node.dispatchEvent({ type: 'click' });
                }
            });
            renderTarget.read = null;
            renderTarget.material = null;
            renderTarget.colorTexture = null;
            renderTarget.data = [this.cameraLeft, this.cameraRight];
        });

        this.cameraLeftMovement = new Vector4();
        this.canvas.addEventListener('keydown', e => {
            const step = 1;
            switch (e.code) {
                case 'a':
                case 'KeyA':
                case 'ArrowLeft':
                    this.cameraLeftMovement[1] += step;
                    break;
                case 'd':
                case 'KeyD':
                case 'ArrowRight':
                    this.cameraLeftMovement[1] -= step;
                    break;
                case 'w':
                case 'KeyW':
                case 'ArrowUp':
                    this.cameraLeftMovement[3] -= step;
                    break;
                case 's':
                case 'KeyS':
                case 'ArrowDown':
                    this.cameraLeftMovement[3] += step;
                    break;
                case 'ControlLeft':
                    this.cameraLeftMovement[0] += step;
                    break;
                case 'Space':
                    this.cameraLeftMovement[0] -= step;
                    break;
                case 'q':
                case 'KeyQ':
                    this.cameraLeftMovement[2] += step;
                    break;
                case 'e':
                case 'KeyE':
                    this.cameraLeftMovement[2] -= step;
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
        this.updateCameras(this.canvas.renderTarget);
        this.rotatingBox.rotate(Angle.toRadian(45), Angle.toRadian(45), Angle.toRadian(45));

        this.renders.forEach(r => this.canvas.render(r));
    }

    updateCameras(renderTarget) {
        if (this.width != renderTarget.width
            || this.height != renderTarget.height) {
            this.width = renderTarget.width;
            this.height = renderTarget.height;
            this.cameraLeft.viewport = new Vector4(0, 0, this.width / 2, this.height);
            this.cameraRight.viewport = new Vector4(this.width / 2, 0, this.width / 2, this.height);
        }
        this.cameraRight.parent.rotate(0, Angle.toRadian(45), 0);
        if (this.cameraLeftMovement[3]) {
            this.cameraLeft.translate(0, 0, this.cameraLeftMovement[3]);
            this.cameraLeftMovement[3] = 0;
        }
        if (this.cameraLeftMovement[0] != 0
            || this.cameraLeftMovement[1] != 0
            || this.cameraLeftMovement[2] != 0) {
            this.cameraLeft.rotate(this.cameraLeftMovement.toVector3());
            this.cameraLeftMovement.set([0, 0, 0]);
        }
    }
}