import Texture from '../../3d/texture/Texture';
import Render from '../Render';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';

export default class WebGLTexture extends WebGLNode {
    /** Create a WebGLTexture for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Texture} texture  Texture
     */
    constructor(renderer, texture) {
        super(renderer, texture.id);
        this.target = renderer.gl.TEXTURE_2D;
        this.location = renderer.gl.createTexture();

        this.unit = renderer.textureUnit++;
        this.level = 0;
        this.format = renderer.gl.RGBA;
        this.type = renderer.gl.UNSIGNED_BYTE;
        renderer.texture2d = this;
        // renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_S, renderer.gl.CLAMP_TO_EDGE);
        // renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_T, renderer.gl.CLAMP_TO_EDGE);
        //renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.LINEAR);
        renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.LINEAR);

        if (this.target === renderer.gl.TEXTURE_2D) {
            this.update = (texture) => {
                renderer.texture2d = this;
                if (texture.width && texture.height) {
                    renderer.gl.texImage2D(this.target, this.level, this.format, texture.width, texture.height, 0, this.format, this.type, texture.data instanceof Render ? null: texture.data);
                } else {
                    renderer.gl.texImage2D(this.target, this.level, this.format, this.format, this.type, texture.data);
                }
            };
        } else if (this.target === renderer.gl.TEXTURE_CUBE_MAP) {
            this.update = (texture) => {
                renderer.textureCubeMap = this;
                renderer.gl.texImage2D(this.target, this.level, this.format, this.format, this.type, texture.data);
            };
        }
    }
}