import Buffer from '../core/Buffer';
import Node from '../core/Node';
import Material from './Material';

export default class Render extends Node {
    /** Create a Renderable Node for a Renderer
     */
    constructor() {
        super();
        this.material = null;
        this.vertexBuffer = null;
    }

    get renderable() {
        return this.material && this.vertexBuffer?.count > 0;
    }

    updateParameters(scene) {
        if(this.renderable){
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

        return this;
    }

    setParameter(name, value) {
        this.parameters[name] = value;
    }

    static primitive = {
        points: 'POINTS',
        triangles: 'TRIANGLES',
        triangleFan: 'TRIANGLE_FAN',
        triangleStrip: 'TRIANGLE_STRIP',
        lines: 'LINES',
        lineLoop: 'LINE_FAN',
        lineStrip: 'LINE_STRIP',
    };
}