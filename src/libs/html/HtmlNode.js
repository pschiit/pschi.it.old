import Node from '../core/Node';
import Vector2 from '../math/Vector2';
import RenderTarget from '../renderer/RenderTarget';

export default class HtmlNode extends Node {
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
    get style() {
        return this._style;
    }

    /** Update the style applied to the current HtmlNode's HTMLElement.
     * This only update the properties of style and do not remove missing properties
     * @param {Object} value the object representation of the style properties modifications
    */
    set style(value) {
        for (const key in value) {
            if (Object.hasOwnProperty.call(value, key)) {
                this.element.style[key] = value[key];
                this._style[key] = this.element.style[key];
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

    /** Return the clientWidth of the current HtmlNode's HTMLElement
     * @return {Number} clientWidth of the HTMLElement
    */
    get clientWidth() {
        return this.element.clientWidth;
    }

    /** Return the clientHeight of the current HtmlNode's HTMLElement
     * @return {Number} clientHeight of the HTMLElement
    */
    get clientHeight() {
        return this.element.clientHeight;
    }

    /** Return the aspect ratio of the current HtmlNode's HTMLElement
     * @return {Number} width / height of the HTMLElement
    */
    get aspectRatio() {
        return this.element.clientWidth / this.element.clientHeight;
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

    /** Get the pointer position from an Pointer(or Mouse) Event,
     * assumes HTMLElement doesn't have padding or border
     * @param {PointerEvent} event Pointer event
     * @return {Vector2} the pointer position as Vector2
    */
    getPointerPosition(event) {
        const rect = this.element.getBoundingClientRect();
        return new Vector2(
            ((event.clientX - rect.left) * this.width / this.element.clientWidth),
            ((rect.bottom - event.clientY) * this.height / this.element.clientHeight)
        );
    }

    /** Get the pointer webgl-relative position (-1, 1) from an Pointer(or Mouse) Event,
     * assumes HTMLElement doesn't have padding or border
     * @param {PointerEvent} event Pointer event
     * @return {Vector2} the pointer position as Vector2
    */
    getMouseRelativePositon(event) {
        const rect = this.element.getBoundingClientRect();
        return new Vector2(
            ((event.clientX - rect.left) * this.width / this.element.clientWidth) / this.width * 2 - 1,
            ((event.clientY - rect.top) * this.height / this.element.clientHeight) / this.height * -2 + 1
        );
    }

    /** Return the HtmlNode singleton of the document
     * @return {HtmlNode} the document HtmlNode
    */
    static get document() {
        if (!HtmlNode.documentNode) {
            HtmlNode.documentNode = new HtmlNode();
            HtmlNode.documentNode.element = document.documentElement;
        }
        return HtmlNode.documentNode;
    }

    /** Return the HtmlNode singleton of the document.body
     * @return {HtmlNode} the document.body HtmlNode
    */
    static get body() {
        if (!HtmlNode.bodyNode) {
            HtmlNode.bodyNode = new HtmlNode();
            HtmlNode.bodyNode.parent = HtmlNode.document;
            HtmlNode.bodyNode.element = document.body;
        }
        return HtmlNode.bodyNode;
    }
}