import Node3d from '../../../libs/3d/Node3d';
import Box from '../../../libs/math/Box';
import Plane from '../../../libs/math/Plane';
import BoxelBuffer from '../buffer/BoxelBuffer';
import BoxelLightMaterial from './BoxelLightMaterial';

export default class BoxelSprite extends Node3d {
    constructor() {
        super();
        this.vertexBuffer = new BoxelBuffer();
        this.material = new BoxelLightMaterial();
        this.boxels = {};
        this.boundingBox = new Box();
        this.updated = false;
        this.size = 256;
    }

    get count() {
        return Object.keys(this.boxels).length;
    }

    intersect(ray, addBoxelNormal = false, intersectPlaneXZ = false) {
        let intersection = intersectPlaneXZ ? ray.intersectPlane(planeXZ) : null;
        let distance = Infinity;
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
                        if (addBoxelNormal) {
                            intersection.add(boxel.normalFrom(boxelIntersection).scale(0.5));
                        }
                    }
                }
            }
        }

        return intersection;
    }

    set(boxel) {
        const key = getKey(boxel.position);
        if (key) {
            this.boxels[key] = boxel;
            this.boundingBox.union(boxel);
            this.updated = true;

            return boxel;
        }
        console.log('out of bound');
        return null;
    }

    search(position) {
        const key = getKey(position);
        if (key) {
            return this.boxels[key];
        }
        return null;
    }

    delete(position) {
        const key = getKey(position);
        if (key) {
            const removed = this.boxels[key];
            this.boxels[key] = null;
            this.updated = true;

            return removed;
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
                colors.set(boxel.color.toVector3().scale(255).toUint8(), index);
            }
            this.vertexBuffer.instancePosition = positions;
            this.vertexBuffer.instanceColor = colors;
            this.updated = false;
        }
    }
}

function getKey(position) {
    return Math.abs(position[0]) > halfSize
        || Math.abs(position[1]) > halfSize
        || Math.abs(position[2]) > halfSize ? null
        : `${position[0]}.${position[1]}.${position[2]}`;
}
const planeXZ = new Plane();
const halfSize = 127;