import GraphicsNode from './GraphicsNode';

export default class Render extends GraphicsNode {
    /** Create a Renderable Node for a Renderer
     */
    constructor(material, vertexBuffer) {
        super();
        this.material = material;
        this.vertexBuffer = vertexBuffer;
    }

    get renderable() {
        return this.material && this.count;
    }

    set count(v) {
        this._count = v;
    }

    get count() {
        return this.vertexBuffer ? this.vertexBuffer.count : this._count;
    }

    set primitive(v) {
        this._primitive = v;
    }

    get primitive() {
        return this.vertexBuffer ? this.vertexBuffer.primitive : this._primitive;
    }

    setScene(scene) {
        if (this.renderable) {
            if (this.vertexBuffer) {
                for (const name in this.vertexBuffer.parameters) {
                    const buffer = this.vertexBuffer.parameters[name];
                    if (buffer) {
                        const mainBuffer = buffer.mainBuffer;
                        if (!scene.buffers[mainBuffer.id]) {
                            scene.buffers[mainBuffer.id] = mainBuffer;
                        }
                    }
                }
                const index = this.vertexBuffer.index?.mainBuffer;
                if (index && !scene.indexes[index.id]) {
                    scene.indexes[index.id] = index;
                }
            }
            if (!scene.materials[this.material.id]) {
                scene.materials[this.material.id] = this.material;
            }
            scene.renders.push(this);
        }
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