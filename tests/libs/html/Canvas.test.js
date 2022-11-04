import { Canvas } from '../../../src/libs/html/Canvas';
import { Vector2 } from '../../../src/libs/math/Vector2';

test('When created, Canvas should have a HTMLElement canvas as element', () => {
    const canvas = new Canvas();

    expect(canvas.element).toBeInstanceOf(HTMLElement);
    expect(canvas.element.tagName).toBe('CANVAS');
});

test('getPointerPosition should return the correct position', () => {
    const width = 800;
    const height = 600;
    const clientX = 150;
    const clientY = 55;
    const bottom = 10;
    const left = 10;
    const canvas = new Canvas();
    canvas.width = width;
    canvas.height = height;
    Object.defineProperties(canvas.element, {
        clientWidth: { configurable: false, value: width },
        clientHeight: { configurable: false, value: height },
        getBoundingClientRect: {
            configurable: false, value: function () {
                return {
                    bottom: bottom,
                    left: left
                }
            }
        },
    });

    expect(canvas.getPointerPosition({ clientX: clientX, clientY: clientY })).toEqual(new Vector2(
        ((clientX - left)),
        ((bottom - clientY))
    ));
});