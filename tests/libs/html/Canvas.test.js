import Canvas from'../../../src/libs/html/Canvas';
import Vector2 from'../../../src/libs/math/Vector2';

test('When created, Canvas should have a HTMLElement canvas as element', () => {
    const canvas = new Canvas();

    expect(canvas.element).toBeInstanceOf(HTMLElement);
    expect(canvas.element.tagName).toBe('CANVAS');
});