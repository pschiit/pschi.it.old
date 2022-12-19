import Vector2 from '../../../math/Vector2';
import Vector3 from '../../../math/Vector3';
import Vector4 from '../../../math/Vector4';
import ShaderNode from './ShaderNode';

export default class Conversion extends ShaderNode {
    constructor(parameter, output, defaultValue = 0) {
        super();
        this.parameter = parameter;
        this.output = output;
        this.defaultValue = defaultValue;
    }

    get missingValueCount() {
        return this.output === Vector4 ?
            this.parameter.type === Vector2 ? 2 :
                this.parameter.type === Vector3 ? 1
                    : 0
            : this.output === Vector3 && this.parameter.type instanceof Vector2 ? 1
                : 0
    }

    static toVector2(parameter, defaultValue = 0) {
        return new Conversion(parameter, Vector2, defaultValue);
    }

    static toVector3(parameter, defaultValue = 0) {
        return new Conversion(parameter, Vector3, defaultValue);
    }

    static toVector4(parameter, defaultValue = 0) {
        return new Conversion(parameter, Vector4, defaultValue);
    }
}