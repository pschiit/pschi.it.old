import Color from '../../core/Color';
import Material from '../../renderer/graphics/Material';
import Parameter from '../../renderer/graphics/shader/Parameter';
import DirectionalLight from '../light/DirectionalLight';
import PointLight from '../light/PointLight';
import SpotLight from '../light/SpotLight';

export default class PhongMaterial extends Material {
    constructor() {
        super();
        this.ambientColor = Color.white;
        this.diffuseColor = Color.white;
        this.specularColor = Color.white;
        this.emissiveColor = Color.black;

        this.shininess = 32;

        this.directionalLigthsCount = 0;
        this.pointLigthsCount = 0;
        this.spotLigthsCount = 0;
    }

    get pointLigthsCount() {
        return this._pointLigthsCount;
    }

    set pointLigthsCount(v) {
        if (this.pointLigthsCount != v) {
            this._pointLigthsCount = v;
            this.compiled = false;
        }
    }

    get spotLigthsCount() {
        return this._spotLigthsCount;
    }

    set spotLigthsCount(v) {
        if (this.spotLigthsCount != v) {
            this._spotLigthsCount = v;
            this.compiled = false;
        }
    }

    get directionalLigthsCount() {
        return this._directionalLigthsCount;
    }

    set directionalLigthsCount(v) {
        if (this.directionalLigthsCount != v) {
            this._directionalLigthsCount = v;
            this.compiled = false;
        }
    }

    get ambientColor() {
        return this.parameters[PhongMaterial.parameters.ambientColor];
    }

    set ambientColor(v) {
        this.setParameter(PhongMaterial.parameters.ambientColor, v);
    }

    get diffuseColor() {
        return this.parameters[PhongMaterial.parameters.diffuseColor];
    }

    set diffuseColor(v) {
        this.setParameter(PhongMaterial.parameters.diffuseColor, v);
    }

    get specularColor() {
        return this.parameters[PhongMaterial.parameters.specularColor];
    }

    set specularColor(v) {
        this.setParameter(PhongMaterial.parameters.specularColor, v);
    }

    get emissiveColor() {
        return this.parameters[PhongMaterial.parameters.emissiveColor];
    }

    set emissiveColor(v) {
        this.setParameter(PhongMaterial.parameters.emissiveColor, v);
    }


    get ambientTexture() {
        return this.parameters[PhongMaterial.parameters.ambientTexture];
    }

    set ambientTexture(v) {
        this.setParameter(PhongMaterial.parameters.ambientTexture, v);
    }

    get diffuseTexture() {
        return this.parameters[PhongMaterial.parameters.diffuseTexture];
    }

    set diffuseTexture(v) {
        this.setParameter(PhongMaterial.parameters.diffuseTexture, v);
    }

    get specularTexture() {
        return this.parameters[PhongMaterial.parameters.specularTexture];
    }

    set specularTexture(v) {
        this.setParameter(PhongMaterial.parameters.specularTexture, v);
    }

    get emissiveTexture() {
        return this.parameters[PhongMaterial.parameters.emissiveTexture];
    }

    set emissiveTexture(v) {
        this.setParameter(PhongMaterial.parameters.emissiveTexture, v);
    }

    get shininess() {
        return this.parameters[PhongMaterial.parameters.shininess];
    }

    set shininess(v) {
        this.setParameter(PhongMaterial.parameters.shininess, v);
    }

    setScene(scene) {
        super.setScene(scene);
        this.pointLightsCount = scene.parameters[PointLight.parameters.ambientStrength]?.length || 0;
        this.directionalLigthsCount = scene.parameters[DirectionalLight.parameters.ambientStrength]?.length || 0;
        this.spotLigthsCount = scene.parameters[SpotLight.parameters.ambientStrength]?.length || 0;
    }

    static parameters = {
        ambientColor: Parameter.vector3('materialAmbientColor', Parameter.qualifier.const),
        diffuseColor: Parameter.vector3('materialDiffuseColor', Parameter.qualifier.const),
        specularColor: Parameter.vector3('materialSpecularColor', Parameter.qualifier.const),
        emissiveColor: Parameter.vector3('materialEmissiveColor', Parameter.qualifier.const),
        ambientTexture: Parameter.texture('materialAmbientTexture', Parameter.qualifier.const),
        diffuseTexture: Parameter.texture('materialDiffuseTexture', Parameter.qualifier.const),
        specularTexture: Parameter.texture('materialSpecularTexture', Parameter.qualifier.const),
        emissiveTexture: Parameter.texture('materialEmissiveTexture', Parameter.qualifier.const),
        shininess: Parameter.number('materialShininess', Parameter.qualifier.const),
    };
}