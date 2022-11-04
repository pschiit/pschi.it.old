import { Matrix2 } from '../../../src/libs/math/Matrix2';
import { Matrix3 } from '../../../src/libs/math/Matrix3';
import { Matrix4 } from '../../../src/libs/math/Matrix4';
import { Vector3 } from '../../../src/libs/math/Vector3';

const array = [
    2, 4, 6, 8,
    10, 12, 14, 16,
    18, 20, 22, 24,
    26, 28, 30, 32];
const operand = [
    32, 30, 28, 26,
    24, 22, 20, 18,
    16, 14, 12, 10,
    8, 6, 4, 2];

describe('initialize Matrix4', () => {
    test('without an array', () => {
        const result = new Matrix4();
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
        expect(result[4]).toBe(0);
        expect(result[5]).toBe(0);
        expect(result[6]).toBe(0);
        expect(result[7]).toBe(0);
        expect(result[8]).toBe(0);
        expect(result[9]).toBe(0);
        expect(result[10]).toBe(0);
        expect(result[11]).toBe(0);
        expect(result[12]).toBe(0);
        expect(result[13]).toBe(0);
        expect(result[14]).toBe(0);
        expect(result[15]).toBe(0);
    });
    test('with an array of number', () => {
        const result = new Matrix4(array);
        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
        expect(result[2]).toBe(array[2]);
        expect(result[3]).toBe(array[3]);
        expect(result[4]).toBe(array[4]);
        expect(result[5]).toBe(array[5]);
        expect(result[6]).toBe(array[6]);
        expect(result[7]).toBe(array[7]);
        expect(result[8]).toBe(array[8]);
        expect(result[9]).toBe(array[9]);
        expect(result[10]).toBe(array[10]);
        expect(result[11]).toBe(array[11]);
        expect(result[12]).toBe(array[12]);
        expect(result[13]).toBe(array[13]);
        expect(result[14]).toBe(array[14]);
        expect(result[15]).toBe(array[15]);
    });

    test('as identity Matrix4', () => {
        const result = Matrix4.identityMatrix();
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
        expect(result[4]).toBe(0);
        expect(result[5]).toBe(1);
        expect(result[6]).toBe(0);
        expect(result[7]).toBe(0);
        expect(result[8]).toBe(0);
        expect(result[9]).toBe(0);
        expect(result[10]).toBe(1);
        expect(result[11]).toBe(0);
        expect(result[12]).toBe(0);
        expect(result[13]).toBe(0);
        expect(result[14]).toBe(0);
        expect(result[15]).toBe(1);
    });

    test('as lookAt Matrix4', () => {
        const eye = new Vector3(0, 0, 0);
        const center = new Vector3(0, 0, 10);
        const up = new Vector3(0, 1, 0);
        const result = Matrix4.lookAtMatrix(eye, center, up);
        const expected = new Float32Array([
            -1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, -1, 0,
            -0, -0, -0, 1]);
        expect(result[0]).toBe(expected[0]);
        expect(result[1]).toBe(expected[1]);
        expect(result[2]).toBe(expected[2]);
        expect(result[3]).toBe(expected[3]);
        expect(result[4]).toBe(expected[4]);
        expect(result[5]).toBe(expected[5]);
        expect(result[6]).toBe(expected[6]);
        expect(result[7]).toBe(expected[7]);
        expect(result[8]).toBe(expected[8]);
        expect(result[9]).toBe(expected[9]);
        expect(result[10]).toBe(expected[10]);
        expect(result[11]).toBe(expected[11]);
        expect(result[12]).toBe(expected[12]);
        expect(result[13]).toBe(expected[13]);
        expect(result[14]).toBe(expected[14]);
        expect(result[15]).toBe(expected[15]);
    });

    test('as perspective Matrix4', () => {
        const fovy = 45;
        const aspect = 4 / 3;
        const near = 1;
        const far = 1000;
        const result = Matrix4.perspectiveMatrix(fovy, aspect, near, far);
        const expected = new Float32Array([
            1.3444432020187378, 0, 0, 0,
            0, 1.7925909757614136, 0, 0,
            0, 0, -1.0020020008087158, -1,
            0, 0, -2.002002000808716, 0]);
        expect(result[0]).toBe(expected[0]);
        expect(result[1]).toBe(expected[1]);
        expect(result[2]).toBe(expected[2]);
        expect(result[3]).toBe(expected[3]);
        expect(result[4]).toBe(expected[4]);
        expect(result[5]).toBe(expected[5]);
        expect(result[6]).toBe(expected[6]);
        expect(result[7]).toBe(expected[7]);
        expect(result[8]).toBe(expected[8]);
        expect(result[9]).toBe(expected[9]);
        expect(result[10]).toBe(expected[10]);
        expect(result[11]).toBe(expected[11]);
        expect(result[12]).toBe(expected[12]);
        expect(result[13]).toBe(expected[13]);
        expect(result[14]).toBe(expected[14]);
        expect(result[15]).toBe(expected[15]);
    });

    test('as orthogonal Matrix4', () => {
        const left = -100;
        const right = 100;
        const bottom = -100;
        const top = 100;
        const near = 1;
        const far = 100;
        const result = Matrix4.orthographicMatrix(left, right, bottom, top, near, far);
        const expected = new Float32Array([
            0.009999999776482582, 0, 0, 0,
            0, 0.009999999776482582, 0, 0,
            0, 0, -0.020202020183205605, 0,
            -0, -0, -1.0202020406723022, 1]);
        expect(result[0]).toBe(expected[0]);
        expect(result[1]).toBe(expected[1]);
        expect(result[2]).toBe(expected[2]);
        expect(result[3]).toBe(expected[3]);
        expect(result[4]).toBe(expected[4]);
        expect(result[5]).toBe(expected[5]);
        expect(result[6]).toBe(expected[6]);
        expect(result[7]).toBe(expected[7]);
        expect(result[8]).toBe(expected[8]);
        expect(result[9]).toBe(expected[9]);
        expect(result[10]).toBe(expected[10]);
        expect(result[11]).toBe(expected[11]);
        expect(result[12]).toBe(expected[12]);
        expect(result[13]).toBe(expected[13]);
        expect(result[14]).toBe(expected[14]);
        expect(result[15]).toBe(expected[15]);
    });
});

