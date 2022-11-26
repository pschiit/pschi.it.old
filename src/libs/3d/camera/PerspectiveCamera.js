import Matrix4 from'../../math/Matrix4';
import Camera from'./Camera';

export default class  PerspectiveCamera extends Camera {
    constructor(fovY, aspectRatio, near, far) {
        super();
        this._fovY = fovY;
        this._aspectRatio = aspectRatio;
        this._near = near;
        this._far = far;
        this.perspectiveUpdated = true;
        this.projectionUpdated = true;
    }

    get fovY() {
        return this._fovY;
    }

    set fovY(v) {
        this._fovY = v;
        this.perspectiveUpdated = true;
    }

    get aspectRatio() {
        return this._aspectRatio;
    }

    set aspectRatio(v) {
        this._aspectRatio = v;
        this.perspectiveUpdated = true;
    }

    get near() {
        return this._near;
    }

    set near(v) {
        this._near = v;
        this.perspectiveUpdated = true;
    }

    get far() {
        return this._far;
    }

    set far(v) {
        this._far = v;
        this.perspectiveUpdated = true;
    }

    get perspectiveMatrix(){
        if (this.perspectiveUpdated) {
            this._perspectiveMatrix = Matrix4.perspectiveMatrix(this.fovY, this.aspectRatio, this.near, this.far);
            this.perspectiveUpdated = false;
        }
        return this._perspectiveMatrix;
    }

    get projectionMatrix(){
        if(this.projectionUpdated){
            this._projectionMatrix =  this.perspectiveMatrix.multiply(this.lookAtMatrix);
        }
        return this._projectionMatrix;
    }
}