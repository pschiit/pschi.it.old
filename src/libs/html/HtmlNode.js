import { Node } from '../core/Node';

export class HtmlNode extends Node {
    /** Create a new HtmlNode
     * @param {string} type the HTML tag of the new HtmlNode HTMLElement
    */
    constructor(type) {
        super();
        this._style = {};
        if (type) {
            this.element = document.createElement(type);
            this.element.id = this.id;
        }

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (child instanceof HtmlNode) {
                this.element.appendChild(child.element);
            }
        });
        this.addEventListener(Node.event.nodeRemoved, (e) => {
            const child = e.removed;
            if (child instanceof HtmlNode) {
                child.element.remove();
            }
        });
    }

    /** Return the style applied to the current HtmlNode's HTMLElement
     * @return {Object} type the HTML tag of the new HtmlNode HTMLElement
    */
    get style(){
        return this._style;
    }

    /** Update the style applied to the current HtmlNode's HTMLElement.
     * This only update the properties of style and do not remove missing properties
     * @param {Object} value the object representation of the style properties modifications
    */
    set style(value){
        for (const key in value) {
            if (Object.hasOwnProperty.call(value, key)) {
                this.element.style[key] = value[key];
                this._style[key] = value[key];
            }
        }
    }

    /** Return the width of the current HtmlNode's HTMLElement
     * @return {Number} width of the HTMLElement
    */
    get width() {
        return this.element.width;
    }

    /** Set the width of the current HtmlNode's HTMLElement
     * @param {Number} width of the HTMLElement
    */
    set width(value) {
        this.element.width = value;
    }

    /** Return the height of the current HtmlNode's HTMLElement
     * @param {Number} height of the HTMLElement
    */
    get height() {
        return this.element.height;
    }

    /** Set the height of the current HtmlNode's HTMLElement
     * @param {Number} height of the HTMLElement
    */
    set height(value) {
        this.element.height = value;
    }

    /** Return the aspect ratio of the current HtmlNode's HTMLElement
     * @return {Number} width / height of the HTMLElement
    */
    get aspectRatio() {
        return this.width / this.height;
    }

    /** Validate type of HtmlNode (used for appendChild) 
     * Can be override to restrict the type of HtmlNode you can append to the current HtmlNode
     * @throws {Error} when node is not of type HtmlNode
     */
    validateType(node) {
        if (!(node instanceof HtmlNode)) {
            throw new Error(`${node.constructor.name} can't be child of ${this.constructor.name}.`);
        }
    }

    /** Set the width and height of the current HtmlNode's HTMLElement
     * to the parent's HTMLElement.clientWidth/clientHeight
     * @return the current HtmlNode
    */
    fitParent() {
        if (this.parent?.element) {
            this.width = this.parent.element.clientWidth;
            this.height = this.parent.element.clientHeight;
        }

        return this;
    }

    /** Return the HtmlNode singleton of the document
     * @return {HtmlNode} the document HtmlNode
    */
    static get document(){
        if (!HtmlNode.documentNode) {
            HtmlNode.documentNode = new HtmlNode();
            HtmlNode.documentNode.element = document.documentElement;
        }
        return HtmlNode.documentNode;
    }

    /** Return the HtmlNode singleton of the document.body
     * @return {HtmlNode} the document.body HtmlNode
    */
    static get body(){
        if (!HtmlNode.bodyNode) {
            HtmlNode.bodyNode = new HtmlNode();
            HtmlNode.bodyNode.parent = HtmlNode.document;
            HtmlNode.bodyNode.element = document.body;
        }
        return HtmlNode.bodyNode;
    }
}