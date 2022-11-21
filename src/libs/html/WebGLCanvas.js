import Canvas from'./Canvas';
import Node from'../core/Node';
import WebGLRenderer from'../renderer/webgl/WebGLRenderer';

export default class  WebGLCanvas extends Canvas {

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
            console.log(child.gl.canvas, this.element, child.gl.canvas === this.element);
            if (!(child instanceof WebGLRenderer)
                || child.gl.canvas !== this.element) {
                this.removeChild(child);
            }
        });

        window.onresize = (e) => {
            this.fitParent();
            this.context.resized = true;
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

    get context() {
        if (this.childrens.length > 0){
            return this.childrens[0];
        }
        return null;
    }

    /** Render a Node in the WebGLCanvas
     * @param {Node} node Node to render
     * @returns {WebGLCanvas} the WebGLCanvas to render in
     */
    render(node) {
        this.context.render(node);

        return this;
    }
}