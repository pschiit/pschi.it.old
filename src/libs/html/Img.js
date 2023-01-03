import RenderTarget from '../renderer/graphics/RenderTarget';
import Canvas2d from './Canvas2d';
import HtmlNode from './HtmlNode';

export default class Img extends HtmlNode {
    static elementTag = 'img';

    constructor(src, onload) {
        super(Img.elementTag);
        this.loadImage(src, onload);
    }

    loadImage(src, onload) {
        if(src instanceof RenderTarget){
            src = Canvas2d.dataUrlfromRenderTarget(src);
        }
        if (onload) {
            this.element.onload = onload;
        }
        this.element.src = src;

        return this;
    }
}