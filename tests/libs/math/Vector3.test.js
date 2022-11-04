import { Matrix3 } from '../../../src/libs/math/Matrix3';
import { Matrix4 } from '../../../src/libs/math/Matrix4';
import { Vector2 } from '../../../src/libs/math/Vector2';
import { Vector3 } from '../../../src/libs/math/Vector3';
import { Vector4 } from '../../../src/libs/math/Vector4';

describe('initialize Vector3', () => {
    test('with x', () => {
        const x = 2;
        const result = new Vector3(x);
        expect(result[0]).toBe(x);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
    });
    test('with xy', () => {
        const x = 2;
        const y = 4;
        const result = new Vector3(x, y);
        expect(result[0]).toBe(x);
        expect(result[1]).toBe(y);
        expect(result[2]).toBe(0);
    });
    test('with xyz', () => {
        const x = 2;
        const y = 4;
        const z = 6;
        const result = new Vector3(x, y, z);
        expect(result[0]).toBe(x);
        expect(result[1]).toBe(y);
        expect(result[2]).toBe(z);
    });
    test('with an array of number', () => {
        const array = [2, 4, 6];
        const result = new Vector3(array);
        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
        expect(result[2]).toBe(array[2]);
    });
    test('with an array with more than 3 number', () => {
        const array = [2, 4, 6, 8];
        const result = new Vector3(array);
        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
        expect(result[2]).toBe(array[2]);
    });
});

describe('Convert <2,4,6> to', () => {
    test('Vector2', () => {
        const result = new Vector3(2, 4, 6).toVector2();
        const expected = new Vector2(2, 4);
        expect(result).toEqual(expected);
    });
    test('Vector4 without w', () => {
        const result = new Vector3(2, 4, 6).toVector4();
        const expected = new Vector4(2, 4, 6);
        expect(result).toEqual(expected);
    });
    test('Vector4 with w = 8', () => {
        const result = new Vector3(2, 4, 6).toVector4(8);
        const expected = new Vector4(2, 4, 6, 8);
        expect(result).toEqual(expected);
    });
});

describe('Vector3 operations', () => {
    describe('<2,4,6> + <6,4,2> = <8,8,8>', () => {
        test('with a Vector2', () => {
            const result = new Vector3(2, 4, 6).add(new Vector3(6, 4, 2));
            const expected = new Vector3(8, 8, 8);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector3(2, 4, 6).add([6, 4, 2]);
            const expected = new Vector3(8, 8, 8);
            expect(result).toEqual(expected);
        });
    });

    describe('<2,4,6> - <6,4,2> = <-4,0,4>', () => {
        test('with a Vector2', () => {
            const result = new Vector3(2, 4, 6).substract(new Vector3(6, 4, 2));
            const expected = new Vector3(-4, 0, 4);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector3(2, 4, 6).substract([6, 4, 2]);
            const expected = new Vector3(-4, 0, 4);
            expect(result).toEqual(expected);
        });
    });

    describe('<2,4,6> * <6,4,2> = <12,16,12>', () => {
        test('with a Vector2', () => {
            const result = new Vector3(2, 4, 6).multiply(new Vector3(6, 4, 2));
            const expected = new Vector3(12, 16, 12);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector3(2, 4, 6).multiply([6, 4, 2]);
            const expected = new Vector3(12, 16, 12);
            expect(result).toEqual(expected);
        });
    });

    describe('<2,4,6> / <6,4,2> = <2/6,1,3>', () => {
        test('with a Vector2', () => {
            const result = new Vector3(2, 4, 6).divide(new Vector3(6, 4, 2));
            const expected = new Vector3(2 / 6, 1, 3);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector3(2, 4, 6).divide([6, 4, 2]);
            const expected = new Vector3(2 / 6, 1, 3);
            expect(result).toEqual(expected);
        });
    });

    test('<2,4,6> * 2 = <4,8,12>', () => {
        const result = new Vector3(2, 4, 6).scale(2);
        const expected = new Vector3(4, 8, 12);
        expect(result).toEqual(expected);
    });

    describe('<2,4,6> x <6,4,2> = <-16,32,-16>', () => {
        test('with a Vector2', () => {
            const result = new Vector3(2, 4, 6).cross(new Vector3(6, 4, 2));
            const expected = new Vector3(-16, 32, -16);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector3(2, 4, 6).cross([6, 4, 2]);
            const expected = new Vector3(-16, 32, -16);
            expect(result).toEqual(expected);
        });
    });

    describe('<2,4,6> . <6,4,2> = 40', () => {
        test('with a Vector2', () => {
            const result = new Vector3(2, 4, 6).dot(new Vector3(6, 4, 2));
            const expected = 40;
            expect(result).toBe(expected);
        });
        test('with an array of number', () => {
            const result = new Vector3(2, 4, 6).dot([6, 4, 2]);
            const expected = 40;
            expect(result).toBe(expected);
        });
    });
});

describe('Normalize', () => {
    test('<2,4,6> => <>', () => {
        const x = 2;
        const y = 4;
        const z = 6;
        let dot = x * x + y * y + z * z;

        if (dot > 0) {
            dot = 1 / Math.sqrt(dot);
        }
        const result = new Vector3(x, y, z).normalize();
        const expected = new Vector3(x * dot, y * dot, z * dot);
        expect(result).toEqual(expected);
    });
    test('<0,0,0> => <0,0,0>', () => {
        const result = new Vector3().normalize();
        const expected = new Vector3();
        expect(result).toEqual(expected);
    });
});

describe('Transform <2,4,6>', () => {
    test('with a Matrix3', () => {
        const x = 2;
        const y = 4;
        const z = 6;
        const matrix = new Matrix3([2, 1, 3, 4, 7, 6, 8, 9]);
        const result = new Vector3(x, y, z).transform(matrix);
        const expected = new Vector3(
            matrix[0] * x + matrix[3] * y + matrix[6] * z,
            matrix[1] * x + matrix[4] * y + matrix[7] * z,
            matrix[2] * x + matrix[5] * y + matrix[8] * z);
        expect(result).toEqual(expected);
    });

    test('with a Matrix4', () => {
        const x = 2;
        const y = 4;
        const z = 6;
        const matrix = new Matrix4([2, 1, 3, 4, 7, 6, 8, 9, 11, 10, 12, 13, 15, 14, 16]);
        const result = new Vector3(x, y, z).transform(matrix);
        let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
        w = w || 1.0;
        const expected = new Vector3(
            (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w,
            (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w,
            (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w);
        expect(result).toEqual(expected);
    });
});