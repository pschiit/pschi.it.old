import Render from '../../../libs/renderer/graphics/Render';
import VertexBuffer from '../../../libs/renderer/graphics/VertexBuffer';

export default class GridBuffer extends VertexBuffer {
    constructor() {
        super();

        this.primitive = Render.primitive.triangleFan;
        this.index = [
            0, 1, 2, 3,];
        this.position = [
            -1, -1, 0,
            -1, 1, 0,
            1, 1, 0,
            1, -1, 0,];
    }
}