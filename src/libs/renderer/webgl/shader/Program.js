import { Node } from '../../../core/Node';
import { Attribute } from './parameter/Attribute';
import { Uniform } from './parameter/Uniform';
import { Shader } from './Shader';

export class Program extends Node {
    constructor() {
        super();
        this.parameters = {};

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (child instanceof Shader) {
                child.parameters.forEach(p => {
                    if(p instanceof Attribute || p instanceof Uniform){
                        this.parameters[p.name] = p;
                    }
                });
            }
        });
        this.addEventListener(Node.event.nodeRemoved, (e) => {
            const child = e.removed;
            if (child instanceof Shader) {
                child.parameters.forEach(p => {
                    if(this.parameters[p.name]){
                        this.parameters[p.name] = null;
                    }
                });
            }
        });
    }

    /** Validate type of Node (used for appendChild) 
     * @param {Node} node node to validate
     * @throws {Error} when node is not of type Shader
     */
    validateType(node) {
        if (!(node instanceof Shader)) {
            throw new Error(`${node.constructor.name} can't be child of ${this.constructor.name}.`);
        }
    }
}