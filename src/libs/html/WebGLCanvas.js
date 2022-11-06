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
            this.gl = null;

        });
        this.element.addEventListener('webglcontextrestored', (e) => {
            this.initContext(contextOptions);
        });
    }

    initContext(contextOptions) {
        this.context = new WebGLRenderer(this.element.getContext('webgl', contextOptions) || this.element.getContext('experimental-webgl', contextOptions));
        if (!this.context) {
            this.element.innerText = 'WebGL is not supported.';
        }
    }
}