import Node3d from '../../../libs/3d/Node3d';
import Color from '../../../libs/core/Color';
import Box from '../../../libs/math/Box';
import Plane from '../../../libs/math/Plane';
import BoxelBuffer from '../buffer/BoxelBuffer';
import BoxelMaterial from '../material/BoxelMaterial';
import Boxel from './Boxel';

export default class BoxelSprite extends Node3d {
    constructor() {
        super();
        this.vertexBuffer = new BoxelBuffer();
        this.material = new BoxelMaterial();
        this.boxels = {};
        this.boundingBox = new Box();
        this.updated = false;
    }

    get count() {
        return Object.keys(this.boxels).length;
    }

    intersect(ray) {
        let intersection = ray.intersectPlane(planeXZ);
        let distance = 0;
        if (intersection) {
            ray.intersections.push(intersection.clone());
            distance = intersection.distance(ray.origin);
            if (distance < 0) {
                intersection[1] -= size;
                distance = -distance;
            }
        }
        for (const key in this.boxels) {
            const boxel = this.boxels[key];
            const boxelIntersection = ray.intersectBox(boxel);
            if (boxelIntersection) {
                ray.intersections.push(boxelIntersection.clone())
                let boxelDistance = boxelIntersection.distance(ray.origin);
                if (boxelDistance < 0) {
                    boxelDistance = -boxelDistance;
                }
                if (boxelDistance < distance) {
                    distance = boxelDistance;
                    intersection = boxelIntersection;
                    const normal = boxel.normalFrom(boxelIntersection);
                    console.log('normal', normal);
                    intersection.add(normal);
                    ray.intersections.push(intersection.clone())
                }
            }
        }

        return intersection;
    }

    search(position) {
        return this.boxels[getKey(position)];
    }

    set(boxel) {
        const key = getKey(boxel.position);
        this.boxels[key] = boxel;
        this.boundingBox.union(boxel);
        this.updated = true;


        return boxel;
    }

    delete(position) {
        const key = getKey(position);
        const removed = this.boxels[key];
        this.boxels[key] = null;
        this.updated = true;

        return removed;
    }

    setFromRay(ray, color = Color.random()) {
        const position = this.intersect(ray);
        if (position) {
            const boxel = new Boxel(position.floor(), color);
            this.set(boxel);
            return boxel;
        }
        return null;
    }

    setScene(parameters) {
        super.setScene(parameters);
        if (this.updated) {
            const values = Object.values(this.boxels);
            const positions = new Float32Array(values.length * 3);
            for (let i = 0; i < values.length; i++) {
                const boxel = values[i];
                const index = i * 3;
                positions[index] = boxel.position[0];
                positions[index + 1] = boxel.position[1];
                positions[index + 2] = boxel.position[2];
            }
            this.vertexBuffer.instancePosition = positions;
            this.updated = false;
        }
    }
}

function getKey(position) {
    return `${position[0]}.${position[1]}.${position[2]}`;
}
const planeXZ = new Plane();
const size = Boxel.size;