import Color from '../../core/Color';
import Material from '../../renderer/Material';

export default class PhongMaterial extends Material {
    constructor() {
        super();
        this.ambientColor = Color.white;
        this.diffuseColor = Color.white;
        this.specularColor = Color.white;
        this.emissive = Color.black;

        this.shininess = 32;
    }

    static ambientColorName = "materialAmbientColor";
    static diffuseColorName = "materialDiffuseColor";
    static specularColorName = "materialSpecularColor";
    static emissiveColorName = "materialEmissiveColor";
    static shininessName = "materialShininess";
}