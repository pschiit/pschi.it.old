import Texture from '../Texture';
import Render from '../Render';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';
import RenderTarget from '../RenderTarget';

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
        renderer.texture2d = this;
        //renderer.gl.generateMipmap(this.target);
        //renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_S, renderer.gl.CLAMP_TO_EDGE);
        //renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_T, renderer.gl.CLAMP_TO_EDGE);
        //renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.LINEAR);
        renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.LINEAR);

        if (this.target === renderer.gl.TEXTURE_2D) {
            this.update = (texture) => {
                if (texture.updated) {
                    renderer.texture2d = this;
                    if (texture.data instanceof RenderTarget) {
                        const format = WebGLRenderer.formatFrom(renderer, texture.data.format);
                        const type = WebGLRenderer.typeFrom(renderer, texture.data.type);
                        renderer.gl.texImage2D(this.target, this.level, format, texture.data.width, texture.data.height, 0, format, type, null);
                        texture.updated = false;
                    } else {
                        const format = WebGLRenderer.formatFrom(renderer, texture.format);
                        const type = WebGLRenderer.typeFrom(renderer, texture.type);
                        if (texture.width && texture.height) {
                            renderer.gl.texImage2D(this.target, this.level, format, texture.width, texture.height, 0, format, type, texture.data);

                        } else {
                            renderer.gl.texImage2D(this.target, this.level, format, format, type, texture.data);
                        }
                    }
                    texture.updated = false;
                }
            };
        } else if (this.target === renderer.gl.TEXTURE_CUBE_MAP) {
            this.update = (texture) => {
                if (texture.updated) {
                    const format = WebGLRenderer.formatFrom(renderer, texture.format);
                    const type = WebGLRenderer.typeFrom(renderer, texture.type);
                    renderer.textureCubeMap = this;
                    renderer.gl.texImage2D(this.target, this.level, format, format, type, texture.data);
                };
                texture.updated = false;
            }
        }
    }

    /** Return whether or not this WebGLTexture has been created from the Texture
     * @param {Texture} texture  Texture to compare
     */
    is(texture) {
        return this.name == texture.id;
    }

    /** Get the Texture's WebGLTexture from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the rendering context
     * @param {Texture} texture the Texture
     * @returns {WebGLTexture} the WebGLTexture
     */
    static from(renderer, texture) {
        return renderer.nodes[texture.id] || new WebGLTexture(renderer, texture);
    }
}