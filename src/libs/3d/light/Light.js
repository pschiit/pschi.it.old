import GraphicsNode from '../../renderer/graphics/GraphicsNode';
import LightMaterial from '../material/LightMaterial';

export default class Light extends GraphicsNode{
    constructor(color, ambientStrength = 0.1, intensity = 1){
        super();
        this.color = color;
        this.ambientStrength = ambientStrength;
        this.intensity = intensity;
    }

    get on() {
        return this.intensity > 0;
    }
}