import OrthographicCamera from '../../libs/3d/camera/OrthographicCamera';
import PerspectiveCamera from '../../libs/3d/camera/PerspectiveCamera';
import Node3d from '../../libs/3d/Node3d';
import App from '../../libs/core/App';
import Buffer from '../../libs/core/Buffer';
import Color from '../../libs/core/Color';
import Vector3 from '../../libs/math/Vector3';
import Vector4 from '../../libs/math/Vector4';
import Texture from '../../libs/renderer/graphics/Texture';
import BoxelSelectionMaterial from './material/BoxelSelectionMaterial';
import Boxel from './node/Boxel';
import BoxelSprite from './node/BoxelSprite';
import Grid from './node/Grid';

export default class Editor extends App {
    constructor(graphicRenderer, eventInterface) {
        super(graphicRenderer, eventInterface);
        this.movementX = 0;
        this.movementY = 0;
        this.step = 0.01;
        this.count = 0;
        this.wheelDelta = 0;
        this.scale = 16;
    }

    init() {
        const mainBuffer = new Buffer();
        const mainInstanceBuffer = new Buffer();
        const mainIndexBuffer = new Buffer();

        this.orbit = new Node3d();
        this.camera = new OrthographicCamera(-this.scale, this.scale, -this.scale, this.scale, 0.1, 2000);
        this.camera = new PerspectiveCamera(55, 1, 0.1, 2000);
        //this.camera.zoom = this.scale / 4;
        this.camera.translate(5, 5, -10);
        this.camera.target = new Vector3(0, 0, 0);
        this.orbit.appendChild(this.camera);

        const world = new Node3d();
        world.appendChild(this.orbit);

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

        this.addEventListener('pointerdown', e => {
            // const mousePosition = this.getPointerPosition(e);
            // const renderTarget = this.renderTarget;

            // renderTarget.read = new Vector4(mousePosition[0], mousePosition[1], 1, 1);
            // renderTarget.colorTexture = pickingTexture;
            // renderTarget.material = pickingMaterial;
            // this.graphicsRenderer.render(renderTarget);
            // renderTarget.read = null;
            // renderTarget.material = null;
            // renderTarget.colorTexture = null;

            // const position = new Color(renderTarget.output);
            // if (position) {
            //     this.sprite.set(position, null);
            //     return;
            // }

            const ray = this.camera.raycast(this.getNormalizedPointerPosition(e));
            const intersection = grid.intersect(ray);
            if (intersection) {
                this.sprite.set(intersection);
            }

        });

        // this.addEventListener('pointerdown', e => {
        //     this.clicked = true;
        //     this.graphicsRenderer.parent.setPointerCapture(e.pointerId);
        //     this.updateMovement(e);
        // });
        // this.addEventListener('pointerup', e => {
        //     this.graphicsRenderer.parent.releasePointerCapture(e.pointerId);
        //     this.movementX = 0;
        //     this.movementY = 0;
        //     this.clicked = false;
        // });
        // this.addEventListener('pointermove', this.updateMovement.bind(this));

        this.addEventListener('wheel', e => {
            this.wheelDelta -= e.deltaY * this.step
        });
    }

    updateMovement(e) {
        if (this.clicked) {
            this.movementX -= e.movementX * this.step;
            this.movementY += e.movementY * this.step;
        }
    }

    run() {
        if (!this.camera) {
            this.init();
        }
        if (this.wheelDelta) {
            this.camera.zoom += this.wheelDelta * 0.1;
            this.wheelDelta = 0;
            if (this.camera.zoom > this.scale) {
                this.camera.zoom = this.scale;
            } else if (this.camera.zoom <= 1) {
                this.camera.zoom = 1;
            }
        }
        if (this.clicked) {
            if (this.movementX) {
                this.orbit.rotate(this.movementX * this.step, 0, 1, 0);
                this.camera.projectionUpdated = true;
            }
            if (this.movementY) {
                this.orbit.rotate(this.movementY * this.step, 1, 0, 0);
                this.camera.projectionUpdated = true;
            }
        }

        this.graphicsRenderer.render(this.camera);
    }

    static randomBoxel() {
        return new Boxel(Vector3.random(), Color.random())
    }
}