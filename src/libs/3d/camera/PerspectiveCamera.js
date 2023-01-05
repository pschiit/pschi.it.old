import Matrix4 from '../../math/Matrix4';
import Ray from '../../math/Ray';
import Camera from './Camera';

export default class PerspectiveCamera extends Camera {
    constructor(fovY, aspectRatio, near, far) {
        super();
        this._fovY = fovY;
        this._aspectRatio = aspectRatio;
        this._near = near;
        this._far = far;
        this.perspectiveUpdated = true;
    }

    get fovY() {
        return this._fovY;
    }

    set fovY(v) {
        this._fovY = v;
        this.perspectiveUpdated = true;
        this.projectionUpdated = true;
    }

    get aspectRatio() {
        return this._aspectRatio;
    }

    set aspectRatio(v) {
        this._aspectRatio = v;
        this.perspectiveUpdated = true;
        this.projectionUpdated = true;
    }

    get near() {
        return this._near;
    }

    set near(v) {
        this._near = v;
        this.perspectiveUpdated = true;
        this.projectionUpdated = true;
    }

    get far() {
        return this._far;
    }

    set far(v) {
        this._far = v;
        this.perspectiveUpdated = true;
        this.projectionUpdated = true;
    }

    get frustum() {
        if (!this._frustum) {
            this._frustum = Camera.frustum();
            this.perspectiveMatrix;
        }
        return this._frustum;
    }

    get perspectiveMatrix() {
        if (this.perspectiveUpdated) {
            this._perspectiveMatrix = Matrix4.perspectiveMatrix(this.fovY, this.aspectRatio, this.near, this.far);
            this.perspectiveUpdated = false;
            if (this.showFrustum) {
                this.frustum.matrix = this._perspectiveMatrix.inverse;
                this.frustum.vertexMatrix;
            }
        }
        return this._perspectiveMatrix;
    }

    get projectionMatrix() {
        if (this.projectionUpdated) {
            this._projectionMatrix = this.perspectiveMatrix.clone().multiply(this.vertexMatrix.inverse);
            this.projectionUpdated = false;
        }
        return this._projectionMatrix;
    }

    raycast(vector2) {
        const origin = this.vertexMatrix.positionVector;
        const direction = this.unproject(vector2.toVector3(0)).substract(origin).normalize();
        return new Ray(origin, direction);
    }

    getScene(renderTarget, materialParameters) {
        if (!this.viewport) {
            this.aspectRatio = renderTarget.aspectRatio;
        }
        return super.getScene(renderTarget, materialParameters);
    }
}