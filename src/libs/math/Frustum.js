import Plan from './Plan';

export default class Frustum {
    /** Create a new Frustum
     * @param {Plan} left Left Plan of the frustum
     * @param {Plan} right Right Plan of the frustum
     * @param {Plan} bottom Bottom Plan of the frustum
     * @param {Plan} top Top Plan of the frustum
     * @param {Plan} near Near Plan of the frustum
     * @param {Plan} far Far Plan of the frustum
    */
    constructor(left, right, bottom, top, near, far) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
    }
}