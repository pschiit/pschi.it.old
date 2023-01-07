export default class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }

    move(distance) {
        return this.origin.add(this.direction.clone().scale(distance));
    }

    at(distance) {
        return this.direction.clone().scale(distance).add(this.origin);
    }

    target(vector3) {
        this.direction.set(vector3).substract(this.origin).normalize();
        return this;
    }

    distanceToPlane(plane) {
        const denominator = plane.normal.clone().dot(this.direction);
        if (denominator === 0) {
            if (plane.distanceToPoint(this.origin) === 0) {
                return 0;
            }
            return null;

        }
        const distance = - (this.origin.dot(plane.normal) + plane.distance) / denominator;
        return distance >= 0 ? distance : null;
    }

    intersectPlane(plane) {
        const distance = this.distanceToPlane(plane);
        return distance ? this.at(distance) : null;
    }

    intersectBox(box) {
        let tmin, tmax, tymin, tymax, tzmin, tzmax;

        const invdirx = 1 / this.direction[0],
            invdiry = 1 / this.direction[1],
            invdirz = 1 / this.direction[2];

        if (invdirx >= 0) {

            tmin = (box.min[0] - this.origin[0]) * invdirx;
            tmax = (box.max[0] - this.origin[0]) * invdirx;

        } else {

            tmin = (box.max[0] - this.origin[0]) * invdirx;
            tmax = (box.min[0] - this.origin[0]) * invdirx;

        }

        if (invdiry >= 0) {

            tymin = (box.min[1] - this.origin[1]) * invdiry;
            tymax = (box.max[1] - this.origin[1]) * invdiry;

        } else {

            tymin = (box.max[1] - this.origin[1]) * invdiry;
            tymax = (box.min[1] - this.origin[1]) * invdiry;

        }

        if ((tmin > tymax) || (tymin > tmax)) return null;

        // These lines also handle the case where tmin or tmax is NaN
        // (result of 0 * Infinity). x !== x returns true if x is NaN

        if (tymin > tmin || tmin !== tmin) tmin = tymin;

        if (tymax < tmax || tmax !== tmax) tmax = tymax;

        if (invdirz >= 0) {
            tzmin = (box.min[2] - this.origin[2]) * invdirz;
            tzmax = (box.max[2] - this.origin[2]) * invdirz;
        } else {
            tzmin = (box.max[2] - this.origin[2]) * invdirz;
            tzmax = (box.min[2] - this.origin[2]) * invdirz;
        }

        if ((tmin > tzmax) || (tzmin > tmax)) return null;

        if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

        if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

        //return point closest to the ray (positive side)

        if (tmax < 0) return null;

        return this.at(tmin >= 0 ? tmin : tmax);

    }

    transformMatrix4(matrix4) {
        this.origin.transformMatrix4(matrix4);
        this.direction.transformMatrix4(matrix4).normalize();

        return this;
    }
}