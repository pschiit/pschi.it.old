import GraphicsNode from './GraphicsNode';
import Parameter from './shader/Parameter';

export default class Material extends GraphicsNode {
    /** Create a new Material
    */
    constructor(){
        super();

        this.culling = null;
        this.depth = null;
        this.vertexShader = null;
        this.fragmentShader = null
    }

    get compiled(){
        return this.vertexShader?.compiled && this.fragmentShader?.compiled;
    }

    static parameters = {
        backgroundColor: Parameter.vector3('backgroundColor', Parameter.qualifier.const),
        
        position: Parameter.vector4('vertexPosition', Parameter.qualifier.let),
        normal: Parameter.vector4('vertexNormal', Parameter.qualifier.let),
        color: Parameter.vector4('vertexColor', Parameter.qualifier.let),
        uv: Parameter.vector2('vertexUV', Parameter.qualifier.let),
        
        vertexMatrix: Parameter.matrix4('vertexMatrix', Parameter.qualifier.const),
        normalMatrix: Parameter.matrix4('normalMatrix', Parameter.qualifier.const),
        colorId: Parameter.vector3('colorId', Parameter.qualifier.const),
        
        texture: Parameter.texture('texture',Parameter.qualifier.const),
        textureProjectionMatrix: Parameter.matrix4('textureProjectionMatrix',Parameter.qualifier.const),
        
        projectionMatrix: Parameter.matrix4('projectionMatrix', Parameter.qualifier.const),
        cameraPosition: Parameter.vector3('cameraPosition', Parameter.qualifier.const),
        cameraTarget: Parameter.vector3('cameraTarget', Parameter.qualifier.const),
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