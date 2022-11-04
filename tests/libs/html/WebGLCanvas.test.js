import { WebGLCanvas } from '../../../src/libs/html/WebGLCanvas';
import { Vector2 } from '../../../src/libs/math/Vector2';

HTMLCanvasElement.prototype.getContext = () => {
    return {};
};

test('When created, WebGLCanvas should have a HTMLElement canvas as element an a WebGLContext', () => {
    const canvas = new WebGLCanvas();

    expect(canvas.context).toBeDefined();
    expect(canvas.element).toBeInstanceOf(HTMLElement);
    expect(canvas.element.tagName).toBe('CANVAS');
});

test('getMouseRelativePositon should return the correct position', () => {
    const width = 800;
    const height = 600;
    const clientX = 150;
    const clientY = 55;
    const top = 10;
    const left = 10;
    const canvas = new WebGLCanvas();
    canvas.width = width;
    canvas.height = height;
    Object.defineProperties(canvas.element, {
        clientWidth: { configurable: false, value: width },
        clientHeight: { configurable: false, value: height },
        getBoundingClientRect: {
            configurable: false, value: function () {
                return {
                    top: top,
                    left: left
                }
            }
        },
    });

    expect(canvas.getMouseRelativePositon({ clientX: clientX, clientY: clientY })).toEqual(new Vector2(
        ((clientX - left)) / width * 2 - 1,
        ((clientY - top)) / height * -2 + 1)
    );
});