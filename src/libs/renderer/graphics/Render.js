import Color from '../../core/Color';
import GraphicsNode from './GraphicsNode';
import Scene from './Scene';

export default class Render extends GraphicsNode {
    /** Create a Renderable Node for a Renderer
     */
    constructor() {
        super();
        const colorId = Color.unique();
        Render.cache[colorId] = this;
        this.setParameter(Render.colorIdName, colorId);
        this.material = null;
        this.vertexBuffer = null;
    }

    get renderable() {
        return this.material && this.vertexBuffer?.count > 0;
    }
    
    setScene(scene) {
        if (this.renderable) {
            if (!scene.buffers[this.vertexBuffer.id]) {
                scene.buffers[this.vertexBuffer.id] = this.vertexBuffer;
            }
            if (this.vertexBuffer.index && !scene.indexes[this.vertexBuffer.index.id]) {
                scene.indexes[this.vertexBuffer.index.id] = this.vertexBuffer.index;
            }
            if (!scene.materials[this.material.id]) {
                scene.materials[this.material.id] = this.material;
            }
            scene.renders.push(this);
        }
    }

    setParameter(name, value) {
        if (this.parameters[name] != value) {
            this.parameters[name] = value;
        }
    }

    static search(colorId) {
        return Render.cache[colorId];
    }

    static cache = {};

    static primitive = {
        points: 'POINTS',
        triangles: 'TRIANGLES',
        triangleFan: 'TRIANGLE_FAN',
        triangleStrip: 'TRIANGLE_STRIP',
        lines: 'LINES',
        lineLoop: 'LINE_FAN',
        lineStrip: 'LINE_STRIP',
    };

    static colorIdName = 'colorId';
}