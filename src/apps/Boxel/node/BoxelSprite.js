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
            distance = intersection.distance(ray.origin);
        }
        const spriteIntersection = ray.intersectBox(this.boundingBox);
        if (spriteIntersection) {
            for (const key in this.boxels) {
                const boxel = this.boxels[key];
                const boxelIntersection = ray.intersectBox(boxel);
                if (boxelIntersection) {
                    let boxelDistance = boxelIntersection.distance(ray.origin);
                    if (boxelDistance < distance) {
                        distance = boxelDistance;
                        intersection = boxelIntersection;
                        const normal = boxel.normalFrom(boxelIntersection);
                        intersection.add(normal.scale(0.5));
                    }
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
            const positions = new Int8Array(values.length * 3);
            const colors = new Uint8Array(values.length * 3);
            for (let i = 0; i < values.length; i++) {
                const boxel = values[i];
                const index = i * 3;
                positions[index] = boxel.position[0];
                positions[index + 1] = boxel.position[1];
                positions[index + 2] = boxel.position[2];
                colors.set(boxel.color.toUint8(),index);
            }
            this.vertexBuffer.instancePosition = positions;
            this.vertexBuffer.instanceColor = colors;
            this.updated = false;
        }
    }
}

function getKey(position) {
    return `${position[0]}.${position[1]}.${position[2]}`;
}
const planeXZ = new Plane();
const size = Boxel.size;