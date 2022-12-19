import Vector2 from '../../../math/Vector2';
import Vector3 from '../../../math/Vector3';
import Vector4 from '../../../math/Vector4';
import ShaderNode from './ShaderNode';

export default class Operation extends ShaderNode {
    constructor(symbol, parameters = []) {
        super();
        this.symbol = symbol;
        this.parameters = parameters;
    }

    toString() {
        return this.parameters.join(this.symbol);
    }

    static symbol = {
        selection: '.',
        equal: ' = ',
        addTo: ' += ',
        substractTo: ' -= ',
        multiplyTo: ' *= ',
        divideTo: ' /= ',

        add: ' + ',
        substract: ' - ',
        multiply: ' * ',
        divide: ' / ',

        equals: ' == ',
        notEquals: ' != ',
        less: ' < ',
        lessEquals: ' <= ',
        greater: ' > ',
        greaterEquals: ' >=',

        if: 'if',
        discard: 'discard',
        return: 'return',

        abs: 'abs',
        fract: 'fract',
        fWidth: 'fWidth',
        normalize: 'normalize',
        min: 'min',
        max: 'max',
        distance: 'distance',
        pow: 'pow',
        mix: 'mix',

        toVector2: Vector2,
        toVector3: Vector3,
        toVector4: Vector4,

    }

    static selection(parameter, value) {
        return new Operation(Operation.symbol.selection, [parameter, value]);
    }

    static equal(parameter, value) {
        return new Operation(Operation.symbol.equal, [parameter, value]);
    }

    static addTo(parameter, value) {
        return new Operation(Operation.symbol.addTo, [parameter, value]);
    }

    static substractTo(parameter, value) {
        return new Operation(Operation.symbol.substractTo, [parameter, value]);
    }

    static multiplyTo(parameter, value) {
        return new Operation(Operation.symbol.multiplyTo, [parameter, value]);
    }

    static divideTo(parameter, value) {
        return new Operation(Operation.symbol.divideTo, [parameter, value]);
    }


    static add(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.add, parameters);
    }

    static substract(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.substract, parameters);
    }

    static multiply(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.multiply, parameters);
    }

    static divide(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.divide, parameters);
    }

    static equals(a, b) {
        return new Operation(Operation.symbol.equals, [a, b]);
    }
    static notEquals(a, b) {
        return new Operation(Operation.symbol.notEquals, [a, b]);
    }
    static less(a, b) {
        return new Operation(Operation.symbol.less, [a, b]);
    }
    static lessEquals(a, b) {
        return new Operation(Operation.symbol.lessEquals, [a, b]);
    }
    static greater(a, b) {
        return new Operation(Operation.symbol.greater, [a, b]);
    }
    static greaterEquals(a, b) {
        return new Operation(Operation.symbol.greaterEquals, [a, b]);
    }


    static toVector2(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        } else if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }
        return new Operation(Operation.symbol.toVector2, parameters);
    }

    static toVector3(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        } else if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }
        return new Operation(Operation.symbol.toVector3, parameters);
    }

    static toVector4(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        } else if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }
        return new Operation(Operation.symbol.toVector4, parameters);
    }

    static do(shaderFunction, parameters) {
        if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }
        return new Operation(shaderFunction, parameters);
    }

    static abs(parameter) {
        return new Operation(Operation.symbol.abs, [parameter]);
    }

    static fract(parameter) {
        return new Operation(Operation.symbol.fract, [parameter]);
    }

    static fWidth(parameter) {
        return new Operation(Operation.symbol.fWidth, [parameter]);
    }

    static normalize(vector) {
        return new Operation(Operation.symbol.normalize, [vector]);
    }

    static max(a, b) {
        return new Operation(Operation.symbol.max, [a, b]);
    }

    static min(a, b) {
        return new Operation(Operation.symbol.min, [a, b]);
    }

    static distance(a, b) {
        return new Operation(Operation.symbol.distance, [a, b]);
    }

    static pow(a, b) {
        return new Operation(Operation.symbol.pow, [a, b]);
    }

    static mix(a, b, c) {
        return new Operation(Operation.symbol.mix, [a, b, c]);
    }

    static if(condition, operations) {
        if (!Array.isArray(operations)) {
            operations = [operations];
        }
        return new Operation(Operation.symbol.if, [condition, operations]);
    }

    static return(value) {
        return new Operation(Operation.symbol.return, [value]);
    }

    static discard() {
        return new Operation(Operation.symbol.discard, []);
    }
}