export class Angle {
    /** Convert radians to degrees
     * @param {Number} radian Angle in radians
     * @return {Number} angle in degrees
    */
    static toDegree(radian) {
        return radian * 180 / Math.PI;
    }

    /** Convert degrees to radians
     * @param {Number} degree Angle in degrees
     * @return {Number} angle in radians
    */
    static toRadian(degree) {
        return Math.PI * (degree) / 180.0;
    }
}