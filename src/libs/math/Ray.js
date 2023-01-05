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

    intersectPlane(plane){
        const distance = this.distanceToPlane(plane);
        return distance ? this.at(distance) : null;
    }
}