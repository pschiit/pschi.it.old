import Render from '../../../libs/renderer/graphics/Render';
import VertexBuffer from '../../../libs/renderer/graphics/VertexBuffer';
import BoxelMaterial from '../material/BoxelMaterial';
import Buffer from '../../../libs/core/Buffer';

export default class BoxelBuffer extends VertexBuffer {
    constructor(positions, colors) {
        super();
        this.instancePositionLength = 3;
        this.instanceColorLength = 3;

        this.primitive = Render.primitive.triangles;
        this.index = [
            0, 1, 2, 2, 3, 0,
            4, 5, 6, 6, 7, 4,
            8, 9, 10, 10, 11, 8,
            12, 13, 14, 14, 15, 12,
            16, 17, 18, 18, 19, 16,
            20, 21, 22, 22, 23, 20];

        this.position = [
            0, 0, 0,//F
            0, 1, 0,
            1, 1, 0,
            1, 0, 0,

            1, 0, 0,//R
            1, 1, 0,
            1, 1, 1,
            1, 0, 1,

            1, 0, 1,//B
            1, 1, 1,
            0, 1, 1,
            0, 0, 1,

            1, 1, 1,//U
            1, 1, 0,
            0, 1, 0,
            0, 1, 1,

            0, 0, 1,//L
            0, 1, 1,
            0, 1, 0,
            0, 0, 0,

            0, 0, 1,//D
            0, 0, 0,
            1, 0, 0,
            1, 0, 1,];

        this.instancePosition = positions || [];
        this.instanceColor = colors || [];
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