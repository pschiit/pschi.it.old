import Node3d from '../../../libs/3d/Node3d';
import Color from '../../../libs/core/Color';
import Box from '../../../libs/math/Box';
import Plane from '../../../libs/math/Plane';
import Ray from '../../../libs/math/Ray';
import Vector3 from '../../../libs/math/Vector3';
import InstanceBuffer from '../../../libs/renderer/graphics/buffer/InstanceBuffer';
import BoxelBuffer from '../buffer/BoxelBuffer';
import BoxelLightMaterial from '../material/BoxelLightMaterial';
import Boxel from './Boxel';

export default class SpriteEditor extends Node3d {
    constructor() {
        super();
        this.vertexBuffer = new InstanceBuffer(new BoxelBuffer());
        this.material = new BoxelLightMaterial();
        const spriteBox = new Box();
        const map = new Map();
        const colors = [];
        let updated = false;

        const previousState = [];
        this.undo = () => {
            if (previousState.length > 0) {
                const action = previousState.pop();
                const newAction = set(action.position, action.color);
                if (newAction) {
                    nextState.unshift(newAction);
                    updated = true;
                }
            }
        }
        const nextState = [];
        this.redo = () => {
            console.log(nextState);
            if (nextState.length > 0) {
                const action = nextState.splice(0, 1);
                const newAction = set(action[0].position, action[0].color);
                if (newAction) {
                    previousState.push(newAction);
                    updated = true;
                }
            }
        }

        this.clear = () => {
            map.clear();
            previousState.splice(0, previousState.length);
            nextState.splice(0, nextState.length);
            updated = true;
        }

        this.read = (position) => {
            if(position instanceof Ray){
                position = intersect(this.ray);
            }
            const key = getKey(position);
            if (key) {
                return map.get(key)?.clone();
            }
            return null;
        }

        this.write = (position, color) => {
            const action = set(position, color);
            if (action) {
                updated = true;
                previousState.push(action);
                if (nextState.length > 0) {
                    nextState.splice(0, nextState.length);
                }
            }
            return updated;
        }

        this.raycastBoxel = (ray, color, add = false) => {
            const intersection = intersect(ray, add);
            if (intersection) {
                intersection.floor();
                this.write(intersection, color);
            }

            return null;
        }

        this.setScene = (parameters) => {
            super.setScene(parameters);
            if (updated) {
                const length = map.size;
                const positions = new Int8Array(length * 3);
                const colors = new Uint8Array(length * 3);
                let index = 0;
                for (const [key, color] of map) {
                    positions.set(getPosition(key), index);
                    colors.set(color.toVector3().scale(255).toUint8(), index);
                    index += 3;
                }
                this.vertexBuffer.instancePosition = positions;
                this.vertexBuffer.instanceColor = colors;
                updated = false;
            }
        }

        this.toJSON = () => {
            return JSON.stringify({
                position: this.vertexBuffer.instancePosition.data,
                colors: this.vertexBuffer.instanceColor.data
            });
        }

        this.save = () => {
            return this.vertexBuffer.instanceArrayBuffer.data;
        }

        this.load = (arrayBuffer) => {
            this.clear();
            const positions = new Int8Array(arrayBuffer);
            const colors = new Uint8Array(arrayBuffer);
            console.log('arrayBuffer',arrayBuffer);
            console.log('positions',arrayBuffer);
            console.log('colors',arrayBuffer);

            for (let i = 0; i < positions.byteLength; i += 6) {
                vector3[0] = positions[i];
                vector3[1] = positions[i + 1];
                vector3[2] = positions[i + 2];

                color[0] = colors[i + 3] / 255;
                color[1] = colors[i + 4] / 255;
                color[2] = colors[i + 5] / 255;
                set(vector3,color);
            }
        }

        function set(position, color) {
            const key = getKey(position);
            if (key) {
                const action = {
                    position: position,
                    color: map.get(key),
                };
                if (color) {
                    let boxelColor = colors.find(c => c.equals(color));
                    if (!boxelColor) {
                        boxelColor = color.clone();
                        colors.push(boxelColor);
                    }
                    if (action.color != boxelColor) {
                        map.set(key, boxelColor);
                        if (!action.color) {
                            box.setFromMinAndScalar(position, size);
                            spriteBox.union(box);
                        }

                        return action;
                    }
                } else {
                    if (action.color) {
                        map.delete(key);

                        return action;
                    }
                }
            }
            return null;
        }

        function intersect(ray, addNormal = false) {
            let intersection = addNormal ? ray.intersectPlane(planeXZ) : null;
            let distance = Infinity;
            const spriteIntersection = ray.intersectBox(spriteBox);
            if (spriteIntersection) {
                for (const key of map.keys()) {
                    box.setFromMinAndScalar(getPosition(key), size);
                    const boxelIntersection = ray.intersectBox(box);
                    if (boxelIntersection) {
                        let boxelDistance = boxelIntersection.distance(ray.origin);
                        if (boxelDistance < distance) {
                            distance = boxelDistance;
                            intersection = boxelIntersection;
                            if (addNormal) {
                                intersection.add(box.normalFrom(boxelIntersection).scale(0.5));
                            } else {
                                intersection.add(box.normalFrom(boxelIntersection).scale(-0.5));
                            }
                        }
                    }
                }
            }

            return intersection;
        }
    }
}

function getKey(position) {
    return Math.abs(position[0]) > halfSize
        || Math.abs(position[1]) > halfSize
        || Math.abs(position[2]) > halfSize ? null
        : `${position[0]}.${position[1]}.${position[2]}`;
}
function getPosition(key) {
    return key.split('.').map(i => parseInt(i));
}
const planeXZ = new Plane();
const halfSize = 127;
const size = Boxel.size;
const box = new Box();
const vector3 = new Vector3();
const color = new Color(0, 0, 0, 1);