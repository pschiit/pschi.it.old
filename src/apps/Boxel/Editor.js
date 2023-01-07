import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Buffer from '../../libs/core/Buffer';
import Color from '../../libs/core/Color';
import Vector2 from '../../libs/math/Vector2';
import Vector3 from '../../libs/math/Vector3';
import Boxel from './node/Boxel';
import BoxelGrid from './node/BoxelGrid';
import BoxelSprite from './node/BoxelSprite';

export default class Editor extends App {
    constructor(canvas) {
        super(canvas);
    }

    init() {
        this.canvas.renderTarget.backgroundColor = Color.white();
        const scale = this.canvas.renderTarget.height / 2;

        const mainBuffer = new Buffer();
        const mainInstanceBuffer = new Buffer();
        const mainIndexBuffer = new Buffer();

        const world = new Node3d();

        const orbit = new Node3d();
        world.appendChild(orbit);

        this.camera = new OrthographicCamera(-scale, scale, -scale, scale, 1, 2000);
        //this.camera = new PerspectiveCamera(70,1,0.1,2000)
        this.camera.zoom = scale / 6;
        this.camera.translate(100, 100, -100);
        this.camera.target = orbit;
        orbit.appendChild(this.camera);


        const grid = new BoxelGrid();
        world.appendChild(grid);
        mainBuffer.appendChild(grid.vertexBuffer.arrayBuffer);
        mainIndexBuffer.appendChild(grid.vertexBuffer.index);

        this.sprite = new BoxelSprite();
        world.appendChild(this.sprite);
        mainBuffer.appendChild(this.sprite.vertexBuffer.arrayBuffer);
        mainIndexBuffer.appendChild(this.sprite.vertexBuffer.index);
        mainInstanceBuffer.appendChild(this.sprite.vertexBuffer.instanceArrayBuffer);

        const zoomStep = 0.5;
        const rotationStep = 1;
        const orbitStep = 0.1;
        const cameraMovement = new Vector2();
        const orbitMovement = new Vector2();
        let clicked = -1;
        let zoom = 0;
        this.canvas.addEventListener('pointerdown', e => {
            if (e.pointerType == 'mouse') {
                clicked = e.button;
            }
            this.canvas.setPointerCapture(e.pointerId);
            updateMovement(e);
            if (e.button != 0) {
                const ray = this.camera.raycast(this.canvas.getNormalizedPointerPosition(e));
                let boxelPosition = this.sprite.intersect(ray);
                if (boxelPosition) {
                    const boxel = this.sprite.get(boxelPosition.floor());
                    console.log(boxel?.intersect(ray))
                    boxelPosition = boxel?.intersect(ray).floor();
                }
                if (!boxelPosition) {
                    boxelPosition = grid.intersect(ray).floor();
                }
                if (boxelPosition) {
                    const boxel = new Boxel(boxelPosition, Color.random());
                    this.sprite.set(boxel);
                }
            }

        });
        this.canvas.addEventListener('wheel', e => {
            zoom -= zoomStep * Math.sign(e.deltaY);
        });
        this.canvas.addEventListener('pointerup', e => {
            this.canvas.releasePointerCapture(e.pointerId);
            clicked = -1;
        });
        this.canvas.addEventListener('pointermove', updateMovement.bind(this));

        function updateMovement(e) {
            if (clicked == 0) {
                cameraMovement[0] -= rotationStep * e.movementX;
                cameraMovement[1] += rotationStep * e.movementY;
            } else if (clicked == 2) {
                orbitMovement[0] -= orbitStep * e.movementX;
                orbitMovement[1] += orbitStep * e.movementY;
            }
        }
        this.updateCamera = () => {
            const scale = this.canvas.renderTarget.height * 0.5;
            if(this.camera.top != scale){
                this.camera.top = scale;
            }
            if (zoom) {
                this.camera.zoom += zoom;
                zoom = 0;
            }
            if (this.camera.zoom > scale) {
                this.camera.zoom = scale;
            }
            grid.fading = scale / this.camera.zoom * 5;
            console.log(grid.fading);
            let v = new Vector3();
            if (cameraMovement[0]) {
                v.add(this.camera.xAxis.scale(cameraMovement[0]));
            }
            if (cameraMovement[1]) {
                v.add(this.camera.yAxis.scale(cameraMovement[1]));
            }
            if (v[0] || v[2]) {
                this.camera.translate(v);
                cameraMovement.scale(0);
            }

            let translation = new Vector3();
            if (orbitMovement[0]) {
                translation.add(this.camera.xAxis.scale(orbitMovement[0] / this.camera.zoom));
            }
            if (orbitMovement[1]) {
                translation.add(this.camera.yAxis.scale(orbitMovement[1] / this.camera.zoom));
            }
            if (translation[0] || translation[2]) {
                orbit.translate(translation);
                orbitMovement.scale(0);
            }
        }
    }

    run() {
        if (!this.camera) {
            this.init();
        }
        this.updateCamera();
        this.canvas.render(this.camera);
    }
}