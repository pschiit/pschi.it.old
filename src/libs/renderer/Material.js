import Node from'../core/Node';

export default class Material extends Node {
    /** Create a new Material
    */
    constructor(){
        super();
        this.culling = Material.culling.back;
        this.depth = Material.depth.less;
        this.texture = null;
        this.fog = true;

        this.directionalLigthsCount = 0;
        this.pointLigthsCount = 0;
        this.spotLigthsCount = 0;
    }

    static textureName = 'texture';

    static culling = {
        front: 'front',
        back: 'back',
        doubleside: 'doubleside'
    }

    static depth = {
        never: '',
        always:'',
        equal:'',
        notEqual:'',
        less: '',
        lessEqual:'',
        greater: '',
        greaterEqual:'',
    }
}