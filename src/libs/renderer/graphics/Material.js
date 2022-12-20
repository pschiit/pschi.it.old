import GraphicsNode from './GraphicsNode';
import Parameter from './shader/Parameter';

export default class Material extends GraphicsNode {
    /** Create a new Material
    */
    constructor(vertexShader, fragmentShader){
        super();

        this.culling = Material.culling.back;
        this.depth = Material.depth.less;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.fog = true;
    }

    get compiled(){
        return this.vertexShader?.compiled && this.fragmentShader?.compiled;
    }

    get texture() {
        return this.parameters[Material.parameters.texture];
    }

    set texture(v) {
        this.setParameter(Material.parameters.texture, v);
    }
    
    setScene(scene){
        if (!scene.materials[this.id]) {
            scene.materials[this.id] = this;
        }
        const texture = this.texture;
        if (texture && !scene.textures[texture.id]) {
            scene.textures[texture.id] = texture;
        }
    }

    static parameters = {
        texture: Parameter.texture('texture',Parameter.qualifier.const)
    };

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