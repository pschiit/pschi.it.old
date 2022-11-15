import { Canvas } from './Canvas';
import { WebGLRenderer } from '../renderer/webgl/WebGLRenderer';

export class WebGLCanvas extends Canvas {

    /** Create a new WebGLCanvas HtmlNode
     * @param {Object} contextOptions webgl options for context initialization 
    */
    constructor(contextOptions) {
        super();
        this.initContext();

        this.element.addEventListener('webglcontextlost', (e) => {
            this.context = null;

        });
        this.element.addEventListener('webglcontextrestored', (e) => {
            this.initContext(contextOptions);
        });
        
        window.onresize = (e) => {
            this.fitParent();
            this.context.resized = true;
        };
    }

    initContext(contextOptions) {
        const newContext = new WebGLRenderer(this.element.getContext('webgl', contextOptions) || this.element.getContext('experimental-webgl', contextOptions));
        if (!newContext) {
            this.element.innerText = 'WebGL is not supported.';
            throw new Error(this.element.innerText);
        }
        this.context = newContext;
    }
}