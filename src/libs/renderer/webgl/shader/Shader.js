import { Node } from '../../../core/Node';

export class Shader extends Node {
    constructor(type, parameters, script) {
        super();
        this.parameters = parameters || [];
        this.script = script || '';
        this.type = type;
    }

    get source() {
        const result = [];
        this.parameters.forEach(p => {
            result.push(p.getDeclaration());
        });
        result.push(this.script);

        return result.join('');
    }

    /** Validate type of Node (used for appendChild) 
     * @param {Node} node node to validate
     * @throws {Error} always
     */
    validateType(node) {
        throw new Error(`${node.constructor.name} can't be child of ${this.constructor.name}.`);
    }
}