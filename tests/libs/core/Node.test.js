import { Node } from '../../../src/libs/core/Node';

describe('When appending a child to a Node', () => {
    test('should throw Error if trying to append itself as child', () => {
        const parent = new Node();
        const listener = jest.fn();
        parent.listeners[Node.event.nodeInserted] = [listener];
        function appendChild() {
            parent.appendChild(parent);
        }

        expect(appendChild).toThrow();
        expect(parent.parent).not.toBe(parent);
        expect(parent.childrens.length).toBe(0);
        expect(listener).not.toHaveBeenCalled();
    });
    test('should throw Error if trying to append a child which is not a Node', () => {
        const parent = new Node();
        const listener = jest.fn();
        parent.listeners[Node.event.nodeInserted] = [listener];

        function appendChild() {
            parent.appendChild({});
        }

        expect(appendChild).toThrow();
        expect(parent.parent).not.toBe(parent);
        expect(parent.childrens.length).toBe(0);
        expect(listener).not.toHaveBeenCalled();
    });
    test('should append a child of type Node, update child.parent and trigger event.nodeInserted', () => {
        const parent = new Node();
        const listener = jest.fn();
        parent.listeners[Node.event.nodeInserted] = [listener];
        const child = new Node();
        parent.appendChild(child);

        expect(parent.childrens.indexOf(child)).toBe(0);
        expect(child.parent).toBe(parent);
        expect(listener).toHaveBeenCalled();
    });
});

describe('When removing a child from a Node', () => {
    test('should throw Error if trying to remove a Node which is not child ', () => {
        const parent = new Node();
        const listener = jest.fn();
        parent.listeners[Node.event.nodeRemoved] = [listener];
        const child = new Node();
        function removeChild() {
            parent.removeChild(child);
        }

        expect(removeChild).toThrow();
        expect(listener).not.toHaveBeenCalled();
    });
    test('should append a child of type Node, update child.parent and trigger event.nodeInserted', () => {
        const parent = new Node();
        const listener = jest.fn();
        parent.listeners[Node.event.nodeRemoved] = [listener];
        const child = new Node();
        parent.childrens.push(child);
        parent.removeChild(child);

        expect(parent.childrens.indexOf(child)).toBe(-1);
        expect(child.parent).not.toBe(parent);
        expect(listener).toHaveBeenCalled();
    });
});