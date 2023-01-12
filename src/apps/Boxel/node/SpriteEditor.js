import VertexBufferManager from '../../../libs/3d/buffer/VertexBufferManager';
import OrthographicCamera from '../../../libs/3d/camera/OrthographicCamera';
import DirectionalLight from '../../../libs/3d/light/DirectionalLight';
import Grid from '../../../libs/3d/node/Grid';
import Node3d from '../../../libs/3d/Node3d';
import Color from '../../../libs/core/Color';
import Box from '../../../libs/math/Box';
import Plane from '../../../libs/math/Plane';
import Vector2 from '../../../libs/math/Vector2';
import Vector3 from '../../../libs/math/Vector3';
import InstanceBuffer from '../../../libs/renderer/graphics/buffer/InstanceBuffer';
import BoxelBuffer from '../buffer/BoxelBuffer';
import BoxelLightMaterial from '../material/BoxelLightMaterial';
import Boxel from './Boxel';

export default class SpriteEditor extends OrthographicCamera {
    constructor() {
        super();
        const bufferManager = new VertexBufferManager();

        //World
        const world = new Node3d();

        //camera
        const camera = this;
        const orbit = new Node3d();
        world.appendChild(orbit);
        orbit.translate(0, 0, 0);
        camera.zoom = 128;
        orbit.appendChild(camera);
        camera.target = orbit;
        //update
        let updateGrid = true;
        let previousScale = 0;
        this.update = (renderTarget, zoom, cameraMovement, orbitMovement) => {
            if (!renderTarget.backgroundColor.equals(backgroundColor)){
                renderTarget.backgroundColor.set(backgroundColor);
            }

            const scale = renderTarget.maxY * 0.5;

            if (camera.top != scale) {
                camera.top = scale;
                camera.translate(new Vector3(-previousScale, -previousScale, +previousScale)).translate(new Vector3(scale, scale, -scale));
                //camera.aspectRatio = aspectRatio;
                previousScale = scale;
            }
            if (zoom) {
                camera.zoom += zoom;
                zoom = 0;
                updateGrid = true;
            }
            if (camera.zoom > scale) {
                camera.zoom = scale;
            } else if (camera.zoom < 6) {
                camera.zoom = 6;
            }
            if (updateGrid) {
                grid.fading = scale / camera.zoom * 4;
                updateGrid = false;
            }
            let cameraTranslation = new Vector3();
            if (cameraMovement[0]) {
                cameraTranslation.add(camera.xAxis.scale(cameraMovement[0]));
            }
            if (cameraMovement[1]) {
                cameraTranslation.add(camera.yAxis.scale(cameraMovement[1]));
            }
            if (cameraTranslation[0] || cameraTranslation[2]) {
                camera.translate(cameraTranslation);
                cameraMovement.scale(0);
            }

            let orbitTranslation = new Vector3();
            if (orbitMovement[0]) {
                orbitTranslation.add(camera.xAxis.scale(orbitMovement[0] / camera.zoom));
            }
            if (orbitMovement[1]) {
                orbitTranslation.add(camera.yAxis.scale(orbitMovement[1] / camera.zoom));
            }
            if (orbitTranslation[0] || orbitTranslation[2]) {
                orbit.translate(orbitTranslation);
                orbitMovement.scale(0);
            }
        }

        // light
        const sun = new DirectionalLight(
            Color.white(),
            new Vector3(-256, 256, -256),
            new Vector3());
        world.appendChild(sun);
        //grid
        const grid = new Grid(camera);
        world.appendChild(grid);
        grid.material.sizes = new Vector2(1, 10);
        bufferManager.add(grid.vertexBuffer);

        const sprite = new Node3d();
        sprite.vertexBuffer = new InstanceBuffer(new BoxelBuffer());
        sprite.material = new BoxelLightMaterial();
        world.appendChild(sprite);
        bufferManager.add(sprite.vertexBuffer);

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
            if (position instanceof Vector2) {
                const ray = camera.raycast(position.toVector3());
                position = intersect(ray)
                if(!position){
                    return null;
                }
                position.floor();
            }
            const key = getKey(position);
            if (key) {
                return map.get(key)?.clone();
            }
            return null;
        }

        this.write = (position, color, add = false) => {
            if (position instanceof Vector2) {
                const ray = camera.raycast(position.toVector3());
                position = intersect(ray,add);
                if(!position){
                    return null;
                }
                position.floor();
            }
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

        this.save = () => {
            return this.vertexBuffer.instanceArrayBuffer.data;
        }

        this.load = (arrayBuffer) => {
            this.clear();
            const positions = new Int8Array(arrayBuffer);
            const colors = new Uint8Array(arrayBuffer);

            for (let i = 0; i < positions.byteLength; i += 6) {
                vector3[0] = positions[i];
                vector3[1] = positions[i + 1];
                vector3[2] = positions[i + 2];

                color[0] = colors[i + 3] / 255;
                color[1] = colors[i + 4] / 255;
                color[2] = colors[i + 5] / 255;
                set(vector3, color);
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
                sprite.vertexBuffer.instancePosition = positions;
                sprite.vertexBuffer.instanceColor = colors;
                updated = false;
            }
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
const color = Color.black();
const backgroundColor = Color.white();