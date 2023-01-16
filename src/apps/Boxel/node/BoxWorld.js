import BoxBuffer from '../../../libs/3d/buffer/BoxBuffer';
import InstanceLightMaterial from '../../../libs/3d/material/InstanceLightMaterial';
import Node3d from '../../../libs/3d/Node3d';
import Box from '../../../libs/math/Box';
import Matrix4 from '../../../libs/math/Matrix4';
import Vector3 from '../../../libs/math/Vector3';
import InstanceBuffer from '../../../libs/renderer/graphics/buffer/InstanceBuffer';
import Int8Vector3 from '../box/Int8Vector3';

export default class BoxWorld extends Node3d {
    constructor(sprites = []) {
        super(material, new InstanceBuffer(buffer));
        this.sprites = sprites;
    }

    setScene(parameters) {
        super.setScene(parameters);
        if (this.sprites.length > 0) {
            const boxes = new Map();
            this.sprites.forEach(sprite => {
                const spritePosition = sprite.getPosition();
                const spriteBox = sprite.getBoundingBox();
                spriteBox.intersect(worldBox);
                if (!spriteBox.isEmpty) {
                    vector3.set(spritePosition).negate();
                    spriteBox.translate(vector3);
                    for (let x = spriteBox.min[0]; x < spriteBox.max[0]; x++) {
                        for (let y = spriteBox.min[1]; y < spriteBox.max[1]; y++) {
                            for (let z = spriteBox.min[2]; z < spriteBox.max[2]; z++) {
                                int8Vector3[0] = x;
                                int8Vector3[1] = y;
                                int8Vector3[2] = z;
                                const color = sprite.read(int8Vector3);
                                if (color) {
                                    int8Vector3.add(spritePosition);
                                    boxes.set(int8Vector3.hex, color);
                                }
                            }
                        }
                    }
                }
            });
            const length = boxes.size;
            const positions = new Int8Array(length * 3);
            const colors = new Uint8Array(length * 3);
            let index = 0;
            for (const [hex, color] of boxes) {
                int8Vector3.hex = hex;
                positions[index] = int8Vector3[0];
                positions[index + 1] = int8Vector3[1];
                positions[index + 2] = int8Vector3[2];
                colors[index] = color[0];
                colors[index + 1] = color[1];
                colors[index + 2] = color[2];
                index += 3;
            }
            this.vertexBuffer.instancePosition = positions;
            this.vertexBuffer.instanceColor = colors;
        } else {
            if (this.vertexBuffer.instancePosition.length > 0) {
                this.vertexBuffer.instancePosition = new Int8Array();
            }
            if (this.vertexBuffer.instanceColor.length > 0) {
                this.vertexBuffer.instanceColor = new Uint8Array();
            }
        }
    }
}
const vector3 = new Vector3();
const worldBox = new Box(new Vector3(-128, -128, -128), new Vector3(127, 127, 127));
const buffer = new BoxBuffer(1, 1, 1, 0.03);
const material = new InstanceLightMaterial();
buffer.position.transform(Matrix4.identityMatrix().translate(new Vector3(0.5, 0.5, 0.5)));

const int8Vector3 = new Int8Vector3();