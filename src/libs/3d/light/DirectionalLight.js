import Light from'./Light';

export default class  DirectionalLight extends Light {
    constructor(color, position, target) {
        super(color);
        this.translate(position);
        this.lookAt(target);
    }

    get direction(){
        return this.position.clone().substract(this.target);
    }
    static lightColorName = 'directionalLightColor';
    static lightDirectionName = 'directionalLightDirection';
}