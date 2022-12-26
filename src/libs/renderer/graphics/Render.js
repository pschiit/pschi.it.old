import GraphicsNode from './GraphicsNode';
import Material from './Material';

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

    getScene(renderTarget) {
        const parameters = {};
        const materials = {};
        const renders = [];
        if(renderTarget.material){
            materials[renderTarget.material.id] = renderTarget.material;
        }
        this.parameters[Material.parameters.backgroundColor] = renderTarget.backgroundColor;

        update(this);
        for (const id in materials) {
            const material = materials[id];
            for (const name in parameters) {
                const parameter = parameters[name];
                material.parameters[name] = parameter;
            }
        }

        return renders;

        /** Load a Node in the current WebGLRenderer
         * @param {Render} render Node to load
         */
        function update(render) {
            if (render.renderable) {
                if(!renderTarget.material && !materials[render.material.id]){
                    materials[render.material.id] = render.material;
                }
                renders.push(render);
            }
            render.setScene(parameters);
            render.childrens.forEach(update);
        }
    }

    setScene(parameters) {
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