import RenderTarget from '../../renderer/graphics/RenderTarget';
import Texture from '../../renderer/graphics/Texture';
import OrthographicCamera from '../camera/OrthographicCamera';
import LightMaterial from '../material/LightMaterial';
import Node3d from '../Node3d';
import Light from '../../renderer/graphics/Light';

export default class DirectionalLight extends Node3d {
    constructor(color, position, target) {
        super();
        this.light = new Light(color);
        this.translate(position);
        this.target = target;
        this.shadowCamera = new OrthographicCamera(- 5, 5, 5, - 5, 0.5, 500);
        this.appendChild(this.shadowCamera);
    }

    get shadowMap() {
        if (!this._shadowMap) {
            const renderTarget = new RenderTarget(this.shadowCamera, 1024, 1024);
            renderTarget.material = LightMaterial.shadowMaterial;
            this._shadowMap = new Texture(renderTarget)
        }
        return this._shadowMap;
    }

    setScene(parameters) {
        super.setScene(parameters);
        if(this._shadowMap){
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightShadowMatrix, this.shadowCamera.projectionMatrix);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightShadowMap, this._shadowMap);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightColor, this.light.color.rgb.scale(this.light.intensity));
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightDirection, this.vertexMatrix.zAxis);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightAmbientStrength, this.light.ambientStrength);
        }else{
            this.light.setParameter(LightMaterial.parameters.directionalLightColor, this.light.color.rgb.scale(this.light.intensity));
            this.light.setParameter(LightMaterial.parameters.directionalLightDirection, this.vertexMatrix.zAxis);
            this.light.setParameter(LightMaterial.parameters.directionalLightAmbientStrength, this.light.ambientStrength);
        }
        this.light.setScene(parameters);

        return this;
    }
}