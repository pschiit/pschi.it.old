import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Buffer from '../../libs/core/Buffer';
import Color from '../../libs/core/Color';
import Angle from '../../libs/math/Angle';
import Vector3 from '../../libs/math/Vector3';
import Vector4 from '../../libs/math/Vector4';
import Texture from '../../libs/renderer/graphics/Texture';
import BoxelSelectionMaterial from './material/BoxelSelectionMaterial';
import Boxel from './node/Boxel';
import BoxelSprite from './node/BoxelSprite';
import Grid from './node/Grid';

export default class Editor extends App {
    constructor(canvas) {
        super(canvas);
    }

    init() {
        const scale = 64;

        const mainBuffer = new Buffer();
        const mainInstanceBuffer = new Buffer();
        const mainIndexBuffer = new Buffer();

        const world = new Node3d();

        const orbit = new Node3d();
        world.appendChild(orbit);

        this.camera = new OrthographicCamera(-scale, scale, -scale, scale, 0.1, 2000);
        this.camera.zoom = scale;
        this.camera.translate(0, 0, -50);
        this.camera.target = orbit.position;
        orbit.appendChild(this.camera);


        const grid = new Grid();
        world.appendChild(grid);
        mainBuffer.appendChild(grid.vertexBuffer.arrayBuffer);
        mainIndexBuffer.appendChild(grid.vertexBuffer.index);

        this.sprite = new BoxelSprite();
        world.appendChild(this.sprite);
        mainBuffer.appendChild(this.sprite.vertexBuffer.arrayBuffer);
        mainIndexBuffer.appendChild(this.sprite.vertexBuffer.index);
        mainInstanceBuffer.appendChild(this.sprite.vertexBuffer.instanceArrayBuffer);

        const pickingTexture = new Texture();
        const pickingMaterial = new BoxelSelectionMaterial();
        const zoomStep = 1;
        const rotationStep = 15;
        let rotationY = 0;
        let rotationX = 0;
        let zoom = 0;
        let rightClicked = false;
        this.canvas.addEventListener('pointerdown', e => {
            if (e.button != 0) {
                if (this.sprite.count > 0) {
                    const mousePosition = this.canvas.getPointerPosition(e);
                    const renderTarget = this.canvas.renderTarget;

                    renderTarget.read = new Vector4(mousePosition[0], mousePosition[1], 1, 1);
                    renderTarget.colorTexture = pickingTexture;
                    renderTarget.material = pickingMaterial;
                    this.canvas.render(this.camera);
                    renderTarget.read = null;
                    renderTarget.material = null;
                    renderTarget.colorTexture = null;

                    if (renderTarget.output) {
                        const position = new Color(renderTarget.output);
                        if (position) {
                            console.log(position);
                            this.sprite.set(position, null);
                            return;
                        }
                    }
                }

                const ray = this.camera.raycast(this.canvas.getNormalizedPointerPosition(e));
                const intersection = grid.intersect(ray);
                if (intersection) {
                    this.sprite.set(intersection);
                }
            } else {
                this.canvas.setPointerCapture(e.pointerId);
                rightClicked = true;
                updateMovement(e);
            }

        });
        this.canvas.addEventListener('wheel', e => {
            zoom -= zoomStep * Math.sign(e.deltaY);
        });
        this.canvas.addEventListener('pointerup', e => {
            this.canvas.releasePointerCapture(e.pointerId);
            rightClicked = false;
        });
        this.canvas.addEventListener('pointermove', updateMovement.bind(this));

        function updateMovement(e) {
            if (rightClicked) {
                rotationY -= rotationStep * Math.sign(e.movementX);
                rotationX += rotationStep * Math.sign(e.movementY);
            }
        }
        this.updateCamera = () => {
            if (zoom) {
                this.camera.zoom += zoom;
                if (this.camera.zoom > scale) {
                    this.camera.zoom = scale;
                }
                zoom = 0;
            }
            if (rotationX || rotationY) {
                console.log(rotationX, rotationY)
                orbit.rotate(Angle.toRadian(rotationX), Angle.toRadian(rotationY), 0);
                rotationY = 0;
                rotationX = 0;
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

    static randomBoxel() {
        return new Boxel(Vector3.random(), Color.random())
    }
}