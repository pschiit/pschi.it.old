import Color from '../../core/Color';
import Vector2 from '../../math/Vector2';
import Material from '../../renderer/graphics/Material';
import Render from '../../renderer/graphics/Render';
import BoxBuffer from '../buffer/BoxBuffer';
import ColorMaterial from '../material/ColorMaterial';
import Node3d from '../Node3d';

export default class Camera extends Node3d {
    constructor() {
        super();
        this.fog = new Vector2(0, 50);
        this.projectionUpdated = true;
    }

    get showFrustum() {
        return this.frustum != undefined;
    }

    set showFrustum(v) {
        if (v && this.frustum.parent != this) {
            this.appendChild(this.frustum);
        } else {
            this.removeChild(this.frustum);
            this._frustum = null;
        }
    }

    get frustum() {
        if (!this._frustum) {
            this._frustum = Camera.frustum();
        }
        return this._frustum;
    }

    get projectionMatrix() {
        return this.vertexMatrix.clone().invert();
    }

    getScene(renderTarget) {
        const parameters = {};
        const materials = {};
        const renders = [];
        if (renderTarget.material) {
            materials[renderTarget.material.id] = renderTarget.material;
        }

        update(this.root);

        parameters[Material.parameters.backgroundColor] = renderTarget.backgroundColor;
        parameters[Material.parameters.fogDistance.name] = this.fog;
        parameters[Material.parameters.cameraPosition.name] = this.vertexMatrix.positionVector;
        parameters[Material.parameters.projectionMatrix.name] = this.projectionMatrix;

        for (const id in materials) {
            const material = materials[id];
            for (const name in parameters) {
                const parameter = parameters[name];
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
            if (render.renderable) {
                if (!renderTarget.material && !materials[render.material.id]) {
                    materials[render.material.id] = render.material;
                }
                renders.push(render);
            }
            render.setScene(parameters);
            render.childrens.forEach(update);
        }
    }

    static frustum() {
        const frustum = new Node3d();
        frustum.vertexBuffer = frustumBuffer;
        frustum.material = frustumMaterial;

        return frustum;
    }
}

const frustumMaterial = new ColorMaterial();
const frustumBuffer = new BoxBuffer(2, 2, 2);
frustumBuffer.setColor(Color.white);
frustumBuffer.setPrimitive(Render.primitive.lines);