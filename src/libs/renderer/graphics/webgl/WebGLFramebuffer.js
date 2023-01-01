import Texture from '../Texture';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';
import WebGLTexture from './WebGLTexture';

export default class WebGLFramebuffer extends WebGLNode {
    /** Create a WebGLFramebuffer for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Texture} texture  Texture
     */
    constructor(renderer, texture) {
        super(renderer, 'fb-' + texture.id);
        this.location = renderer.gl.createFramebuffer();
        this.texture = WebGLTexture.from(renderer, texture);
        this.width = texture.width;
        this.height = texture.height
        renderer.texture2d = this.texture;
        this.texture.update(texture);

        this.renderBuffer = renderer.gl.createRenderbuffer();
        renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, this.renderBuffer);
        renderer.gl.renderbufferStorage(renderer.gl.RENDERBUFFER, renderer.gl.DEPTH_COMPONENT16, texture.width, texture.height);
        renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, this.location);
        renderer.gl.framebufferTexture2D(renderer.gl.FRAMEBUFFER, renderer.gl.COLOR_ATTACHMENT0, this.texture.target, this.texture.location, 0);
        renderer.gl.framebufferRenderbuffer(renderer.gl.FRAMEBUFFER, renderer.gl.DEPTH_ATTACHMENT, renderer.gl.RENDERBUFFER, this.renderBuffer);
        var e = renderer.gl.checkFramebufferStatus(renderer.gl.FRAMEBUFFER);
        if (e !== renderer.gl.FRAMEBUFFER_COMPLETE) {
            const error = new Error('Framebuffer object is incomplete: ' + e);
            renderer.removeChild(this);
            throw error;
        }
        renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, null);
        renderer.texture2d = null;
        renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, null);
    }

    /** Return whether or not this WebGLFramebuffer has been created from the Texture
     * @param {Texture} node  Texture to compare
     */
    is(node) {
        return this.texture.name == node.id;
    }

    /** Get the Texture's WebGLFramebuffer from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the rendering context
     * @param {Texture} texture the Texture
     * @returns {WebGLFramebuffer} the WebGLFramebuffer
     */
    static from(renderer, texture) {
        const webGLTexture = renderer.nodes['fb-' + texture.id];
        if(webGLTexture){
            if(webGLTexture.width != texture.width
                || webGLTexture.height != texture.height){
                    renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, webGLTexture.renderBuffer);
                    renderer.gl.renderbufferStorage(renderer.gl.RENDERBUFFER, renderer.gl.DEPTH_COMPONENT16, texture.width, texture.height);
                    renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, null);
                    texture.updated = true;
                    webGLTexture.texture.update(texture);
                }
            return webGLTexture;
        }
        return new WebGLFramebuffer(renderer, texture);
    }
}