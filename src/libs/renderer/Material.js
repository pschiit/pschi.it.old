import Node from'../core/Node';

export default class Material extends Node {
    /** Create a new Material
    */
    constructor(){
        super();

        this.culling = Material.culling.back;
        this.depth = Material.depth.less;
        this.fog = true;

        this.directionalLigthsCount = 0;
        this.pointLigthsCount = 0;
        this.spotLigthsCount = 0;
    }

    get texture() {
        return this.parameters[Material.textureName];
    }

    set texture(v) {
        this.setParameter(Material.textureName, v);
    }

    setParameter(name, value) {
        this.parameters[name] = value;
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