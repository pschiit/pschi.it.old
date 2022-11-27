import Color from '../../core/Color';
import Material from '../../renderer/Material';

export default class PhongMaterial extends Material {
    constructor() {
        super();
        this.ambientColor = Color.white;
        this.diffuseColor = Color.white;
        this.specularColor = Color.white;
        this.emissiveColor = Color.black;

        this.shininess = 32;
    }

    get ambientColor() {
        return this.parameters[PhongMaterial.ambientColorName];
    }

    set ambientColor(v) {
        this.setParameter(PhongMaterial.ambientColorName, v);
    }

    get ambientTexture() {
        return this.parameters[PhongMaterial.ambientTextureName];
    }

    set ambientTexture(v) {
        this.setParameter(PhongMaterial.ambientTextureName, v);
    }

    get diffuseColor() {
        return this.parameters[PhongMaterial.diffuseColorName];
    }

    set diffuseColor(v) {
        this.setParameter(PhongMaterial.diffuseColorName, v);
    }

    get diffuseTexture() {
        return this.parameters[PhongMaterial.diffuseTextureName];
    }

    set diffuseTexture(v) {
        this.setParameter(PhongMaterial.diffuseTextureName, v);
    }

    get specularColor() {
        return this.parameters[PhongMaterial.specularColorName];
    }

    set specularColor(v) {
        this.setParameter(PhongMaterial.specularColorName, v);
    }

    get specularTexture() {
        return this.parameters[PhongMaterial.specularTextureName];
    }

    set specularTexture(v) {
        this.setParameter(PhongMaterial.specularTextureName, v);
    }

    get emissiveColor() {
        return this.parameters[PhongMaterial.emissiveColorName];
    }

    set emissiveColor(v) {
        this.setParameter(PhongMaterial.emissiveColorName, v);
    }

    get emissiveTexture() {
        return this.parameters[PhongMaterial.emissiveTextureName];
    }

    set emissiveTexture(v) {
        this.setParameter(PhongMaterial.emissiveTextureName, v);
    }

    get shininess() {
        return this.parameters[PhongMaterial.shininessName];
    }

    set shininess(v) {
        this.setParameter(PhongMaterial.shininessName, v);
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