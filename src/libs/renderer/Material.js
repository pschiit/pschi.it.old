import Node from'../core/Node';

export default class  Material extends Node {
    /** Create a new Material
    */
    constructor(){
        super();
        this.texture = null;
    }

    static textureName = 'texture';
}