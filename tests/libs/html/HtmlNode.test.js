import { HtmlNode } from '../../../src/libs/html/HtmlNode';
import { Vector2 } from '../../../src/libs/math/Vector2';

test('HtmlNode.document should return a HtmlNode singleton with document as element', () => {
    expect(HtmlNode.document).toBe(HtmlNode.document);
    expect(HtmlNode.document.element).toBe(document.documentElement);
});

test('HtmlNode.body should return a HtmlNode singleton with document.body as element and document as parent', () => {
    expect(HtmlNode.body).toBe(HtmlNode.body);
    expect(HtmlNode.body.element).toBe(document.body);
    expect(HtmlNode.body.parent).toBe(HtmlNode.document);
    expect(HtmlNode.body.parent.element).toBe(document.documentElement);
});

test('When created, HtmlNode should have a HTMLElement of his type as element', () => {
    const type = 'DIV';
    const htmlNode = new HtmlNode(type);

    expect(htmlNode.element).toBeInstanceOf(HTMLElement);
    expect(htmlNode.element.tagName).toBe(type);
});

describe('When appending a child to a HtmlNode', () => {
    test('should throw Error if trying to append a child which is not a HtmlNode', () => {
        const parent = new HtmlNode();
        function appendChild() {
            parent.appendChild(new Node());
        }

        expect(appendChild).toThrow();
    });
    test('should append child HTMLElement to the parent HTMLElement', () => {
        const type = 'DIV';
        const parent = new HtmlNode(type);
        const child = new HtmlNode(type);
        parent.appendChild(child);

        expect(Array.from(parent.element.children)).toEqual(expect.arrayContaining([child.element]));
        expect(child.element.parentElement).toBe(parent.element);
    });
});

test('When removing a child from a HtmlNode should call child.element.remove', () => {
    const type = 'DIV';
    const parent = new HtmlNode(type);
    const child = new HtmlNode(type);
    parent.childrens.push(child);
    parent.element.appendChild(child.element);
    parent.removeChild(child);

    expect(Array.from(parent.element.children)).not.toEqual(expect.arrayContaining([child.element]));
    expect(child.element.parentElement).not.toBe(parent.element);
});

test('aspectRatio should return width / height', () => {
    const type = 'DIV';
    const node = new HtmlNode(type);
    const width = 800;
    const height = 600;
    node.width = width;
    node.height = height;

    expect(node.element.width).toBe(width);
    expect(node.element.height).toBe(height);
    expect(node.aspectRatio).toBe(width / height);
});

test('fitParent should set HtmlNode width and height from parent clientWidth and clientHeight', () => {
    const width = 800;
    const height = 600;
    const type = 'DIV';
    const parent = new HtmlNode(type);
    Object.defineProperty(parent.element, 'clientWidth', { configurable: true, value: width });
    Object.defineProperty(parent.element, 'clientHeight', { configurable: true, value: height });
    const child = new HtmlNode(type);
    parent.appendChild(child);
    child.fitParent();

    expect(child.width).toBe(parent.element.clientWidth);
    expect(child.height).toBe(parent.element.clientHeight);
});

test('When setting style of a HtmlNode should add or update properties to the node.style and element.style without removing the missing one', () => {
    const type = 'DIV';
    const node = new HtmlNode(type);
    let style = {
        width: '100%',
        height: '100%',
        margin: '0px',
    };
    node.style = style;
    node.style = {
        width: '50%',
    };
    
    expect(node.style.width).toEqual('50%');
    expect(node.style.height).toEqual(style.height);
    expect(node.style.margin).toEqual(style.margin);
    expect(node.element.style.width).toEqual('50%');
    expect(node.element.style.height).toEqual(style.height);
    expect(node.element.style.margin).toEqual(style.margin);
});

test('getPointerPosition should return the correct position', () => {
    const width = 800;
    const height = 600;
    const clientX = 150;
    const clientY = 55;
    const bottom = 10;
    const left = 10;
    const type = 'DIV';
    const node = new HtmlNode(type);
    node.width = width;
    node.height = height;
    Object.defineProperties(node.element, {
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

    expect(node.getPointerPosition({ clientX: clientX, clientY: clientY })).toEqual(new Vector2(
        ((clientX - left)),
        ((bottom - clientY))
    ));
});

test('getMouseRelativePositon should return the correct position', () => {
    const width = 800;
    const height = 600;
    const clientX = 150;
    const clientY = 55;
    const top = 10;
    const left = 10;
    const type = 'DIV';
    const node = new HtmlNode(type);
    node.width = width;
    node.height = height;
    Object.defineProperties(node.element, {
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

    expect(node.getMouseRelativePositon({ clientX: clientX, clientY: clientY })).toEqual(new Vector2(
        ((clientX - left)) / width * 2 - 1,
        ((clientY - top)) / height * -2 + 1)
    );
});