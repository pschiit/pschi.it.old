import { Matrix2 } from '../../../src/libs/math/Matrix2';
import { Matrix3 } from '../../../src/libs/math/Matrix3';
import { Matrix4 } from '../../../src/libs/math/Matrix4';
import { Vector2 } from '../../../src/libs/math/Vector2';

const array = [
    2, 4,
    6, 8];

const operand = [
    8, 6,
    4, 2];

describe('initialize Matrix2', () => {
    test('without an array', () => {
        const result = new Matrix2();
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
    });
    test('with an array of number', () => {
        const result = new Matrix2(array);
        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
        expect(result[2]).toBe(array[2]);
        expect(result[3]).toBe(array[3]);
    });

    test('as identity Matrix2', () => {
        const result = Matrix2.identityMatrix();
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(1);
    });
});

describe('Convert Matrix2 to', () => {
    test('Matrix3', () => {
        const result = new Matrix2(array).toMatrix3();
        const expected = new Matrix3([
            2, 4, 0,
            6, 8, 0,
            0, 0, 1]);
        expect(result).toEqual(expected);
    });
    test('Matrix4', () => {
        const result = new Matrix2(array).toMatrix4();
        const expected = new Matrix4([
            2, 4, 0, 0,
            6, 8, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);
        expect(result).toEqual(expected);
    });
});

describe('Matrix2 operations', () => {
    test('add a Matrix2', () => {
        const result = new Matrix2(array).add(new Matrix2(operand));
        const expected = new Matrix2([10, 10, 10, 10]);
        expect(result).toEqual(expected);
    });

    test('substract a Matrix2', () => {
        const result = new Matrix2(array).substract(new Matrix2(operand));
        const expected = new Matrix2([-6, -2, 2, 6]);
        expect(result).toEqual(expected);
    });

    test('multiply a Matrix2', () => {
        const result = new Matrix2(array).multiply(new Matrix2(operand));
        const expected = new Matrix2([52, 80, 20, 32]);
        expect(result).toEqual(expected);
    });

    test('scale a Matrix2', () => {
        const result = new Matrix2(array).scale(new Vector2([4, 2]));
        const expected = new Matrix2([8, 16, 12, 16]);
        expect(result).toEqual(expected);
    });

    test('rotate a Matrix2', () => {
        const result = new Matrix2(array).rotate(Math.PI);
        const expected = new Matrix2([-2, -4, -6, -8]);
        expect(result).toEqual(expected);
    });

    test('transpose a Matrix2', () => {
        const result = new Matrix2(array).transpose();
        const expected = new Matrix2([2, 6, 4, 8]);
        expect(result).toEqual(expected);
    });

    test('determinant of a Matrix2', () => {
        const result = new Matrix2(array).determinant();
        const expected = -40;
        expect(result).toBe(expected);
    });

    test('invert a Matrix2', () => {
        const result = new Matrix2(array).invert();
        const det = 1.0 / -40;
        const expected = new Matrix2([
            2 * det, -4 * det,
            -6 * det, 8 * det]);
        expect(result).toEqual(expected);
    });

    describe('when Matrix2 determinant == 0', () => {
        test('determinant of a Matrix2', () => {
            const result = new Matrix3([1,2,3,4]).determinant();
            expect(result).toBe(0);
        });

        test('invert a Matrix2 return null', () => {
            const result = new Matrix3([1,2,3,4]).invert();
            expect(result).toBeNull();
        });
    });

    describe('when Matrix2 determinant != 0', () => {
        test('determinant of a Matrix2', () => {
            const result = new Matrix2(array).determinant();
            const expected = -40;
            expect(result).toBe(expected);
        });
    
        test('invert a Matrix2', () => {
            const result = new Matrix2(array).invert();
            const det = 1.0 / -40;
            const expected = new Matrix2([
                2 * det, -4 * det,
                -6 * det, 8 * det]);
            expect(result).toEqual(expected);
        });
    });
});