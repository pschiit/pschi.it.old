import { WebGLCanvas } from '../../../src/libs/html/WebGLCanvas';
import { WebGLRenderer } from '../../../src/libs/renderer/webgl/WebGLRenderer';

HTMLCanvasElement.prototype.getContext = () => {
    return {
        getSupportedExtensions: () => []
    };
};

test('When created, WebGLCanvas should have a HTMLElement canvas as element an a WebGLContext', () => {
    const canvas = new WebGLCanvas();

    expect(canvas.context).toBeInstanceOf(WebGLRenderer);
    expect(canvas.element).toBeInstanceOf(HTMLElement);
    expect(canvas.element.tagName).toBe('CANVAS');
});