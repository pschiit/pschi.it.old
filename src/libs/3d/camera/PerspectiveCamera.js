import { Matrix4 } from '../../math/Matrix4';
import { Camera } from './Camera';

export class PerspectiveCamera extends Camera {
    constructor(fovY, aspectRatio, near, far) {
        super();
        this.fovY = fovY;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;

        this.updateProjection();
    }

    updateProjection() {
        const perspectiveMatrix = Matrix4.perspectiveMatrix(this.fovY, this.aspectRatio, this.near, this.far)
        this.projectionMatrix = perspectiveMatrix.multiply(this.matrix.clone());
    }
}