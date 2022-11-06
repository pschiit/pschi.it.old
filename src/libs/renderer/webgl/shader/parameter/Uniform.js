import { Parameter } from './Parameter';

export class Uniform extends Parameter {
    constructor(type, name) {
        super(type, name);
    }
    
    getDeclaration() {
        return `uniform ${this.type} ${this.name};`
    }
}