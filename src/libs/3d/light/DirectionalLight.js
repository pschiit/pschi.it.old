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
        this.shadow = false;
    }

    get shadowCamera() {
        return this._shadowCamera;
    }

    set shadowCamera(v) {
        if (v != this.shadowCamera) {
            if (this.shadowCamera) {
                this.removeChild(this.shadowCamera)
            }
            this._shadowCamera = v;
            if (v.parent != this) {
                this.appendChild(v);
            }
        }
    }

    get showFrustum() {
        return this.shadowCamera && this.shadowCamera.showFrustum;
    }

    set showFrustum(v) {
        if(this.shadowCamera){
            this.shadowCamera.showFrustum = v;
            this.clearVertexMatrix();
        }
    }

    get shadow() {
        return this.shadowMap && this.shadowCamera;
    }

    set shadow(v) {
        if (v) {
            if (!this.shadowCamera) {
                this.shadowCamera = new OrthographicCamera(-5, 5, -5, 5, 0, 10);
            }
            if (!this.shadowMap) {
                const renderTarget = new RenderTarget(this.shadowCamera, 1024, 1024);
                renderTarget.material = LightMaterial.shadowMaterial;
                this._shadowMap = new Texture(renderTarget);
                this._shadowMap.magnification = Texture.filter.nearest;
                this._shadowMap.minification = Texture.filter.nearest;
                this._shadowMap.wrapS = Texture.wrapping.clamp;
                this._shadowMap.wrapT = Texture.wrapping.clamp;
            }
            this.light.parameters = {};
        } else {
            if (this.shadowCamera) {
                this.shadowCamera = null;
            }
            if (!this.shadowMap) {
                this._shadowMap = null;
            }
            this.light.parameters = {};
        }
    }

    get shadowMap() {
        if (!this._shadowMap) {
        }
        return this._shadowMap;
    }

    setScene(parameters) {
        super.setScene(parameters);
        if (this.shadow) {
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightShadowMatrix, this.shadowCamera.projectionMatrix);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightShadowMap, this.shadowMap);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightColor, this.light.color.rgb.scale(this.light.intensity));
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightDirection, this.vertexMatrix.zAxis);
            this.light.setParameter(LightMaterial.parameters.directionalShadowLightAmbientStrength, this.light.ambientStrength);
        } else {
            this.light.setParameter(LightMaterial.parameters.directionalLightColor, this.light.color.rgb.scale(this.light.intensity));
            this.light.setParameter(LightMaterial.parameters.directionalLightDirection, this.vertexMatrix.zAxis);
            this.light.setParameter(LightMaterial.parameters.directionalLightAmbientStrength, this.light.ambientStrength);
        }
        this.light.setScene(parameters);

        return this;
    }
}