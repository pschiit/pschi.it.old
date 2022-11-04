const hex = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df', 'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff'];

export class Node {
    /** Create a new Node
    */
    constructor() {
        this.id = Node.generate();
        this.parent = null;
        this.childrens = [];
        this.listeners = {};
        this.visible = true;
    }

    /** Validate type of Node (used for appendChild) 
     * Can be override to restrict the type of Node you can append to the current Node
     * @throws {Error} when node is not of type Node
     */
    validateType(node) {
        if (!(node instanceof Node)) {
            throw new Error(`${node.constructor.name} can't be child of ${this.constructor.name}.`);
        }
    }

    /** Append a child Node to the current Node
     * and update the child's parent to the new current Node
     * @param {Node} child the node to append 
     * @return the current Node
    */
    appendChild(child) {
        if (this === child) {
            throw new Error(`Node ${child.id} can't be his own child.`);
        }
        this.validateType(child);
        if (child.parent) {
            child.parent.removeChild(child);
        }

        child.parent = this;
        this.childrens.push(child);
        this.dispatchEvent({ type: Node.event.nodeInserted, inserted: child });

        return this;
    }

    /** Remove a child Node to the current Node
     * and remove the child's parent
     * @param {Node} child the node to remove to 
     * @return the current Node
    */
    removeChild(child) {
        const index = this.childrens.indexOf(child);
        if (index === -1) {
            throw new Error(`Node ${child.id} not found.`);
        }

        child.parent = null;
        this.childrens.splice(index, 1);
        this.dispatchEvent({ type: Node.event.nodeRemoved, removed: child });

        return this;
    }

    /** Registers an event handler of a specific event type on the current Node
     * @param {string} type the type of event for which to add an event listener
     * @param {Function} listener event listener to be added
    */
    addEventListener(type, listener) {
        if (this.listeners[type] === undefined) {
            this.listeners[type] = [];
        }
        if (this.listeners[type].indexOf(listener) === - 1) {
            this.listeners[type].push(listener);
        }
    }

    /** Removes an event listener from the current Node
     * @param {string} type the type of event for which to remove an event listener
     * @param {Function} listener the event listener to be removed
    */
    removeEventListener(type, listener) {
        if (this.listeners[type] !== undefined) {
            const index = this.listeners[type].indexOf(listener);
            if (index !== -1) {
                this.listeners[type].splice(index, 1);
                return;
            }
        }
        throw new Error(`Listener ${type} ${listener} not found on Node ${this.id}.`);
    }

    /** Dispatches an event to the current Node
     * the event will carry the current Node as target
     * @param {Object} event the object to dispatch
    */
    dispatchEvent(event) {
        if (this.listeners[event.type] !== undefined) {
            event.target = this;

            // Make a copy, in case listeners are removed while iterating.
            const listeners = this.listeners[event.type].slice(0);
            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i].call(this, event);
            }
        }
    }

    /** Convert the current Node to JSON
     * @return {string} the stringify JSON version of the current Node
    */
    get JSON(){
        return JSON.stringify(this);
    }

    /** Generate a random uuid
     * @returns {string} uuid
     */
    static generate() {
        const d0 = Math.random() * 0xffffffff | 0;
        const d1 = Math.random() * 0xffffffff | 0;
        const d2 = Math.random() * 0xffffffff | 0;
        const d3 = Math.random() * 0xffffffff | 0;
        const uuid = hex[d0 & 0xff] + hex[d0 >> 8 & 0xff] + hex[d0 >> 16 & 0xff] + hex[d0 >> 24 & 0xff] + '-' +
            hex[d1 & 0xff] + hex[d1 >> 8 & 0xff] + '-' + hex[d1 >> 16 & 0x0f | 0x40] + hex[d1 >> 24 & 0xff] + '-' +
            hex[d2 & 0x3f | 0x80] + hex[d2 >> 8 & 0xff] + '-' + hex[d2 >> 16 & 0xff] + hex[d2 >> 24 & 0xff] +
            hex[d3 & 0xff] + hex[d3 >> 8 & 0xff] + hex[d3 >> 16 & 0xff] + hex[d3 >> 24 & 0xff];

        // .toLowerCase() here flattens concatenated strings to save heap memory space.
        return uuid.toLowerCase();
    }


    /** List of event for the Node class
    */
    static event = {
        nodeInserted: 'node-inserted',
        nodeRemoved: 'node-removed',
    }
}