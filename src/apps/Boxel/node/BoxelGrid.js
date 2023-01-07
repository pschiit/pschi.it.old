import Node3d from '../../../libs/3d/Node3d';
import Plane from '../../../libs/math/Plane';
import GridBuffer from '../buffer/GridBuffer';
import BoxelGridMaterial from '../material/BoxelGridMaterial';

export default class BoxelGrid extends Node3d{
    constructor(){
        super();
        this.vertexBuffer = BoxelGrid.vertexBuffer;
        this.material = BoxelGrid.material;
    }

    get fading() {
        return this.getParameter(BoxelGridMaterial.parameters.fading);
    }

    set fading(v) {
        this.setParameter(BoxelGridMaterial.parameters.fading, v);
    }

    intersect(ray){
        return ray.intersectPlane(BoxelGrid.plane);
    }

    static vertexBuffer = new GridBuffer();
    static material = new BoxelGridMaterial();
    static plane = new Plane();
}