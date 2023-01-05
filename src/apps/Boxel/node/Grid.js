import Node3d from '../../../libs/3d/Node3d';
import Plane from '../../../libs/math/Plane';
import GridBuffer from '../buffer/GridBuffer';
import GridMaterial from '../material/GridMaterial';

export default class Grid extends Node3d{
    constructor(){
        super();
        this.vertexBuffer = Grid.vertexBuffer;
        this.material = Grid.material;
    }

    intersect(ray){
        const intersection = ray.intersectPlane(Grid.plane);
        return intersection?.floor();
    }

    static vertexBuffer = new GridBuffer();
    static material = new GridMaterial();
    static plane = new Plane();
}