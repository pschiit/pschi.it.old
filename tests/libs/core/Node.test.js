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
    test('should throw Error if child cannot be found', () => {
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
    test('should append a child of type Node, update child.parent and trigger event.nodeRemoved', () => {
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

describe('When adding an event listener to a Node', () => {
    test('should add it to the listeners of the node', () => {
        const node = new Node();
        const listener = jest.fn();
        node.addEventListener(Node.event.nodeInserted, listener);
    
        expect(node.listeners[Node.event.nodeInserted]).not.toBeFalsy();
        expect(node.listeners[Node.event.nodeInserted].indexOf(listener)).toBe(0);
    });

    test('should not add it to the listeners of the node if the listener is already here', () => {
        const node = new Node();
        const listener = jest.fn();
        node.addEventListener(Node.event.nodeInserted, listener);        
        node.addEventListener(Node.event.nodeInserted, listener);

        expect(node.listeners[Node.event.nodeInserted].length).toBe(1);
    });
});

describe('When removing an event listener from a Node', () => {
    test('should remove it from the listeners of the node', () => {
        const node = new Node();
        const listener = jest.fn();
        node.listeners[Node.event.nodeInserted] = [listener];
        node.removeEventListener(Node.event.nodeInserted, listener);
    
        expect(node.listeners[Node.event.nodeInserted]).not.toBeFalsy();
        expect(node.listeners[Node.event.nodeInserted].indexOf(listener)).toBe(-1);
    });

    test('should throw Error if listener cannot be found', () => {
        const node = new Node();
        const listener = jest.fn();
        function removeEventListener() {
            node.removeEventListener(listener);
        }

        expect(removeEventListener).toThrow();
        expect(node.listeners[Node.event.nodeInserted]).toBeFalsy();

        node.listeners[Node.event.nodeInserted] = [];
        expect(removeEventListener).toThrow();
        expect(node.listeners[Node.event.nodeInserted].length).toBe(0);
    });
});

describe('When dispatching an event listener on a Node', () => {
    test('should do nothing if no related listener', () => {
        const node = new Node();
        const listener = jest.fn();
        node.listeners[Node.event.nodeInserted] = [listener];
        node.dispatchEvent({type : Node.event.nodeRemoved});
    
        expect(listener).not.toHaveBeenCalled();
    });

    test('should trigger all related listener', () => {
        const node = new Node();
        const listener = jest.fn();
        const listener2 = jest.fn();
        node.listeners[Node.event.nodeInserted] = [listener, listener2];
        node.dispatchEvent({type : Node.event.nodeInserted});
    
        expect(listener).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
    });
});