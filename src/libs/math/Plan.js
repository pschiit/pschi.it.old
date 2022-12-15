import Vector3 from './Vector3';

export default class Plan {
    /** Create a new Plan
     * @param {Number} distance of Plan from origin
     * @param {Vector3} normal of Plan
    */
    constructor(distance = 0, normal = new Vector3(0, 1, 0)) {
        this.distance = distance;
        this.normal = normal;
    }
}