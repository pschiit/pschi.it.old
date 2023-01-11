import Node3d from '../../../libs/3d/Node3d';
import Box from '../../../libs/math/Box';
import Plane from '../../../libs/math/Plane';
import BoxelBuffer from '../buffer/BoxelBuffer';
import InstanceBuffer from '../../../libs/renderer/graphics/buffer/InstanceBuffer';
import BoxelLightMaterial from '../material/BoxelLightMaterial';
import Boxel from './Boxel';

export default class BoxelSprite extends Node3d {
    constructor(boxels) {
        super();
        this.vertexBuffer = new InstanceBuffer(new BoxelBuffer());
        this.material = new BoxelLightMaterial();
        this.boxels = boxels || {};
        this.colors = [];
        this.boundingBox = new Box();
        this.updated = false;
    }

    get count() {
        return Object.keys(this.boxels).length;
    }

    intersect(ray, add = false) {
        let intersection = add ? ray.intersectPlane(planeXZ) : null;
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
                        if (add) {
                            intersection.add(boxel.normalFrom(boxelIntersection).scale(0.5));
                        } else {
                            intersection.add(boxel.normalFrom(boxelIntersection).scale(-0.5));
                        }
                    }
                }
            }
        }

        return intersection;
    }

    set(position, color) {
        const key = getKey(position);
        if (key) {
            let boxelColor = this.colors.find(c => c.equals(color));
            if (!boxelColor) {
                boxelColor = color.clone();
                this.colors.push(boxelColor);
            }
            let boxel = this.boxels[key];
            if (boxel) {
                boxel.color = boxelColor;
            } else {
                boxel = new Boxel(position, boxelColor)
                this.boxels[key] = boxel;
                this.boundingBox.union(boxel);
            }
            this.updated = true;
            return boxel;
        }
        console.log('cannot set : position', position, 'color', color);
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
            if (removed) {
                delete this.boxels[key];
                this.updated = true;
            }
            return removed;
        }
        return null;
    }

    raycastBoxel(ray, color, add = false) {
        const intersection = this.intersect(ray, add);
        if (intersection) {
            intersection.floor();
            if (color) {
                return this.set(intersection, color);
            } else {
                return this.delete(intersection);
            }
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

    toJSON() {
        return JSON.stringify(this.boxels);
    }

    static fromJSON(json) {
        return new BoxelSprite(JSON.parse(json));
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