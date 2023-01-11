import Buffer from '../../../libs/core/Buffer';
import BoxelMaterial from '../material/BoxelMaterial';
import BoxelBuffer from './BoxelBuffer';

export default class InstancedBoxelBuffer extends BoxelBuffer {
    constructor(positions, colors) {
        super();
        this.instancePositionLength = 3;
        this.instanceColorLength = 3;
        this.instancePosition = positions || [];
        this.instanceColor = colors || [];
        this.instanceColor.normalize = true;
        this.instancePosition.usage = Buffer.usage.stream;
        this.instanceColor.usage = Buffer.usage.stream;
    }

    get count() {
        return this.instancePosition?.length > 0 ? this.index.length : 0;
    }

    set count(v) {
        this._count = v;
    }

    get instancePosition() {
        return this.getParameter(BoxelMaterial.parameters.instancePosition);
    }

    set instancePosition(v) {
        this.setParameter(BoxelMaterial.parameters.instancePosition, v, this.instancePositionLength, 1);
    }

    get instanceColor() {
        return this.getParameter(BoxelMaterial.parameters.instanceColor);
    }

    set instanceColor(v) {
        this.setParameter(BoxelMaterial.parameters.instanceColor, v, this.instanceColorLength, 1);
    }
}