import { Parameter } from './Parameter';

export class Varying extends Parameter {
    constructor(type, name) {
        super(type, name);
    }

    getDeclaration() {
        return `varying ${this.type} ${this.name};`
    }
}