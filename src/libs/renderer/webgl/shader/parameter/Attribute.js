import { Parameter } from './Parameter';

export class Attribute extends Parameter {
    constructor(type, name) {
        super(type, name);
        this.vertexAttribArray = false;
    }

    getDeclaration() {
        return `attribute ${this.type} ${this.name};`;
    }
}