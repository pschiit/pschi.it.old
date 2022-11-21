export default class  MathArray extends Float32Array {
    constructor(length){
        super(length);
    }

    clone() {
        return new this.constructor(this);
    }
}