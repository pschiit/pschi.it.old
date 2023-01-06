import Node3d from '../../../libs/3d/Node3d';
import Color from '../../../libs/core/Color';
import Vector2 from '../../../libs/math/Vector2';
import BoxelBuffer from '../buffer/BoxelBuffer';
import BoxelMaterial from '../material/BoxelMaterial';

export default class BoxelSprite extends Node3d {
    constructor() {
        super();
        this.vertexBuffer = new BoxelBuffer();
        this.material = BoxelSprite.material;
        this.colors = {};

        this.updated = false;
        this.boxelCount = 0;

        this.x = new Vector2();
        this.y = new Vector2();
        this.z = new Vector2();
    }

    set(position, color = Color.white()) {
        const x = position[0];
        const y = position[1];
        const z = position[2];
        if (!this.colors[x]) {
            this.colors[x] = {};
        }
        if (!this.colors[x][y]) {
            this.colors[x][y] = {};
        }
        if (this.colors[x][y][z] != color) {
            this.colors[x][y][z] = color;
            this.updated = true;
            if(color){
                this.boxelCount++;
                if(x < this.x[0]){
                    this.x[0] = x;
                } else if(x > this.x[1]){
                    this.x[1] = x;
                }
                if(y < this.y[0]){
                    this.y[0] = y;
                } else if(y > this.y[1]){
                    this.y[1] = y;
                }
                if(z < this.z[0]){
                    this.z[0] = z;
                } else if(z > this.z[1]){
                    this.z[1] = z;
                }
            }else{
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
            for (const x in this.colors) {
                for (const y in this.colors[x]) {
                    for (const z in this.colors[x][y]) {
                        const color = this.colors[x][y][z];
                        positions[iPositions++] = Number(x);
                        positions[iPositions++] = Number(y);
                        positions[iPositions++] = Number(z);
                        colors[iColors++] = color[0];
                        colors[iColors++] = color[1];
                        colors[iColors++] = color[2];
                        colors[iColors++] = color[3];
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