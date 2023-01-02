import LightMaterial from '../material/LightMaterial';
import Node3d from '../Node3d';
import Light from '../../renderer/graphics/Light';
import RenderTarget from '../../renderer/graphics/RenderTarget';
import Texture from '../../renderer/graphics/Texture';
import PerspectiveCamera from '../camera/PerspectiveCamera';

export default class SpotLight extends Node3d {
    constructor(color, radius, position, target) {
        super();
        this.light = new Light(color);
        this.translate(position);
        this.radius = radius;
        this.innerRadius = radius;
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
        if (this.shadowCamera) {
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
                this.shadowCamera = new PerspectiveCamera(this.radius, 1, 0.5, 500);
            }
            if (!this.shadowMap) {
                const renderTarget = new RenderTarget(this.shadowCamera, 1024, 1024);
                renderTarget.material = LightMaterial.shadowMaterial;
                this._shadowMap = new Texture(renderTarget);
                this._shadowMap.minification = Texture.filter.linear;
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
            this.light.setParameter(LightMaterial.parameters.spotShadowLightShadowMatrix, this.shadowCamera.projectionMatrix);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightShadowMap, this.shadowMap);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightColor, this.light.color.rgb);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightPosition, this.vertexMatrix.positionVector);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightDirection, this.vertexMatrix.zAxis);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightInnerRadius, this.innerRadius);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightRadius, this.radius);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightAmbientStrength, this.light.ambientStrength);
            this.light.setParameter(LightMaterial.parameters.spotShadowLightIntensity, this.light.intensity);
        } else {
            this.light.setParameter(LightMaterial.parameters.spotLightColor, this.light.color.rgb);
            this.light.setParameter(LightMaterial.parameters.spotLightPosition, this.vertexMatrix.positionVector);
            this.light.setParameter(LightMaterial.parameters.spotLightDirection, this.vertexMatrix.zAxis);
            this.light.setParameter(LightMaterial.parameters.spotLightInnerRadius, this.innerRadius);
            this.light.setParameter(LightMaterial.parameters.spotLightRadius, this.radius);
            this.light.setParameter(LightMaterial.parameters.spotLightAmbientStrength, this.light.ambientStrength);
            this.light.setParameter(LightMaterial.parameters.spotLightIntensity, this.light.intensity);
        }
        this.light.setScene(parameters);
        return this;
    }
}