import Matrix4 from'../../math/Matrix4';
import Camera from'./Camera';

export default class  OrthographicCamera extends Camera {
    constructor(left, right, bottom, top, near, far) {
        super();
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
        this.near = near;
        this.far = far;

        this.updateProjection();
    }

    updateProjection() {
        const orthograpicMatrix = Matrix4.orthographicMatrix(this.left, this.right, this.bottom, this.top, this.near, this.far);
        const lookAt = Matrix4.lookAtMatrix(this.position, this.target, this.up);
        this.projectionMatrix = orthograpicMatrix.multiply(lookAt);
    }
}