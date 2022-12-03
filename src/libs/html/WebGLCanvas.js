import Canvas from './Canvas';
import Node from '../core/Node';
import WebGLRenderer from '../renderer/webgl/WebGLRenderer';
import Texture from '../renderer/Texture';
import Render from '../renderer/Render';
import RenderTarget from '../renderer/RenderTarget';

export default class WebGLCanvas extends Canvas {
    /** Create a new WebGLCanvas HtmlNode
     * @param {Object} contextOptions webgl options for context initialization 
    */
    constructor(contextOptions) {
        super();
        initContext(this, contextOptions);

        this.element.addEventListener('webglcontextlost', (e) => {
            this.removeChild(this.context);
        });
        this.element.addEventListener('webglcontextrestored', (e) => {
            initContext(contextOptions);
        });

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (!(child instanceof WebGLRenderer)
                || child.gl.canvas !== this.element) {
                this.removeChild(child);
            }
        });

        window.onresize = (e) => {
            this.fitParent();
        };

        function initContext(webGLCanvas, contextOptions) {
            const newContext = new WebGLRenderer(webGLCanvas.element.getContext('webgl', contextOptions) || webGLCanvas.element.getContext('experimental-webgl', contextOptions));
            if (!newContext) {
                webGLCanvas.element.innerText = 'WebGL is not supported.';
                throw new Error(webGLCanvas.element.innerText);
            }
            webGLCanvas.appendChild(newContext);
        }
    }

    /** Return the RenderTarget of the current HtmlNode's HTMLElement
     * @return {RenderTarget} RenderTarget of the HTMLElement
    */
    get renderTarget() {
        return new RenderTarget(0, 0, this.clientWidth, this.clientHeight);
    }


    /** Return the WebGLRenderer context of the current HtmlNode's HTMLElement
     * @return {WebGLRenderer} WebGLRenderer of the HTMLElement
    */
    get context() {
        if (this.childrens.length > 0) {
            return this.childrens[0];
        }
        return null;
    }

    /** Render a Render|Texture in the cWebGLCanvas
     * @param {Render|RenderTarget} node Node to render
     * @returns {WebGLCanvas} the current WebGLCanvas
     */
    render(node) {
        this.context.render(node);

        return this;
    }
}