import BoxTile from './BoxTile';

export default class BoxSprite {
    constructor(tiles = new BoxTile()) {
        const sprite = [];
        let index = -1;
        const position = new Int32Array(3);

        /** Set the position of the BoxSprite from a Vector3
         * @param {Int32Array} vector position
         * @return the updated BoxSprite
        */
        this.setPosition = (vector) => {
            position.set(vector);

            return this;
        }

        /** get the position of the BoxSprite as a Vector3
         * @return {Int32Array} position
        */
        this.getPosition = () => {
            return position;
        }

        /** Translate the BoxSprite by a Uint8Vector3
         * @param {Int32Array} vector translation
         * @return the updated BoxSprite
        */
        this.translate = (vector) => {
            position[0] += vector[0];
            position[1] += vector[1];
            position[2] += vector[2];

            return this;
        }

        this.add = (tile) => {
            if (index == sprite.length - 1) {
                sprite.push(tile);
            } else {
                sprite.splice(index, 0, [tile]);
            }
            index++;

            return this;
        }

        this.remove = (tileIndex) => {
            if (index == tileIndex) {
                index--;
            }
            return sprite.splice(tileIndex, 1);
        }

        this.setTileIndex = (v) => {
            if (v >= 0 && v < frames.length) {
                index = v
            }

            return this;
        }

        this.getTileIndex = () => {
            return index;
        }

        this.previousTile = (v) => {
            this.setTileIndex(index - 1);

            return this;
        }

        this.nextTile = (v) => {
            this.setTileIndex(index + 1);

            return this;
        }

        this.emptySprite = () => {
            if (index > -1) {
                sprite.splice(0, sprite.length);
                index = -1;
                this.add(new BoxTile());
            }

            return this;
        }

        this.loadSprite = (tiles) => {
            if (index > -1) {
                sprite.splice(0, sprite.length);
                index = -1;
            }
            tiles.forEach(t => {
                this.add(t);
            })

            return this;
        }
        if (tiles) {
            if (Array.isArray(tiles)) {
                this.loadSprite(tiles);
            } else {
                this.add(tiles);
            }
        }

        //tile interface
        this.read = (position) => {
            return sprite[index]?.read(position);
        }

        this.write = (position, color) => {
            return sprite[index]?.write(position, color);
        }

        this.empty = () => {
            sprite[index]?.empty();

            return this;
        }

        this.getBoundingBox = () => {
            const box = sprite[index]?.getBoundingBox();
            if(box){
                box.translate(position);
            }
            return box;
        }

        this.load = (boxes) => {
            sprite[index]?.load(boxes);

            return this;
        }

        this.getBoxes = () => {
            return sprite[index]?.getBoxes();
        }
    }
}