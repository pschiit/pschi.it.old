import Div from'../../../src/libs/html/Div';

test('When created, Div should have a HTMLElement div as element', ()=>{
    const div = new Div();
    
    expect(div.element).toBeInstanceOf(HTMLElement);
    expect(div.element.tagName).toBe('DIV');
});