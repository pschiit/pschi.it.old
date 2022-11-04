import { Canvas } from './Canvas';
import { Vector2 } from '../math/Vector2';

export class WebGLCanvas extends Canvas {

    /** Create a new WebGLCanvas HtmlNode
     * @param contextOptions webgl options for context initialization 
    */
    constructor(contextOptions) {
        super();

        this.context = this.element.getContext('webgl', contextOptions) || this.element.getContext('experimental-webgl', contextOptions)
        if (!this.context) {
            this.element.innerText = 'WebGL is not supported.'
        }
    }
    
    /** Get the pointer webgl-relative position (-1, 1) from an Pointer(or Mouse) Event,
     * assumes canvas doesn't have padding or border
     * @param {Event} event Pointer event
     * @return {Vector2} the pointer position as Vector2
    */
    getMouseRelativePositon(event) {
        const rect = this.element.getBoundingClientRect();
        return new Vector2(
            ((event.clientX - rect.left) * this.element.width / this.element.clientWidth) / this.element.width * 2 - 1,
            ((event.clientY - rect.top) * this.element.height / this.element.clientHeight) / this.element.height * -2 + 1
        );
    }
}