describe('Convert Matrix4 to', () => {
    test('Matrix2', () => {
        const result = new Matrix4(array).toMatrix2();
        const expected = new Matrix2([
            2, 4,
            10, 12]);
        expect(result).toEqual(expected);
    });
    test('Matrix3', () => {
        const result = new Matrix4(array).toMatrix3();
        const expected = new Matrix3([
            2, 4, 6,
            10, 12, 14,
            18, 20, 22]);
        expect(result).toEqual(expected);
    });
});

describe('Matrix4 operations', () => {
    test('add a Matrix4', () => {
        const result = new Matrix4(array).add(new Matrix4(operand));
        const expected = new Matrix4([
            34, 34, 34, 34,
            34, 34, 34, 34,
            34, 34, 34, 34,
            34, 34, 34, 34]);
        expect(result).toEqual(expected);
    });

    test('substract a Matrix4', () => {
        const result = new Matrix4(array).substract(new Matrix4(operand));
        const expected = new Matrix4([
            -30, -26, -22, -18,
            -14, -10, -6, -2,
            2, 6, 10, 14,
            18, 22, 26, 30]);
        expect(result).toEqual(expected);
    });

    test('multiply a Matrix4', () => {
        const result = new Matrix4(array).multiply(new Matrix4(operand));
        const expected = new Matrix4([
            1544, 1776, 2008, 2240,
            1096, 1264, 1432, 1600,
            648, 752, 856, 960,
            200, 240, 280, 320]);
        expect(result).toEqual(expected);
    });

    test('scale a Matrix4', () => {
        const result = new Matrix4(array).scale(new Vector3([6, 4, 2]));
        const expected = new Matrix4([
            12, 24, 36, 48,
            40, 48, 56, 64,
            36, 40, 44, 48,
            26, 28, 30, 32]);
        expect(result).toEqual(expected);
    });

    test('rotate a Matrix4', () => {
        const result = new Matrix4(array).rotate(Math.PI, new Vector3(1, 1, 1));
        const expected = new Matrix4([
            18, 20, 22, 24,
            10, 12, 14, 16,
            2, 4, 6, 8,
            26, 28, 30, 32]);
        expect(result).toEqual(expected);
    });

    test('translate a Matrix4', () => {
        const result = new Matrix4(array).translate(new Vector3([6, 4, 2]));
        const expected = new Matrix4([
            2, 4, 6, 8,
            10, 12, 14, 16,
            18, 20, 22, 24,
            114, 140, 166, 192]);
        expect(result).toEqual(expected);
    });


    test('transpose a Matrix4', () => {
        const result = new Matrix4(array).transpose();
        const expected = new Matrix4([
            2, 10, 18, 26,
            4, 12, 20, 28,
            6, 14, 22, 30,
            8, 16, 24, 32]);
        expect(result).toEqual(expected);
    });

    describe('when Matrix4 determinant == 0', () => {
        test('determinant of a Matrix4', () => {
            const result = new Matrix4(array).determinant();
            expect(result).toBe(0);
        });

        test('invert a Matrix4 return null', () => {
            const result = new Matrix4(array).invert();
            expect(result).toBeNull();
        });
    });

    describe('when Matrix4 determinant != 0', () => {
        test('determinant of a Matrix4', () => {
            const result = new Matrix4([
                1, 0, 3, 5,
                2, 3, 4, 2,
                2, 0, 3, 5,
                2, 1, 0, 2]).determinant();
            const expected = -32;
            expect(result).toBe(expected);
        });

        test('invert a Matrix4 return null', () => {
            const result = new Matrix4([
                1, 0, 3, 5,
                2, 3, 4, 2,
                2, 0, 3, 5,
                2, 1, 0, 2]).invert();
            const expected = new Matrix4([
                -1, -0, 1, -0,
                0.75, 0.1875, -1, 0.4375,
                -0.375, 0.15625, 0.5, -0.46875,
                0.625, -0.09375, -0.5, 0.28125]);
            expect(result).toEqual(expected);
        });
    });
});