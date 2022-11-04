import { Matrix4 } from '../../../src/libs/math/Matrix4';
import { Vector2 } from '../../../src/libs/math/Vector2';
import { Vector3 } from '../../../src/libs/math/Vector3';
import { Vector4 } from '../../../src/libs/math/Vector4';

describe('initialize Vector4', () => {
    test('with x', () => {
        const x = 2;
        const result = new Vector4(x);
        expect(result[0]).toBe(x);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
    });
    test('with xy', () => {
        const x = 2;
        const y = 4;
        const result = new Vector4(x, y);
        expect(result[0]).toBe(x);
        expect(result[1]).toBe(y);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(0);
    });
    test('with xyz', () => {
        const x = 2;
        const y = 4;
        const z = 6;
        const result = new Vector4(x, y, z);
        expect(result[0]).toBe(x);
        expect(result[1]).toBe(y);
        expect(result[2]).toBe(z);
        expect(result[3]).toBe(0);
    });
    test('with xyzw', () => {
        const x = 2;
        const y = 4;
        const z = 6;
        const w = 8;
        const result = new Vector4(x, y, z, w);
        expect(result[0]).toBe(x);
        expect(result[1]).toBe(y);
        expect(result[2]).toBe(z);
        expect(result[3]).toBe(w);
    });
    test('with an array of number', () => {
        const array = [2, 4, 6, 8];
        const result = new Vector4(array);
        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
        expect(result[2]).toBe(array[2]);
        expect(result[3]).toBe(array[3]);
    });
    test('with an array with more than 3 number', () => {
        const array = [2, 4, 6, 8, 10];
        const result = new Vector4(array);
        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
        expect(result[2]).toBe(array[2]);
        expect(result[3]).toBe(array[3]);
    });
});

describe('Convert <2,4,6,8> to', () => {
    test('Vector2', () => {
        const result = new Vector4(2, 4, 6, 8).toVector2();
        const expected = new Vector2(2, 4);
        expect(result).toEqual(expected);
    });
    test('Vector3', () => {
        const result = new Vector4(2, 4, 6, 8).toVector3();
        const expected = new Vector3(2, 4, 6);
        expect(result).toEqual(expected);
    });
});

describe('Vector3 operations', () => {
    describe('<2,4,6,8> + <8,6,4,2> = <10,10,10,10>', () => {
        test('with a Vector2', () => {
            const result = new Vector4(2, 4, 6, 8).add(new Vector4(8, 6, 4, 2));
            const expected = new Vector4(10, 10, 10, 10);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector4(2, 4, 6, 8).add([8, 6, 4, 2]);
            const expected = new Vector4(10, 10, 10, 10);
            expect(result).toEqual(expected);
        });
    });

    describe('<2,4,6,8> - <8,6,4,2> = <-6,-2,2,6>', () => {
        test('with a Vector2', () => {
            const result = new Vector4(2, 4, 6, 8).substract(new Vector4(8, 6, 4, 2));
            const expected = new Vector4(-6, -2, 2, 6);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector4(2, 4, 6, 8).substract([8, 6, 4, 2]);
            const expected = new Vector4(-6, -2, 2, 6);
            expect(result).toEqual(expected);
        });
    });

    describe('<2,4,6,8> * <8,6,4,2> = <16,24,24,16>', () => {
        test('with a Vector2', () => {
            const result = new Vector4(2, 4, 6, 8).multiply(new Vector4(8, 6, 4, 2));
            const expected = new Vector4(16, 24, 24, 16);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector4(2, 4, 6, 8).multiply([8, 6, 4, 2]);
            const expected = new Vector4(16, 24, 24, 16);
            expect(result).toEqual(expected);
        });
    });

    describe('<2,4,6,8> / <8,6,4,2> = <2/8,4/6,3/2,4>', () => {
        test('with a Vector2', () => {
            const result = new Vector4(2, 4, 6, 8).divide(new Vector4(8, 6, 4, 2));
            const expected = new Vector4(2 / 8, 4 / 6, 3 / 2, 4);
            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector4(2, 4, 6, 8).divide([8, 6, 4, 2]);
            const expected = new Vector4(2 / 8, 4 / 6, 3 / 2, 4);
            expect(result).toEqual(expected);
        });
    });

    test('<2,4,6,8> * 2 = <4,8,12,16>', () => {
        const result = new Vector4(2, 4, 6, 8).scale(2);
        const expected = new Vector4(4, 8, 12, 16);
        expect(result).toEqual(expected);
    });

    describe('<2,4,6,8> . <8,6,4,2> = 80', () => {
        test('with a Vector2', () => {
            const result = new Vector4(2, 4, 6, 8).dot(new Vector4(8, 6, 4, 2));
            const expected = 80;
            expect(result).toBe(expected);
        });
        test('with an array of number', () => {
            const result = new Vector4(2, 4, 6, 8).dot([8, 6, 4, 2]);
            const expected = 80;
            expect(result).toBe(expected);
        });
    });
});

describe('Normalize', () => {
    test('<2,4,6,8> => <>', () => {
        const x = 2;
        const y = 4;
        const z = 6;
        const w = 6;
        let dot = x * x + y * y + z * z + w * w;

        if (dot > 0) {
            dot = 1 / Math.sqrt(dot);
        }
        const result = new Vector4(x, y, z, w).normalize();
        const expected = new Vector4(x * dot, y * dot, z * dot, w * dot);
        expect(result).toEqual(expected);
    });
    test('<0,0,0,0> => <0,0,0,0>', () => {
        const result = new Vector4().normalize();
        const expected = new Vector4();
        expect(result).toEqual(expected);
    });
});

describe('Transform <2,4,6,8>', () => {
    test('with a Matrix4', () => {
        const x = 2;
        const y = 4;
        const z = 6;
        const w = 6;
        const matrix = new Matrix4([2, 1, 3, 4, 7, 6, 8, 9, 11, 10, 12, 13, 15, 14, 16]);
        const result = new Vector4(x, y, z, w).transform(matrix);
        const expected = new Vector4(
            matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w,
            matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w,
            matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w,
            matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w);
        expect(result).toEqual(expected);
    });
});