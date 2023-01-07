import Node3d from '../../../libs/3d/Node3d';
import Box from '../../../libs/math/Box';
import BoxelBuffer from '../buffer/BoxelBuffer';
import BoxelMaterial from '../material/BoxelMaterial';

export default class BoxelSprite extends Node3d {
    constructor() {
        super();
        this.vertexBuffer = new BoxelBuffer();
        this.material = BoxelSprite.material;
        this.boxels = {};
        this.boundingBox = new Box();

        this.updated = false;
        this.boxelCount = 0;
    }

    intersect(ray) {
        return ray.intersectBox(this.boundingBox);
    }

    get(x, y, z) {
        if (x.length > 0) {
            z = x[2];
            y = x[1];
            x = x[0];
        }
        return this.boxels[x] && this.boxels[x][y] && this.boxels[x][y][z] ? this.boxels[x][y][z] : null;
    }

    set(boxel) {
        const x = boxel.position[0];
        const y = boxel.position[1];
        const z = boxel.position[2];
        if (!this.boxels[x]) {
            this.boxels[x] = {};
        }
        if (!this.boxels[x][y]) {
            this.boxels[x][y] = {};
        }
        if (this.boxels[x][y][z] != boxel.color) {
            this.boxels[x][y][z] = boxel;
            this.updated = true;
            if (boxel) {
                this.boxelCount++;
                this.boundingBox.union(boxel.boundingBox);
            } else {
                this.boxelCount--;
            }
        }
    }

    setScene(parameters) {
        super.setScene(parameters);
        if (this.updated) {
            const positions = new Float32Array(this.boxelCount * 3);
            const colors = new Float32Array(this.boxelCount * 4);
            let iPositions = 0;
            let iColors = 0;
            for (const x in this.boxels) {
                for (const y in this.boxels[x]) {
                    for (const z in this.boxels[x][y]) {
                        const boxel = this.boxels[x][y][z];
                        positions[iPositions++] = boxel.position[0]
                        positions[iPositions++] = boxel.position[1];
                        positions[iPositions++] = boxel.position[2];
                        colors[iColors++] = boxel.color[0];
                        colors[iColors++] = boxel.color[1];
                        colors[iColors++] = boxel.color[2];
                        colors[iColors++] = boxel.color[3];
                    }
                }
            }
            this.vertexBuffer.instancePosition = positions;
            this.vertexBuffer.instanceColor = colors;
            this.updated = false;
        }
    }

    static material = new BoxelMaterial();
}