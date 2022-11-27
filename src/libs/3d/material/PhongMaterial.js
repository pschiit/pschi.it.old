import Color from '../../core/Color';
import Material from '../../renderer/Material';

export default class PhongMaterial extends Material {
    constructor() {
        super();
        this.ambientColor = Color.white;
        this.ambientTexture = null;
        this.diffuseColor = Color.white;
        this.diffuseTexture = null;
        this.specularColor = Color.white;
        this.specularTexture = null;
        this.emissiveColor = Color.black;
        this.emissiveTexture = null;

        this.shininess = 32;
    }

    static ambientColorName = "materialAmbientColor";
    static diffuseColorName = "materialDiffuseColor";
    static specularColorName = "materialSpecularColor";
    static emissiveColorName = "materialEmissiveColor";

    static ambientTextureName = "materialAmbientTexture";
    static diffuseTextureName = "materialDiffuseTexture";
    static specularTextureName = "materialSpecularTexture";
    static emissiveTextureName = "materialEmissiveTexture";
    
    static shininessName = "materialShininess";
}