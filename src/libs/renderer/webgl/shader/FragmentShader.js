import { Shader } from './Shader';

export class FragmentShader extends Shader {
    constructor(precision, parameters, script) {
        super('FRAGMENT_SHADER', parameters, script);
        this.precision = precision;
    }

    get source() {
        const result = [];
        if (this.precision) {
            result.push(`precision ${this.precision} float;`);
        }
        result.push(super.source);

        return result.join('');
    }
}