import Matrix2 from'../../../src/libs/math/Matrix2';
import Matrix3 from'../../../src/libs/math/Matrix3';
import Matrix4 from'../../../src/libs/math/Matrix4';
import Vector2 from'../../../src/libs/math/Vector2';

const array = [
    2, 4, 6,
    8, 10, 12,
    14, 16, 18];
const operand = [
    18, 16, 14,
    12, 10, 8,
    6, 4, 2];

describe('initialize Matrix3', () => {
    test('without an array', () => {
        const result = new Matrix3();

        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
        expect(result[4]).toBe(0);
        expect(result[5]).toBe(0);
        expect(result[6]).toBe(0);
        expect(result[7]).toBe(0);
        expect(result[8]).toBe(0);
    });
    test('with an array of number', () => {
        const result = new Matrix3(array);

        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
        expect(result[2]).toBe(array[2]);
        expect(result[3]).toBe(array[3]);
        expect(result[4]).toBe(array[4]);
        expect(result[5]).toBe(array[5]);
        expect(result[6]).toBe(array[6]);
        expect(result[7]).toBe(array[7]);
        expect(result[8]).toBe(array[8]);
    });

    test('as identity Matrix3', () => {
        const result = Matrix3.identityMatrix();
        const expected = new Matrix3([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1]);

        expect(result).toEqual(expected);
    });

    test('as projection Matrix3', () => {
        const width = 640;
        const height = 480;
        const result = Matrix3.projectionMatrix(width, height);
        const expected = new Matrix3([
            2 / width, 0, 0
            , 0, -2 / height, 0,
            -1, 1, 1]);

        expect(result).toEqual(expected);
    });

    test('clone Matrix3', () => {
        const result = new Matrix3(array);
        const clone = result.clone();

        expect(result).not.toBe(clone);
        expect(result).toEqual(clone);
    });
});

describe('Convert Matrix3 to', () => {
    test('Matrix2', () => {
        const result = new Matrix3(array).toMatrix2();
        const expected = new Matrix2([
            2, 4,
            8, 10,]);

        expect(result).toEqual(expected);
    });
    test('Matrix4', () => {
        const result = new Matrix3(array).toMatrix4();
        const expected = new Matrix4([
            2, 4, 6, 0,
            8, 10, 12, 0,
            14, 16, 18, 0,
            0, 0, 0, 1]);

        expect(result).toEqual(expected);
    });
});

describe('Matrix3 operations', () => {
    describe('equals a Matrix3', () => {
        test('should return true if values are the same', () => {
            expect(new Matrix3(array).equals(new Matrix3(array))).toBeTruthy();
        });
        
        test('should return false if values are different', () => {
            expect(new Matrix3(array).equals(new Matrix3(operand))).toBeFalsy();
        });
    });
    test('add a Matrix3', () => {
        const result = new Matrix3(array).add(new Matrix3(operand));
        const expected = new Matrix3([
            20, 20, 20,
            20, 20, 20,
            20, 20, 20]);

        expect(result).toEqual(expected);
    });

    test('substract a Matrix3', () => {
        const result = new Matrix3(array).substract(new Matrix3(operand));
        const expected = new Matrix3([
            -16, -12, -8,
            -4, 0, 4,
            8, 12, 16]);

        expect(result).toEqual(expected);
    });

    test('multiply a Matrix3', () => {
        const result = new Matrix3(array).multiply(new Matrix3(operand));
        const expected = new Matrix3([
            360, 456, 552,
            216, 276, 336,
            72, 96, 120]);

        expect(result).toEqual(expected);
    });

    test('scale a Matrix3', () => {
        const result = new Matrix3(array).scale(new Vector2([6, 4]));
        const expected = new Matrix3([
            12, 24, 36,
            32, 40, 48,
            14, 16, 18]);

        expect(result).toEqual(expected);
    });

    test('rotate a Matrix3', () => {
        const result = new Matrix3(array).rotate(Math.PI);
        const expected = new Matrix3([
            -2, -4, -6,
            -8, -10, -12,
            14, 16, 18]);

        expect(result).toEqual(expected);
    });

    test('translate a Matrix3', () => {
        const result = new Matrix3(array).translate(new Vector2([6, 4, 2]));
        const expected = new Matrix3([
            2, 4, 6,
            8, 10, 12,
            58, 80, 102]);

        expect(result).toEqual(expected);
    });


    test('transpose a Matrix3', () => {
        const result = new Matrix3(array).transpose();
        const expected = new Matrix3([
            2, 8, 14,
            4, 10, 16,
            6, 12, 18]);

        expect(result).toEqual(expected);
    });

    describe('when Matrix3 determinant == 0', () => {
        test('determinant of a Matrix3', () => {
            const result = new Matrix3(array).determinant();

            expect(result).toBe(0);
        });

        test('invert a Matrix3 return null', () => {
            const result = new Matrix3(array).invert();
            expect(result).toBeNull();
        });
    });

    describe('when Matrix3 determinant != 0', () => {
        test('determinant of a Matrix3', () => {
            const result = new Matrix3([1, 0, 3, 5, 2, 3, 4, 2, 1]).determinant();
            const expected = 2;

            expect(result).toBe(expected);
        });

        test('invert a Matrix3 return null', () => {
            const result = new Matrix3([1, 0, 3, 5, 2, 3, 4, 2, 1]).invert();
            const expected = new Matrix3([
                -2, 3, -3,
                3.5, -5.5, 6,
                1, -1, 1]);

            expect(result).toEqual(expected);
        });
    });
});