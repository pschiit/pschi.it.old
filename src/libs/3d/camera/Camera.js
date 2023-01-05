import Color from '../../core/Color';
import Ray from '../../math/Ray';
import Vector2 from '../../math/Vector2';
import Material from '../../renderer/graphics/Material';
import Render from '../../renderer/graphics/Render';
import BoxBuffer from '../buffer/BoxBuffer';
import ColorMaterial from '../material/ColorMaterial';
import Node3d from '../Node3d';

export default class Camera extends Node3d {
    constructor() {
        super();
        this.fog = new Vector2(0, 50);
        this.projectionUpdated = true;
        this.updateAspectRatio = true;
        this.filters.push('visible');
        this.viewport = null;
    }

    get viewport() {
        return this._viewport;
    }

    set viewport(v) {
        this._viewport = v;
        if(v){
            this.aspectRatio = v[2] / v[3];
        }

    }

    get aspectRatio() {
        return this._aspectRatio;
    }

    set aspectRatio(v) {
        this._aspectRatio = v;
        this.projectionUpdated = true;
    }

    get showFrustum() {
        return this.frustum != undefined;
    }

    set showFrustum(v) {
        if (v && this.frustum.parent != this) {
            this.appendChild(this.frustum);
            this.clearVertexMatrix();
        } else {
            this.removeChild(this.frustum);
            this._frustum = null;
        }
    }

    get frustum() {
        if (!this._frustum) {
            this._frustum = Camera.frustum();
        }
        return this._frustum;
    }

    get projectionMatrix() {
        return this.vertexMatrix.inverse;
    }

    getScene(renderTarget, materialParameters = {}) {
        if (this.viewport
            && !this.viewport.equals(renderTarget.scissor)) {
            renderTarget.scissor = this.viewport;
        }
        materialParameters[Material.parameters.fogDistance.name] = this.fog;
        materialParameters[Material.parameters.cameraPosition.name] = this.position;
        materialParameters[Material.parameters.projectionMatrix.name] = this.projectionMatrix;
        return super.getScene(renderTarget, materialParameters);
    }

    raycast(vector2) {
        return null;
    }

    project(position) {
        return position.transform(this.vertexMatrix.inverse).transform(this.projectionMatrix);
    }

    unproject(position) {
        return position.transform(this.projectionMatrix.inverse);
    }

    static frustum() {
        const frustum = new Node3d();
        frustum.vertexBuffer = frustumBuffer;
        frustum.material = frustumMaterial;

        return frustum;
    }
}

const frustumMaterial = new ColorMaterial();
const frustumBuffer = new BoxBuffer(2, 2, 2);
frustumBuffer.setColor(Color.white);
frustumBuffer.setPrimitive(Render.primitive.lines);