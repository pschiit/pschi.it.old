import GraphicsNode from './GraphicsNode';
import Parameter from './shader/Parameter';

export default class Material extends GraphicsNode {
    /** Create a new Material
    */
    constructor(vertexShader, fragmentShader){
        super();

        this.culling = null;
        this.depth = null;
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
    }

    static parameters = {
        texture: Parameter.texture('texture',Parameter.qualifier.const),
        backgroundColor: Parameter.vector3('backgroundColor', Parameter.qualifier.const),
        
        position: Parameter.vector4('vertexPosition', Parameter.qualifier.let),
        normal: Parameter.vector4('vertexNormal', Parameter.qualifier.let),
        color: Parameter.vector4('vertexColor', Parameter.qualifier.let),
        uv: Parameter.vector2('vertexUV', Parameter.qualifier.let),
        
        vertexMatrix: Parameter.matrix4('vertexMatrix', Parameter.qualifier.const),
        normalMatrix: Parameter.matrix4('normalMatrix', Parameter.qualifier.const),
        colorId: Parameter.vector3('colorId', Parameter.qualifier.const),
        
        projectionMatrix: Parameter.matrix4('projectionMatrix', Parameter.qualifier.const),
        cameraPosition: Parameter.vector3('cameraPosition', Parameter.qualifier.const),
        fogDistance: Parameter.vector2('fogDistance', Parameter.qualifier.const),
    };

    static culling = {
        front: 'front',
        back: 'back',
        doubleside: 'doubleside'
    }

    static depth = {
        never: 'never',
        always:'always',
        equal:'equal',
        notEqual:'notEqual',
        less: 'less',
        lessEqual:'lessEqual',
        greater: 'greater',
        greaterEqual:'greaterEqual',
    }
}