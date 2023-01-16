import Box from '../../../libs/math/Box';
import Plane from '../../../libs/math/Plane';
import Ray from '../../../libs/math/Ray';
import BoxSprite from './BoxSprite';
import Int8Vector3 from './Int8Vector3';
import Uint8Vector3 from './Uint8Vector3';

export default class SpriteEditor {
    constructor(sprite = new BoxSprite()) {
        this.sprite = sprite;
        const palette = [];
        const previousState = [];
        const nextState = [];

        this.undo = () => {
            if (previousState.length > 0) {
                const action = previousState.pop();
                const newAction = {
                    position: action.position.clone(),
                    color: sprite.read(action.position)?.clone(),
                };
                sprite.write(action.position, action.color);
                if (newAction) {
                    nextState.unshift(newAction);
                }
            }
            return this;
        }

        this.redo = () => {
            if (nextState.length > 0) {
                const action = nextState.splice(0, 1)[0];
                const newAction = {
                    position: action.position.clone(),
                    color: sprite.read(action.position)?.clone(),
                };
                sprite.write(action.position, action.color);
                if (newAction) {
                    previousState.push(newAction);
                }
            }
            return this;
        }

        this.empty = () => {
            sprite.empty();
            previousState.splice(0, previousState.length);
            nextState.splice(0, nextState.length);
            return this;
        }

        this.read = (position) => {
            if (position instanceof Ray) {
                position = intersect(position);
                if (!position) {
                    return null;
                }
            }
            return position ? sprite.read(position)?.clone() : null;
        }

        this.write = (position, color, add = false) => {
            if (position instanceof Ray) {
                position = intersect(position, add);
                if (!position) {
                    return null;
                }
            }
            if (position) {
                const action = {
                    position: position.clone(),
                    color: sprite.read(position)?.clone(),
                };
                let paletteColor = palette.find(c => c.equals(color));
                if (color && !paletteColor) {
                    paletteColor = color.clone();
                    palette.push(paletteColor);
                }
                const result = sprite.write(position, paletteColor);
                if (result) {
                    previousState.push(action);
                    if (nextState.length > 0) {
                        nextState.splice(0, nextState.length);
                    }
                }
                return result;
            }
            return false;
        }

        this.save = () => {
            const boxes = sprite.getBoxes();
            const length = boxes.size * 6;
            const arrayBuffer = new ArrayBuffer(length);
            const positions = new Int8Array(arrayBuffer);
            const colors = new Uint8Array(arrayBuffer);
            let i = 0;
            for (const [hex, color] of boxes) {
                int8Vector3.hex = hex;
                positions[i] = int8Vector3[0];
                positions[i + 1] = int8Vector3[1];
                positions[i + 2] = int8Vector3[2];
                colors[i + 3] = color[0];
                colors[i + 4] = color[1];
                colors[i + 5] = color[2];
                i += 6;
            }
            return arrayBuffer;
        }

        this.load = (arrayBuffer) => {
            this.empty();
            const positions = new Int8Array(arrayBuffer);
            const colors = new Uint8Array(arrayBuffer);
            for (let i = 0; i < arrayBuffer.byteLength; i += 6) {
                int8Vector3[0] = positions[i];
                int8Vector3[1] = positions[i + 1];
                int8Vector3[2] = positions[i + 2];

                uint8Vector3[0] = colors[i + 3];
                uint8Vector3[1] = colors[i + 4];
                uint8Vector3[2] = colors[i + 5];

                let paletteColor = palette.find(c => c.equals(uint8Vector3));
                if (uint8Vector3 && !paletteColor) {
                    paletteColor = uint8Vector3.clone();
                    palette.push(paletteColor);
                }
                sprite.write(int8Vector3, paletteColor);
            }
            return this;
        }

        function intersect(ray, addNormal = false) {
            let intersection = addNormal ? ray.intersectPlane(planeXZ) : null;
            let distance = Infinity;
            const spriteIntersection = ray.intersectBox(sprite.getBoundingBox());
            if (spriteIntersection) {
                const position = sprite.getPosition();
                for (const hex of sprite.getBoxes().keys()) {
                    int8Vector3.hex = hex;
                    box.min.set(position);
                    box.min.add(int8Vector3);
                    box.max.set(box.min).addScalar(1);
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

            return intersection?.floor();
        }
    }
}
const planeXZ = new Plane();
const box = new Box();

const int8Vector3 = new Int8Vector3();
const uint8Vector3 = new Uint8Vector3();