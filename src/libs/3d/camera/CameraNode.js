import Vector2 from '../../math/Vector2';
import Material from '../../renderer/graphics/Material';
import Render from '../../renderer/graphics/Render';
import Node3d from '../Node3d';

export default class CameraNode extends Node3d {
    constructor() {
        super();
        this.fog = new Vector2(0, 50);
        this.projectionUpdated = true;
    }

    get projectionMatrix() {
        return this.invertMatrix;
    }

    getScene(renderTarget) {
        const parameters = {};
        const materials = {};
        const renders = [];
        if(renderTarget.material){
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
}