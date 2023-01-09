import GraphicsNode from './GraphicsNode';
import Material from './Material';

export default class Render extends GraphicsNode {
    /** Create a Renderable Node for a Renderer
     */
    constructor(material, vertexBuffer) {
        super();
        this.material = material;
        this.vertexBuffer = vertexBuffer;
        this.filters = [];
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

    getScene(renderTarget, materialParameters = {}) {
        const filters = this.filters;
        const materials = {};
        const renders = [];
        if (renderTarget.material) {
            materials[renderTarget.material.id] = renderTarget.material;
        }
        materialParameters[Material.parameters.backgroundColor] = renderTarget.backgroundColor;

        this.root.dispatchCallback(update);
        for (const id in materials) {
            const material = materials[id];
            for (const name in materialParameters) {
                const parameter = materialParameters[name];
                if (material.parameters.hasOwnProperty(name)) {
                    material.setParameter(name, parameter);
                }
            }
        }

        return renders;

        /** Load a Node in the current WebGLRenderer
         * @param {Render} render Node to load
         */
        function update(render) {
            if (filter(render)) {
                if (!renderTarget.material && !materials[render.material.id]) {
                    materials[render.material.id] = render.material;
                }
                renders.push(render);
            }
            render.setScene(materialParameters);
        }


        /** Return whether or not the Render is ignored by the Camera
         * @param {Render} render Render to verify
         * @returns {Boolean} true if the Camera can see the Render
         */
        function filter(render) {
            return filters.every(f =>
                f != render
                && (f instanceof Function && f(render)) || render[f])
                && render.renderable;
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