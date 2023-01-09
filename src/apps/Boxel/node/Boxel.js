import Color from '../../../libs/core/Color';
import Box from '../../../libs/math/Box';
import Vector3 from '../../../libs/math/Vector3';

export default class Boxel extends Box {
    /** Create a new Boxel
     * @param {Vector3} position of Boxel
     * @param {Color} color of Boxel
    */
    constructor(position = new Vector3(), color = Color.black()) {
        super(position, position.clone().addScalar(Boxel.size));
        this.color = color;
    }

    get position() {
        return this.min;
    }

    set position(v) {
        this.min = v;
        this.max = v.addScalar(Boxel.size);
    }

    static size = 1;
}