import BoxBuffer from '../../libs/3d/buffer/BoxBuffer';
import PlaneBuffer from '../../libs/3d/buffer/PlaneBuffer';
import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import ColorMaterial from '../../libs/3d/material/ColorMaterial';
import GridMaterial from '../../libs/3d/material/GridMaterial';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Angle from '../../libs/math/Angle';
import Vector3 from '../../libs/math/Vector3';

export default class Boxel extends App {
    constructor(graphicRenderer, eventInterface) {
        super(graphicRenderer, eventInterface);
        this.movementX = 0;
        this.movementY = 0;
        this.step = 0.1;
    }

    init() {
        const scale = 10;
        this.orbit = new Node3d();
        this.camera = new OrthographicCamera(-scale, scale, -scale, scale, -10, 1000);
        this.camera.translate(-5, 5, -5);
        this.camera.target = new Vector3(0, 0, 0);
        this.orbit.appendChild(this.camera);

        const world = new Node3d();
        world.appendChild(this.orbit);

        const grid = new Node3d();
        grid.translate(0.5, 0.5, 0.5);
        grid.material = new GridMaterial();
        grid.vertexBuffer = new PlaneBuffer();
        world.appendChild(grid);

        const box = new Node3d();
        box.material = new ColorMaterial();
        box.vertexBuffer = new BoxBuffer(1, 1, 1, BoxBuffer.rainbowColor);
        box.translate(0, 1, 0);
        world.appendChild(box);


        this.addEventListener('pointerdown', e => {
            this.clicked = true;
            this.graphicsRenderer.parent.setPointerCapture(e.pointerId);
            this.updateMovement(e);
        });
        this.addEventListener('pointerup', e => {
            this.graphicsRenderer.parent.releasePointerCapture(e.pointerId);
            this.movementX = 0;
            this.movementY = 0;
            this.clicked = false;
        });
        this.addEventListener('pointermove', this.updateMovement.bind(this));

        this.addEventListener('wheel', e => {
            this.camera.zoom += e.wheelDeltaY * 0.001
        });
    }

    updateMovement(e) {
        if (this.clicked) {
            this.movementX += e.movementX * this.step;
            this.movementY += e.movementY * this.step;
        }
    }

    run() {
        if (!this.camera) {
            this.init();
        }
        this.orbit.rotate(0.005, 0, 1, 0);
        this.camera.projectionUpdated = true;
        this.graphicsRenderer.render(this.camera);
    }
}