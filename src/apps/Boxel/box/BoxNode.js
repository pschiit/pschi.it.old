import Box from '../../../libs/math/Box';
import IntVector3 from './Uint8Vector3';

export default class BoxNode {
    /** Create a new BoxNode
     * @param {IntVector3} position of Boxel
     * @param {IntVector3} color of Boxel 
    */
    constructor(color = new IntVector3(255, 255, 255), position = null) {
        color = color;
        position = position || new IntVector3();

        /** Set the color of the BoxNode from a Uint8Vector3
         * @param {IntVector3} vector color
         * @return the updated BoxNode
        */
        this.setColor = (vector) => {
            color.set(vector);

            return this;
        }

        /** get the position of the BoxNode as a Uint8Vector3
         * @return {IntVector3} position
        */
        this.getColor = () => {
            return color;
        }

        /** Set the position of the BoxNode from a Uint8Vector3
         * @param {IntVector3} vector position
         * @return the updated BoxNode
        */
        this.setPosition = (vector) => {
            position.set(vector);

            return this;
        }

        /** get the position of the BoxNode as a Uint8Vector3
         * @return {IntVector3} position
        */
        this.getPosition = () => {
            return position;
        }

        /** Translate the BoxNode by a Uint8Vector3
         * @param {IntVector3} vector translation
         * @return the updated BoxNode
        */
        this.translate = (vector) => {
            position.add(vector);

            return this;
        }

        /** Set all the value of the BoxNode to zero
         * @return the updated BoxNode
        */
        this.empty = () => {
            position.empty();
            color.empty();

            return this;
        }
        
        this.getBoundingBox = (box = new Box())=>{
            box.min.set(position);
            box.max.set(position).addScalar(1);

            return box;
        }
    }
}