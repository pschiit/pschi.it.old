import { HtmlNode } from './HtmlNode';

export class Canvas extends HtmlNode {
    static elementTag = 'CANVAS';

    /** Create a new Canvas HtmlNode
    */
    constructor() {
        super(Canvas.elementTag);
        /** @type {HTMLCanvasElement} */
        this.element;
    }
}