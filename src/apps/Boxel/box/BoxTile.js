import Box from '../../../libs/math/Box';
import Vector3 from '../../../libs/math/Vector3';
import Int8Vector3 from './Int8Vector3';

export default class BoxTile {
    constructor(boxes) {
        const box = new Box();
        const tile = new Map();

        this.read = (position) => {
            int8Vector3.set(position);
            return tile.get(int8Vector3.hex);
        }

        this.write = (position, color) => {
            int8Vector3.set(position);
            const key = int8Vector3.hex;
            if (color) {
                const existing = tile.get(key);
                if (!existing) {
                    testingBox.position = int8Vector3;
                    box.union(testingBox);
                    tile.set(key, color);

                    return true;
                } else if (existing != color) {
                    tile.set(key, color);
                    return true;
                }
            } else if (tile.has(key)) {
                tile.delete(key);
                box.empty();
                return true;
            }

            return false;
        }

        this.empty = () => {
            if (tile.size > 0) {
                tile.clear();
                box.empty();
            }

            return this;
        }

        this.getBoundingBox = () => {
            if (box.isEmpty) {
                for (const hex of tile.keys()) {
                    int8Vector3.hex = hex;
                    testingBox.position = int8Vector3;
                    box.union(testingBox);
                }
            }
            return box.clone();
        }

        this.load = (boxes) => {
            this.empty();
            if (boxes instanceof BoxTile) {
                boxes = boxes.getBoxes();
            }
            for (const [hex, color] of boxes) {
                int8Vector3.hex = hex;
                this.write(int8Vector3, color);
            }

            return this;
        }

        if (boxes) {
            this.load(boxes);
        }

        this.getBoxes = () => {
            return tile;
        }
    }
}
const int8Vector3 = new Int8Vector3();
const testingBox = new Box(new Vector3(), new Vector3(1, 1, 1));