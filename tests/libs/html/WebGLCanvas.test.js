import { WebGLCanvas } from '../../../src/libs/html/WebGLCanvas';

HTMLCanvasElement.prototype.getContext = () => {
    return {
        getSupportedExtensions: () => []
    };
};

test('When created, WebGLCanvas should have a HTMLElement canvas as element an a WebGLContext', () => {
    const canvas = new WebGLCanvas();

    expect(canvas.context).toBeDefined();
    expect(canvas.element).toBeInstanceOf(HTMLElement);
    expect(canvas.element.tagName).toBe('CANVAS');
});