import Frustum from '../../math/Frustum';
import Matrix4 from '../../math/Matrix4';
import Plan from '../../math/Plan';
import CameraNode from './CameraNode';

export default class PerspectiveCamera extends CameraNode {
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

    get perspectiveMatrix() {
        if (this.perspectiveUpdated) {
            this._perspectiveMatrix = Matrix4.perspectiveMatrix(this.fovY, this.aspectRatio, this.near, this.far);
            this.perspectiveUpdated = false;
        }
        return this._perspectiveMatrix;
    }

    get projectionMatrix() {
        if (this.projectionUpdated) {
            this._projectionMatrix = this.perspectiveMatrix.clone().multiply(this.worldMatrix.clone().invert());
            this.projectionUpdated = false;
        }
        return this._projectionMatrix;
    }

    get frustum() {
        const left = new Plan();
        const rigth = new Plan();
        const top = new Plan();
        const bottom = new Plan();
        const near = new Plan();
        const far = new Plan();

        return new Frustum(left, rigth, top, bottom, near, far);
    }

    setScene(scene){
        super.setScene(scene);
        const aspectRatio = scene.renderTarget.aspectRatio;
        if (aspectRatio != this.aspectRatio) {
            this.aspectRatio = aspectRatio;
            this.projectionUpdated = true;
        }
        if (this.projectionUpdated) {
            this._projectionMatrix = this.perspectiveMatrix.clone().multiply(this.vertexMatrix.clone().invert());
            this.projectionUpdated = false;
        }
        scene.setParameter(CameraNode.parameters.projectionMatrix, this.projectionMatrix);
    }
}