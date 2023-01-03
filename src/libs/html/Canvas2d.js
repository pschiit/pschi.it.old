import Canvas from "./Canvas";

export default class Canvas2d extends Canvas {
    /** Create a new Canvas2d HtmlNode
    * @param {Object} contextOptions canvas2d options for context initialization 
   */
    constructor(contextOptions) {
        super();
        this.context = this.element.getContext('2d', contextOptions);
    }

    translate(x, y) {
        this.context.translate(x, y);
    }

    scale(x, y) {
        this.context.scale(x, y);
    }

    drawImage(image, x, y, width, height) {
        this.context.drawImage(image, x, y, width, height);
    }

    scale(x, y) {
        this.context.scale(x, y);
    }

    shadowColor(color) {
        this.context.shadowColor(color);
    }

    shadowBlur(value) {
        this.context.shadowBlur(value);
    }

    strokeStyle(style) {
        this.context.strokeStyle(style);
    }

    fillStyle(style) {
        this.context.fillStyle(style);
    }

    fillRect(x, y, width, height) {
        this.context.fillRect(x, y, width, height);
    }

    clearRect(x, y, width, height) {
        this.context.clearRect(x, y, width, height);
    }

    strokeRect(x, y, width, height) {
        this.context.strokeRect(x, y, width, height);
    }

    static dataUrlfromRenderTarget(renderTarget) {
        const canvas = new Canvas2d({
            width: renderTarget.width,
            height: renderTarget.height
        });
        canvas.drawImage(renderTarget.output, renderTarget.width, renderTarget.height);
        return canvas.element.toDataURL("image/png");
    }
}