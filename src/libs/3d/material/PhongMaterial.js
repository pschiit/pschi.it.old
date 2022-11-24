import Material from './Material';

export default class PhongMaterial extends Material {
    constructor() {
        super();
        this.shininess = 32;
        this.directionalLigthsCount = 0;
        this.pointLigthsCount = 0;
    }
    static shininessName = "materialShininess";
}