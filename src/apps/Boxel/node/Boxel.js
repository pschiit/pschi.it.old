import Color from '../../../libs/core/Color';
import Box from '../../../libs/math/Box';
import Plane from '../../../libs/math/Plane';
import Vector3 from '../../../libs/math/Vector3';

export default class Boxel {
    constructor(position = new Vector3(), color = Color.black()) {
        this.position = position;
        this.color = color;
    }

    get boundingBox() {
        return getBoundingBox(this.position).clone();
    }

    intersect(ray) {
        return ray.intersectBox(getBoundingBox(this.position));
    }

    getPlane(point) {
        const boundingBox = getBoundingBox(this.position);
        const distance = boundingBox.distanceToPoint(point);
        console.log(boundingBox, distance);
        return null;
    }
}

const halfSize = 0.5;
const boundingBox = new Box(new Vector3(), new Vector3(halfSize, halfSize, halfSize).addScalar(halfSize));
function getBoundingBox(position) {
    boundingBox.min = position.clone().addScalar(-halfSize);
    boundingBox.max = position.clone().addScalar(halfSize);
    return boundingBox;
}