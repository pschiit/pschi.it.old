import Canvas from './Canvas';
import Node from '../core/Node';
import WebGLRenderer from '../renderer/webgl/WebGLRenderer';
import Texture from '../renderer/Texture';
import Render from '../renderer/Render';
import RenderTarget from '../renderer/RenderTarget';
import Vector2 from '../math/Vector2';

export default class WebGLCanvas extends Canvas {
    /** Create a new WebGLCanvas HtmlNode
     * @param {Object} contextOptions webgl options for context initialization 
    */
    constructor(contextOptions) {
        super();
        this._renderTarget = new RenderTarget(0, 0, this.clientWidth, this.clientHeight);
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
        this._renderTarget.width = this.clientWidth;
        this._renderTarget.height = this.clientHeight;

        return this._renderTarget;
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
        if (arguments.length > 1) {
            WebGLCanvas.repeatFunction(arguments, this.render.bind(this));
        } else {
            this.context.render(node);
        }

        return this;
    }

    /** Get the pointer webgl-relative position (-1, 1) from an Pointer(or Mouse) Event,
     * assumes HTMLElement doesn't have padding or border
     * @param {PointerEvent} event Pointer event
     * @return {Vector2} the pointer position as Vector2
    */
    getPointerRelativePositon(event) {
        const rect = this.element.getBoundingClientRect();
        
        return new Vector2(
            ((event.clientX - rect.left) * this.width / this.element.clientWidth) / this.width * 2 - 1,
            ((event.clientY - rect.top) * this.height / this.element.clientHeight) / this.height * -2 + 1
        );
    }
}