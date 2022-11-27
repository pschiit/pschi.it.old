import Matrix4 from '../../math/Matrix4';
import Camera from './Camera';

export default class OrthographicCamera extends Camera {
    constructor(left, right, bottom, top, near, far) {
        super();
        this._left = left;
        this._right = right;
        this._bottom = bottom;
        this._top = top;
        this._near = near;
        this._far = far;
        this._orthograpicUpdated = true;
    }

    get left() {
        return this._left;
    }

    set left(v) {
        this._left = v;
        this.orthograpicUpdated = true;
        this.projectionUpdated = true;
    }

    get right() {
        return this._right;
    }

    set right(v) {
        this._right = v;
        this.orthograpicUpdated = true;
        this.projectionUpdated = true;
    }

    get bottom() {
        return this._bottom;
    }

    set bottom(v) {
        this._bottom = v;
        this.orthograpicUpdated = true;
        this.projectionUpdated = true;
    }

    get top() {
        return this._top;
    }

    set top(v) {
        this._top = v;
        this.orthograpicUpdated = true;
        this.projectionUpdated = true;
    }

    get near() {
        return this._near;
    }

    set near(v) {
        this._near = v;
        this.orthograpicUpdated = true;
        this.projectionUpdated = true;
    }

    get far() {
        return this._far;
    }

    set far(v) {
        this._far = v;
        this.orthograpicUpdated = true;
        this.projectionUpdated = true;
    }

    get orthograpicMatrix() {
        if (this.orthograpicUpdated) {
            this.setCameraParameter(OrthographicCamera.orthograpicMatrixName, Matrix4.orthographicMatrix(this.left, this.right, this.bottom, this.top, this.near, this.far));
            this.orthograpicUpdated = false;
        }
        return this.cameraParameters[OrthographicCamera.orthograpicMatrixName];
    }

    get projectionMatrix(){
        return this.cameraParameters[Camera.projectionMatrixName];
    }

    updateParameters(scene) {
        super.updateParameters(scene);
        if (this.projectionUpdated) {
            this.setCameraParameter(Camera.projectionMatrixName, this.orthograpicMatrix.clone().multiply(this.lookAtMatrix));
        }

        return this;
    }
    static orthograpicMatrixName = 'orthograpicMatrix';
}