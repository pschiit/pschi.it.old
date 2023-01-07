import Vector3 from './Vector3';

export default class Box {
    /** Create a new AABB Box
     * @param {Vector3} min of Plan from origin
     * @param {Vector3} max of Plan
    */
    constructor(min = new Vector3(+Infinity, +Infinity, +Infinity), max = new Vector3(-Infinity, -Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
    }

    translate(vector3) {
        this.min.add(vector3);
        this.max.add(vector3);

        return this;
    }

    union(box) {
        this.min.min(box.min);
        this.max.max(box.max);

        return this;
    }

	intersect( box ) {
		this.min.max( box.min );
		this.max.min( box.max );

		return this;
	}

    expandByPoint(vector3) {
        this.min.min(vector3);
        this.max.max(vector3);

        return this;
    }

    expandByVector(vector3) {
        this.min.substract(vector3);
        this.max.add(vector3);

        return this;
    }

    expandByScalar(scalar) {
        this.min.scale(-scalar);
        this.max.scale(scalar);

        return this;
    }

    setFromCenterAndSize(center, size) {
        const half = size.clone().scale(0.5);

        this.min = center.clone().substract(half);
        this.max = center.clone().add(half);

        return this;
    }

    containsPoint(vector3) {
        return vector3[0] < this.min[0] || vector3[0] > this.max[0] ||
            vector3[1] < this.min[1] || vector3[1] > this.max[1] ||
            vector3[2] < this.min[2] || vector3[2] > this.max[2] ? false : true;

    }

    containsBox(box) {
        return this.min[0] <= box.min[0] && box.max[0] <= this.max[0] &&
            this.min[1] <= box.min[1] && box.max[1] <= this.max[1] &&
            this.min[2] <= box.min[2] && box.max[2] <= this.max[2];

    }

    intersectsBox(box) {
        // using 6 splitting planes to rule out intersections.
        return box.max[0] < this.min[0] || box.min[0] > this.max[0] ||
            box.max[1] < this.min[1] || box.min[1] > this.max[1] ||
            box.max[2] < this.min[2] || box.min[2] > this.max[2] ? false : true;

    }

    intersectsPlane(plane) {
        // We compute the minimum and maximum dot product values. If those values
        // are on the same side (back or front) of the plane, then there is no intersection.
        let min, max;

        if (plane.normal[0] > 0) {
            min = plane.normal[0] * this.min[0];
            max = plane.normal[0] * this.max[0];
        } else {
            min = plane.normal[0] * this.max[0];
            max = plane.normal[0] * this.min[0];
        }

        if (plane.normal[1] > 0) {
            min += plane.normal[1] * this.min[1];
            max += plane.normal[1] * this.max[1];
        } else {
            min += plane.normal[1] * this.max[1];
            max += plane.normal[1] * this.min[1];
        }

        if (plane.normal[2] > 0) {
            min += plane.normal[2] * this.min[2];
            max += plane.normal[2] * this.max[2];
        } else {
            min += plane.normal[2] * this.max[2];
            max += plane.normal[2] * this.min[2];
        }

        return (min <= - plane.constant && max >= - plane.constant);

    }
}