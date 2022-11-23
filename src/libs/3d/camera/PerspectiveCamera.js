import Matrix4 from'../../math/Matrix4';
import Camera from'./Camera';

export default class  PerspectiveCamera extends Camera {
    constructor(fovY, aspectRatio, near, far) {
        super();
        this.fovY = fovY;
        this.aspectRatio = aspectRatio;
        this.near = near;
        this.far = far;

        this.updateProjection();
    }

    updateProjection() {
        const perspective = Matrix4.perspectiveMatrix(this.fovY, this.aspectRatio, this.near, this.far);
        const lookAt = Matrix4.lookAtMatrix(this.position, this.target, this.up);
        this.projectionMatrix = perspective.multiply(lookAt);
    }
}