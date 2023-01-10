import VertexBufferManager from '../../libs/3d/buffer/VertexBufferManager';
import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import PerspectiveCamera from '../../libs/3d/camera/PerspectiveCamera';
import DirectionalLight from '../../libs/3d/light/DirectionalLight';
import Grid from '../../libs/3d/node/Grid';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Color from '../../libs/core/Color';
import Vector2 from '../../libs/math/Vector2';
import Vector3 from '../../libs/math/Vector3';
import RenderTarget from '../../libs/renderer/graphics/RenderTarget';
import Boxel from './node/Boxel';
import BoxelSprite from './node/BoxelSprite';

export default class Editor extends App {
    constructor(canvas) {
        super(canvas);
    }

    init() {
        const canvas = this.canvas;
        canvas.renderTarget.backgroundColor = Color.white();

        const bufferManager = new VertexBufferManager();

        const world = new Node3d();

        const sun = new DirectionalLight(
            Color.white(),
            new Vector3(10, 20, 10),
            new Vector3(0, 0, 0));
        world.appendChild(sun);

        const orbit = new Node3d();
        orbit.translate(0, 0, 0);
        world.appendChild(orbit);

        const sprite = new BoxelSprite();
        world.appendChild(sprite);
        bufferManager.add(sprite.vertexBuffer);
        sprite.castShadow = true;

        const scale = canvas.renderTarget.maxY * 0.5;
        const camera = new OrthographicCamera(-scale, scale, -scale, scale, 1, 2000);
        camera.translate(scale, scale, -scale);
        camera.zoom = scale / 6;
        camera.target = orbit;
        orbit.appendChild(camera);
        this.camera = camera;

        const grid = new Grid(camera);
        grid.material.sizes = new Vector2(1, 10);
        world.appendChild(grid);
        bufferManager.add(grid.vertexBuffer);
        grid.fading = scale / camera.zoom * 4;

        const zoomStep = 1;
        const cameraStep = 1;
        const orbitStep = 1;
        const cameraMovement = new Vector2();
        const orbitMovement = new Vector2();
        let zoom = 0;

        let clicked = -1;
        let touchInput = [];

        canvas.addEventListener('pointerdown', e => {
            canvas.setPointerCapture(e.pointerId);
            if (e.pointerType == 'touch') {
                touchInput.push(e);
                touchAdd(e);
            } else if (e.pointerType == 'mouse') {
                clicked = e.button;
            } else if (e.pointerType == 'pen') {
                clicked = 2;
            }
            updateMovement(e);
        });
        canvas.addEventListener('wheel', e => {
            zoom -= zoomStep * Math.sign(e.deltaY);
            console.log(zoom)
        });
        canvas.addEventListener('pointerup', e => {
            canvas.releasePointerCapture(e.pointerId);
            if (e.pointerType == 'mouse' || e.pointerType == 'pen') {
                clicked = -1;
            } else if (e.pointerType == 'touch') {
                touchInput.splice(touchInput.indexOf(e), 1);
                if (touchInput.length < 2) {
                    distance = 0;
                }
            }
        });
        canvas.addEventListener('pointermove', updateMovement.bind(this));

        let draw = true;
        let distance = 0;
        function updateMovement(e) {
            if (touchInput.length == 1 || clicked == 0) {
                cameraMovement[0] -= cameraStep * e.movementX;
                cameraMovement[1] += cameraStep * e.movementY;
            } else if (clicked == 2) {
                addBoxel(e);
                // orbitMovement[0] -= orbitStep * e.movementX;
                // orbitMovement[1] += orbitStep * e.movementY;
            } else if (touchInput.length > 1) {
                //pinch to zoom
            }
        }
        let then = 0;
        this.updateCamera = (time) => {
            const renderTarget = canvas.renderTarget
            const scale = renderTarget.maxY * 0.5;
            time *= 0.001
            if (time > then) {
                draw = true;
                then = time + 0.115;
            }
            let updateGrid = false;
            if (camera.top != scale) {
                camera.top = scale;
                camera.aspectRatio = renderTarget.aspectRatio;
                updateGrid = true;
            }
            if (zoom) {
                camera.zoom += zoom;
                zoom = 0;
                updateGrid = true;
            }
            if (updateGrid) {
                grid.fading = scale / camera.zoom * 4;
            }
            if (camera.zoom > scale) {
                camera.zoom = scale;
            }
            let cameraTranslation = new Vector3();
            if (cameraMovement[0]) {
                cameraTranslation.add(camera.xAxis.scale(cameraMovement[0]));
            }
            if (cameraMovement[1]) {
                cameraTranslation.add(camera.yAxis.scale(cameraMovement[1]));
            }
            if (cameraTranslation[0] || cameraTranslation[2]) {
                camera.translate(cameraTranslation);
                cameraMovement.scale(0);
            }

            let orbitTranslation = new Vector3();
            if (orbitMovement[0]) {
                orbitTranslation.add(camera.xAxis.scale(orbitMovement[0] / camera.zoom));
            }
            if (orbitMovement[1]) {
                orbitTranslation.add(camera.yAxis.scale(orbitMovement[1] / camera.zoom));
            }
            if (orbitTranslation[0] || orbitTranslation[2]) {
                orbit.translate(orbitTranslation);
                orbitMovement.scale(0);
            }
        }

        function addBoxel(e) {
            if (draw) {
                const ray = camera.raycast(canvas.getNormalizedPointerPosition(e).toVector3());
                const intersection = sprite.intersect(ray, true, true);
                if (intersection) {
                    draw = false;
                    return sprite.set(new Boxel(intersection.floor(), Color.random()));
                }
            }
            return null;
        }

        function touchAdd(e) {
            setTimeout(() => {
                if (touchInput.length == 0) {
                    addBoxel(e);
                }
            }, 100);
        }
    }

    run(time) {
        if (!this.camera) {
            this.init();
        }
        this.updateCamera(time);
        this.canvas.render(this.camera);
    }
}