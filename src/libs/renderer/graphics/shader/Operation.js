import ShaderNode from './ShaderNode';

export default class Operation extends ShaderNode {
    constructor(symbol, operands) {
        super();
        this.symbol = symbol;
        this.operands = operands;
    }

    toString() {
        const symbol = ' ' + this.symbol + ' ';
        return this.operands.join(symbol);
    }

    static symbol = {
        equal: '=',
        add: '+',
        substract: '-',
        multiply: '*',
        divide: '/',
    }

    static equal(operands) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            operands = result;
        }
        return new Operation(Operation.symbol.equal, operands);
    }

    static add(operands) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            operands = result;
        }
        return new Operation(Operation.symbol.add, operands);
    }

    static substract(operands) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            operands = result;
        }
        return new Operation(Operation.symbol.substract, operands);
    }

    static multiply(operands) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            operands = result;
        }
        return new Operation(Operation.symbol.multiply, operands);
    }

    static divide(operands) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            operands = result;
        }
        return new Operation(Operation.symbol.divide, operands);
    }
}