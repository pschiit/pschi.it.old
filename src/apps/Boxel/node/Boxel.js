import Color from '../../../libs/core/Color';
import Box from '../../../libs/math/Box';
import Vector3 from '../../../libs/math/Vector3';

export default class Boxel {
    constructor(position = new Vector3(), color = Color.black()) {
        this.position = position;
        this.color = color;
    }

    get boundingBox() {
        return new Box(this.position, this.position.clone().addScalar(1));
    }

    intersect(ray) {
        return ray.intersectBox(this.boundingBox);
    }
}