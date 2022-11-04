import { HtmlNode } from './HtmlNode';
import { Vector2 } from '../math/Vector2';

export class Canvas extends HtmlNode {
    static elementTag = 'CANVAS';

    /** Create a new Canvas HtmlNode
    */
    constructor() {
        super(Canvas.elementTag);
    }
    
    /** Get the pointer position from an Pointer(or Mouse) Event,
     * assumes canvas doesn't have padding or border
     * @param {Event} event Pointer event
     * @return {Vector2} the pointer position as Vector2
    */
    getPointerPosition(event) {
        const rect = this.element.getBoundingClientRect();
        return new Vector2(
            ((event.clientX - rect.left) * this.element.width / this.element.clientWidth),
            ((rect.bottom - event.clientY) * this.element.height / this.element.clientHeight)
        );
    }
}