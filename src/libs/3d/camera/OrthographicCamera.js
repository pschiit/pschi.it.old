import Matrix4 from '../../math/Matrix4';
import Ray from '../../math/Ray';
import Vector3 from '../../math/Vector3';
import Camera from './Camera';

export default class OrthographicCamera extends Camera {
    constructor(left, right, bottom, top, near, far) {
        super();
        this.zoom = 1;
        this._left = left;
        this._right = right;
        this._bottom = bottom;
        this._top = top;
        this._near = near;
        this._far = far;
        this.orthograpicUpdated = true;
    }

    get zoom() {
        return this._zoom;
    }

    set zoom(v) {
        if (v != this._zoom) {
            this._zoom = v;
            this.orthograpicUpdated = true;
            this.projectionUpdated = true;
        }
    }

    get left() {
        return this._left;
    }

    set left(v) {
        if (v != this._left) {
            this._left = v;
            this.orthograpicUpdated = true;
            this.projectionUpdated = true;
        }
    }

    get right() {
        return this._right;
    }

    set right(v) {
        if (v != this._right) {
            this._right = v;
            this.orthograpicUpdated = true;
            this.projectionUpdated = true;
        }
    }

    get bottom() {
        return this._bottom;
    }

    set bottom(v) {
        if (v != this._bottom) {
            this._bottom = v;
            this.orthograpicUpdated = true;
            this.projectionUpdated = true;
        }
    }

    get top() {
        return this._top;
    }

    set top(v) {
        if (v != this._top) {
            this._top = v;
            this.orthograpicUpdated = true;
            this.projectionUpdated = true;
        }
    }

    get near() {
        return this._near;
    }

    set near(v) {
        if (v != this._near) {
            this._near = v;
            this.orthograpicUpdated = true;
            this.projectionUpdated = true;
        }
    }

    get far() {
        return this._far;
    }

    set far(v) {
        if (v != this._far) {
            this._far = v;
            this.orthograpicUpdated = true;
            this.projectionUpdated = true;
        }
    }

    get unit() {
        return this._unit;
    }

    set unit(v) {
        if (this._unit != v) {
            this._unit = v;
        }
    }

    set aspectRatio(v) {
        const right = this.top * v;
        if (this.right != right) {
            this._left = -right;
            this._right = right;
            this.orthograpicUpdated = true;
            this.projectionUpdated = true;
        }
    }

    get orthographicMatrix() {
        if (this.orthograpicUpdated) {
            const dx = (this.right - this.left) / (2 * this.zoom);
            const dy = (this.top - this.bottom) / (2 * this.zoom);
            const cx = (this.right + this.left) / 2;
            const cy = (this.top + this.bottom) / 2;


            let left = cx - dx;
            let right = cx + dx;
            let top = cy + dy;
            let bottom = cy - dy;

            this._orthographicMatrix = Matrix4.orthographicMatrix(left, right, bottom, top, this.near, this.far);
            this.orthograpicUpdated = false;
            if (this.frustum) {
                this.frustum.matrix = this._orthographicMatrix.inverse;
                this.frustum.vertexMatrix;
            }
        }
        return this._orthographicMatrix;
    }

    get projectionMatrix() {
        if (this.projectionUpdated) {
            this._projectionMatrix = this.orthographicMatrix.clone().multiply(this.vertexMatrix.inverse);
            this.projectionUpdated = false;
        }
        return this._projectionMatrix;
    }

    raycast(vector2) {
        const z = (this.near + this.far) / (this.near + this.far);
        const origin = this.unproject(vector2.toVector3(z));
        const direction = new Vector3(0, 0, -1).transformMatrix4(this.vertexMatrix).normalize();

        return new Ray(origin, direction);
    }

    getScene(renderTarget, materialParameters) {
        if (!this.viewport) {
            this.aspectRatio = renderTarget.aspectRatio;
        }
        return super.getScene(renderTarget, materialParameters);
    }
}