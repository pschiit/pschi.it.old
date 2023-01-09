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
        this._zoom = 1;
        this.fog = new Vector2(0, 50);
        this.updateAspectRatio = true;
        this.filters.push('visible');
        this.viewport = null;
    }

    get viewport() {
        return this._viewport;
    }

    set viewport(v) {
        this._viewport = v;
        if (v) {
            this.aspectRatio = v[2] / v[3];
        }

    }

    get zoom() {
        return this._zoom;
    }

    set zoom(v) {
        if (v != this._zoom && v > 0) {
            this._zoom = v;
        }
    }

    get aspectRatio() {
        return this._aspectRatio;
    }

    set aspectRatio(v) {
        this._aspectRatio = v;
        this.setParameter(Material.parameters.projectionMatrix, null);
    }

    get frustum() {
        return this._frustum;
    }

    set frustum(v) {
        if (v && v != this.frustum) {
            this.frustum = null;
            if (v.parent != this) {
                this.appendChild(v);
            }
            v.material = frustumMaterial;
            v.vertexBuffer = frustumBuffer;
            this._frustum = v;

        } else if (!v && this.frustum) {
            this.removeChild(this.frustum);
            this._frustum = null;
        }
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
        materialParameters[Material.parameters.cameraTarget.name] = this.target;
        materialParameters[Material.parameters.projectionMatrix.name] = this.projectionMatrix;
        return super.getScene(renderTarget, materialParameters);
    }

    project(position) {
        return position.transform(this.projectionMatrix);
    }

    unproject(position) {
        return position.transform(this.projectionMatrix.inverse);
    }

    clearMatrix(){
        super.clearMatrix();
        this.setParameter(Material.parameters.projectionMatrix, null);
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
frustumBuffer.setColor(Color.white());
frustumBuffer.setPrimitive(Render.primitive.lines);