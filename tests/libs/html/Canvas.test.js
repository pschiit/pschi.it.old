import { Canvas } from '../../../src/libs/html/Canvas';

test('When created, Canvas should have a HTMLElement canvas as element', ()=>{
    const canvas = new Canvas();
    
    expect(canvas.element).toBeInstanceOf(HTMLElement);
    expect(canvas.element.tagName).toBe('CANVAS');
});