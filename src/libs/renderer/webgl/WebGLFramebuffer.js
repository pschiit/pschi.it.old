import Texture from '../Texture';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';
import WebGLTexture from './WebGLTexture';

export default class WebGLFramebuffer extends WebGLNode {
    /** Create a WebGLTexture for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Texture} texture  Texture
     */
    constructor(renderer, texture) {
        super(renderer, 'fb' + texture.id);
        this.location = renderer.gl.createFramebuffer();
        this.texture2d = WebGLTexture.from(renderer, texture);
        this.texture2d.update(texture);

        this.renderBuffer = renderer.gl.createRenderbuffer();
        renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, this.renderBuffer);
        renderer.gl.renderbufferStorage(renderer.gl.RENDERBUFFER, renderer.gl.DEPTH_COMPONENT16, texture.width, texture.height);
        renderer.framebuffer = this;
        console.log(renderer.framebuffer)
        renderer.gl.framebufferTexture2D(renderer.gl.FRAMEBUFFER, renderer.gl.COLOR_ATTACHMENT0, this.texture2d.target, this.texture2d.location, 0);
        renderer.gl.framebufferRenderbuffer(renderer.gl.FRAMEBUFFER, renderer.gl.DEPTH_ATTACHMENT, renderer.gl.RENDERBUFFER, this.renderBuffer);
        var e = renderer.gl.checkFramebufferStatus(renderer.gl.FRAMEBUFFER);
        if (e !== renderer.gl.FRAMEBUFFER_COMPLETE) {
            const error = new Error('Framebuffer object is incomplete: ' + e);
            renderer.removeChild(this);
            throw error;
        }
        renderer.framebuffer = null;
        renderer.texture2d = null;
        renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, null);
    }

    /** Return whether or not this WebGLFramebuffer has been created from the Texture
     * @param {Texture} texture  Texture to compare
     */
    is(texture){
        return this.name == 'fb' + texture.id;
    }

    /** Get the Texture's WebGLFramebuffer from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the rendering context
     * @param {Texture} texture the Texture
     */
    static from(renderer, texture){
        return renderer.nodes['fb' + texture.id] || new WebGLFramebuffer(renderer, texture);
    }
}