import { HtmlNode } from './HtmlNode';

export class Div extends HtmlNode {
    static elementTag = 'DIV';
    

    /** Create a new Div HtmlNode
    */
    constructor() {
        super(Div.elementTag);
    }
}