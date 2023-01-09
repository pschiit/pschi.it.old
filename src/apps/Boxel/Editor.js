import VertexBufferManager from '../../libs/3d/buffer/VertexBufferManager';
import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import PerspectiveCamera from '../../libs/3d/camera/PerspectiveCamera';
import ColorMaterial from '../../libs/3d/material/ColorMaterial';
import Grid from '../../libs/3d/node/Grid';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Buffer from '../../libs/core/Buffer';
import Color from '../../libs/core/Color';
import Vector2 from '../../libs/math/Vector2';
import Vector3 from '../../libs/math/Vector3';
import Render from '../../libs/renderer/graphics/Render';
import VertexBuffer from '../../libs/renderer/graphics/VertexBuffer';
import Boxel from './node/Boxel';
import BoxelSprite from './node/BoxelSprite';

export default class Editor extends App {
    constructor(canvas) {
        super(canvas);
    }

    init() {
        this.canvas.renderTarget.backgroundColor = Color.white();
        const scale = this.canvas.renderTarget.height / 2;

        const bufferManager = new VertexBufferManager();

        const world = new Node3d();

        const orbit = new Node3d();
        orbit.translate(1, 1, 1);
        world.appendChild(orbit);

        this.camera = new OrthographicCamera(-scale, scale, -scale, scale, 1, 2000);
        //this.camera = new PerspectiveCamera(55, 1, 0.1, 2000)
        this.camera.zoom = scale / 6;
        this.camera.translate(scale, scale, -scale);
        this.camera.target = orbit;
        orbit.appendChild(this.camera);


        const grid = new Grid(this.camera);
        grid.material.sizes = new Vector2(1, 10);
        world.appendChild(grid);
        bufferManager.add(grid.vertexBuffer);

        this.sprite = new BoxelSprite();
        world.appendChild(this.sprite);
        bufferManager.add(this.sprite.vertexBuffer);

        const zoomStep = 1;
        const cameraStep = 1;
        const orbitStep = 1;
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
                const ray = this.camera.raycast(this.canvas.getNormalizedPointerPosition(e).toVector3());
                const result = this.sprite.setFromRay(ray);
                if (ray.intersections.length > 0) {
                    world.appendChild(toNode3d(ray, this.camera.far));
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
                cameraMovement[0] -= cameraStep * e.movementX;
                cameraMovement[1] += cameraStep * e.movementY;
            } else if (clicked == 2) {
                orbitMovement[0] -= orbitStep * e.movementX;
                orbitMovement[1] += orbitStep * e.movementY;
            }
        }
        this.updateCamera = () => {
            const scale = this.canvas.renderTarget.height * 0.5;
            if (this.camera.top != scale) {
                this.camera.top = scale;
            }
            if (zoom) {
                this.camera.zoom += zoom;
                zoom = 0;
            }
            if (this.camera.zoom > scale) {
                this.camera.zoom = scale;
            }
            grid.fading = scale / this.camera.zoom * 4;
            let cameraTranslation = new Vector3();
            if (cameraMovement[0]) {
                cameraTranslation.add(this.camera.xAxis.scale(cameraMovement[0]));
            }
            if (cameraMovement[1]) {
                cameraTranslation.add(this.camera.yAxis.scale(cameraMovement[1]));
            }
            if (cameraTranslation[0] || cameraTranslation[2]) {
                this.camera.translate(cameraTranslation);
                cameraMovement.scale(0);
            }

            let orbitTranslation = new Vector3();
            if (orbitMovement[0]) {
                orbitTranslation.add(this.camera.xAxis.scale(orbitMovement[0] / this.camera.zoom));
            }
            if (orbitMovement[1]) {
                orbitTranslation.add(this.camera.yAxis.scale(orbitMovement[1] / this.camera.zoom));
            }
            if (orbitTranslation[0] || orbitTranslation[2]) {
                orbit.translate(orbitTranslation);
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


function toNode3d(ray, far) {
    const position = [ray.origin[0], ray.origin[1], ray.origin[2]];
    const color = [1, 0, 0, 1];
    let ii = 0
    const index = [ii++];
    ray.intersections.forEach(i => {
        position.push(i[0]);
        position.push(i[1]);
        position.push(i[2]);
        color.push(Math.random());
        color.push(Math.random());
        color.push(Math.random());
        color.push(1);
        index.push(ii++)

        position.push(i[0]);
        position.push(i[1] - 1);
        position.push(i[2]);
        color.push(Math.random());
        color.push(Math.random());
        color.push(Math.random());
        color.push(1);
        index.push(ii++)
        position.push(i[0]);
        position.push(i[1]);
        position.push(i[2]);
        color.push(Math.random());
        color.push(Math.random());
        color.push(Math.random());
        color.push(1);
        index.push(ii++)
    });
    // const end = ray.direction.scale(far);
    // position.push(end[0]);
    // position.push(end[1]);
    // position.push(end[2]);
    // color.push(0);
    // color.push(0);
    // color.push(1);
    // color.push(1);
    // index.push(ii++)
    const vertexBuffer = new VertexBuffer();
    vertexBuffer.primitive = Render.primitive.lineStrip;
    vertexBuffer.index = index;
    vertexBuffer.position = position;
    vertexBuffer.color = color;

    return new Node3d(ColorMaterial.default, vertexBuffer);
}