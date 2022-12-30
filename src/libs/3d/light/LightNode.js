import Matrix4 from '../../math/Matrix4';
import Material from '../../renderer/graphics/Material';
import Render from '../../renderer/graphics/Render';
import Node3d from '../Node3d';

export default class LightNode extends Node3d {
    constructor(color) {
        super();
        this.lightParameters = {};
        this.color = color;
        this.ambientStrength = 0.1;
        this.intensity = 1;
        this.camera = null;
    }

    get on() {
        return this.intensity > 0;
    }

    getScene(renderTarget) {
        const renders = [];
        renderTarget.material.parameters[Material.parameters.projectionMatrix.name] = this.camera.projectionMatrix;
        update(this.root);

        return renders;

        /** Load a Node in the current WebGLRenderer
         * @param {Node3d} render Node to load
         */
        function update(render) {
            if (render.renderable && render.shadow) {
                renders.push(render);
            }
            const parentMatrix = render.parent?.vertexMatrix;
            const vertexMatrix = parentMatrix instanceof Matrix4 ? parentMatrix.clone().multiply(render.matrix)
                : this.matrix.clone();
            render.setParameter(Material.parameters.vertexMatrix, vertexMatrix);
            
            render.childrens.forEach(update);
        }
    }

    toggle() {
        const cache = this._intensity || 0;
        this._intensity = this.intensity;
        this.intensity = cache;
    }

    setScene(scene) {
        super.setScene(scene);

        return this;
    }
}