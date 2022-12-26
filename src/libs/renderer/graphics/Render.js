import GraphicsNode from './GraphicsNode';
import Material from './Material';
import Scene from './Scene';

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

    getScene(renderTarget){
        const scene = new Scene();
        scene.setParameter(Material.parameters.backgroundColor, renderTarget.backgroundColor);
        update(this);
        if (renderTarget.material) {
            scene.materials = {};
            scene.materials[renderTarget.material.id] = renderTarget.material;
        }
        for (const id in scene.materials) {
            scene.materials[id].setScene(scene);
        }
        return scene;

        /** Load a Node in the current WebGLRenderer
         * @param {Render} render Node to load
         */
        function update(render) {
            render.setScene(scene);
            render.childrens.forEach(update);
        }
    }

    setScene(scene) {
        if (this.renderable) {
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