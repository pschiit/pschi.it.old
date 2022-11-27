import Node from'../core/Node';

export default class  Material extends Node {
    /** Create a new Material
    */
    constructor(){
        super();
        this.texture = null;
        this.fog = true;
        this.colorNormal = false;
        this.directionalLigthsCount = 0;
        this.pointLigthsCount = 0;
        this.spotLigthsCount = 0;
    }

    static textureName = 'texture';
}