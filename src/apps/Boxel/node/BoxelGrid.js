import Node3d from '../../../libs/3d/Node3d';
import Plane from '../../../libs/math/Plane';
import GridBuffer from '../buffer/GridBuffer';
import BoxelGridMaterial from '../material/BoxelGridMaterial';

export default class BoxelGrid extends Node3d {
    constructor() {
        super();
        this.vertexBuffer = new GridBuffer();
        this.material = new BoxelGridMaterial();
        this.plane = new Plane();
    }

    get sizes() {
        return this.getParameter(BoxelGridMaterial.parameters.sizes);
    }

    set sizes(v) {
        this.setParameter(BoxelGridMaterial.parameters.sizes, v);
    }

    get distance() {
        return this.getParameter(BoxelGridMaterial.parameters.distance);
    }

    set distance(v) {
        this.setParameter(BoxelGridMaterial.parameters.distance, v);
    }

    get fading() {
        return this.getParameter(BoxelGridMaterial.parameters.fading);
    }

    set fading(v) {
        this.setParameter(BoxelGridMaterial.parameters.fading, v);
    }

    intersect(ray) {
        const intersection = ray.intersectPlane(this.plane);
        if (intersection) {
            const distanceToPoint = this.plane.distanceToPoint(ray.origin);
            if (distanceToPoint > 0) {
                intersection[1] -= 1;
            }
        }
        return intersection?.floor();
    }
}