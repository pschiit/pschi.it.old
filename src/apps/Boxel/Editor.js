import VertexBufferManager from '../../libs/3d/buffer/VertexBufferManager';
import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import DirectionalLight from '../../libs/3d/light/DirectionalLight';
import Grid from '../../libs/3d/node/Grid';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Color from '../../libs/core/Color';
import Matrix4 from '../../libs/math/Matrix4';
import Vector2 from '../../libs/math/Vector2';
import Vector3 from '../../libs/math/Vector3';
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

        const sprite = new BoxelSprite();
        world.appendChild(sprite);
        bufferManager.add(sprite.vertexBuffer);
        sprite.castShadow = true;

        //Camera
        const orbit = new Node3d();
        orbit.translate(0, 0, 0);
        world.appendChild(orbit);
        const camera = new OrthographicCamera();
        camera.target = orbit;
        orbit.appendChild(camera);
        this.camera = camera;

        const grid = new Grid(camera);
        grid.material.sizes = new Vector2(1, 10);
        world.appendChild(grid);
        bufferManager.add(grid.vertexBuffer);

        const zoomStep = 0.1;
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
            zoom -= e.deltaY * zoomStep;
        });
        canvas.addEventListener('pointerup', e => {
            canvas.releasePointerCapture(e.pointerId);
            if (e.pointerType == 'mouse' || e.pointerType == 'pen') {
                clicked = -1;
            } else if (e.pointerType == 'touch') {
                touchInput.splice(touchInput.indexOf(e), 1);
                if (touchInput.length == 0) {
                    clicked = -1;
                } else if (touchInput.length == 1) {
                    deltaPinch = 0;
                }
            }
        });
        canvas.addEventListener('pointermove', updateMovement.bind(this));

        let draw = true;
        let updateGrid = true;
        let deltaPinch = 0;
        function updateMovement(e) {
            const pixelRatio = canvas.pixelRatio;
            if (touchInput.length == 1 || clicked == 0) {
                cameraMovement[0] -= cameraStep * pixelRatio * e.movementX;
                cameraMovement[1] += cameraStep * pixelRatio * e.movementY;
            } else if (clicked == 2) {
                addBoxel(e);
                // orbitMovement[0] -= orbitStep * e.movementX;
                // orbitMovement[1] += orbitStep * e.movementY;
            } else if (touchInput.length > 1) {
                const secondFinger = touchInput.find(i => i.pointerId != e.pointerId);
                const newDeltaPinch = new Vector2(e.pageX, e.pageY).distance(new Vector2(secondFinger.pageX, secondFinger.pageY));

                zoom += (newDeltaPinch - deltaPinch) * zoomStep;
                deltaPinch = newDeltaPinch;
            }
        }
        let then = 0;
        let previousScale = 0;
        this.updateCamera = (time) => {
            time *= 0.001
            if (time > then) {
                draw = true;
                then = time + 0.115;
            }

            const renderTarget = canvas.renderTarget;
            const scale = renderTarget.maxY * 0.5;

            if (camera.top != scale) {
                camera.top = scale;
                camera.translate(new Vector3(-previousScale, -previousScale, previousScale)).translate(new Vector3(scale, scale, -scale));
                camera.aspectRatio = renderTarget.aspectRatio;
                previousScale = scale;
            }
            if (zoom) {
                camera.zoom += zoom;
                zoom = 0;
                updateGrid = true;
            }
            if (camera.zoom > scale) {
                camera.zoom = scale;
            } else if (camera.zoom < 6) {
                camera.zoom = 6;
            }
            if (updateGrid) {
                grid.fading = scale / camera.zoom * 4;
                updateGrid = false;
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
                    //draw = false;
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