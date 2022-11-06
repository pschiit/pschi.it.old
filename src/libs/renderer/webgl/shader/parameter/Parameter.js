export class Parameter {
    constructor(type, name) {
        this.type = type;
        this.name = name;
        this.set = null;
    }

    toString() {
        return this.name;
    }
}