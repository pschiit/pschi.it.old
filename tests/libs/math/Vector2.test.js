import { Matrix2 } from '../../../src/libs/math/Matrix2';
import { Matrix3 } from '../../../src/libs/math/Matrix3';
import { Matrix4 } from '../../../src/libs/math/Matrix4';
import { Vector2 } from '../../../src/libs/math/Vector2';
import { Vector3 } from '../../../src/libs/math/Vector3';
import { Vector4 } from '../../../src/libs/math/Vector4';

describe('initialize Vector2', () => {
    test('with x', () => {
        const x = 2;
        const result = new Vector2(x);

        expect(result[0]).toBe(x);
        expect(result[1]).toBe(0);
    });
    test('with x and y', () => {
        const x = 2;
        const y = 4;
        const result = new Vector2(x, y);

        expect(result[0]).toBe(x);
        expect(result[1]).toBe(y);
    });
    test('with an array of number', () => {
        const array = [2, 4];
        const result = new Vector2(array);
        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
    });
    test('with an array with more than 2 number', () => {
        const array = [2, 4, 6];
        const result = new Vector2(array);

        expect(result[0]).toBe(array[0]);
        expect(result[1]).toBe(array[1]);
    });
    
    test('clone Vector2', () => {
        const result = new Vector2([2, 4]);
        const clone = result.clone();

        expect(result).not.toBe(clone);
        expect(result).toEqual(clone);
    });
});

describe('Convert <2,4> to', () => {
    test('Vector3 without z', () => {
        const result = new Vector2(2, 4).toVector3();
        const expected = new Vector3(2, 4, 0);

        expect(result).toEqual(expected);
    });
    test('Vector3 with z = 6', () => {
        const result = new Vector2(2, 4).toVector3(6);
        const expected = new Vector3(2, 4, 6);

        expect(result).toEqual(expected);
    });
    test('Vector4 without z and w', () => {
        const result = new Vector2(2, 4).toVector4();
        const expected = new Vector4(2, 4, 0, 0);

        expect(result).toEqual(expected);
    });
    test('Vector4 with z = 6 and without w', () => {
        const result = new Vector2(2, 4).toVector4(6);
        const expected = new Vector4(2, 4, 6, 0);

        expect(result).toEqual(expected);
    });
    test('Vector4 with z = 6 and w = 8', () => {
        const result = new Vector2(2, 4).toVector4(6,8);
        const expected = new Vector4(2, 4, 6,8);

        expect(result).toEqual(expected);
    });
});

describe('Vector2 operations', () => {
    describe('equals a Vector2', () => {
        test('should return true if values are the same', () => {
            expect(new Vector2(2, 4).equals(new Vector2(2, 4))).toBeTruthy();
        });

        test('should return false if values are different', () => {
            expect(new Vector2(2, 4).equals(new Vector2(4,2))).toBeFalsy();
        });
    });

    describe('<2,4> + <4,2> = <6,6>', () => {
        test('with a Vector2', () => {
            const result = new Vector2(2, 4).add(new Vector2(4, 2));
            const expected = new Vector2(6, 6);

            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector2(2, 4).add([4, 2]);
            const expected = new Vector2(6, 6);

            expect(result).toEqual(expected);
        });
    });

    describe('<2,4> - <4,2> = <-2,2>', () => {
        test('with a Vector2', () => {
            const result = new Vector2(2, 4).substract(new Vector2(4, 2));
            const expected = new Vector2(-2, 2);

            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector2(2, 4).substract([4, 2]);
            const expected = new Vector2(-2, 2);

            expect(result).toEqual(expected);
        });
    });

    describe('<2,4> * <4,2> = <8,8>', () => {
        test('with a Vector2', () => {
            const result = new Vector2(2, 4).multiply(new Vector2(4, 2));
            const expected = new Vector2(8, 8);

            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector2(2, 4).multiply([4, 2]);
            const expected = new Vector2(8, 8);

            expect(result).toEqual(expected);
        });
    });

    describe('<2,4> / <4,2> = <0.5,2>', () => {
        test('with a Vector2', () => {
            const result = new Vector2(2, 4).divide(new Vector2(4, 2));
            const expected = new Vector2(0.5, 2);

            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector2(2, 4).divide([4, 2]);
            const expected = new Vector2(0.5, 2);

            expect(result).toEqual(expected);
        });
    });

    test('<2,4> * 2 = <4,8>', () => {
        const result = new Vector2(2, 4).scale(2);
        const expected = new Vector2(4, 8);

        expect(result).toEqual(expected);
    });

    describe('<2,4> x <4,2> = <0.5,2>', () => {
        test('with a Vector2', () => {
            const result = new Vector2(2, 4).cross(new Vector2(4, 2));
            const expected = new Vector3(0, 0, -12);

            expect(result).toEqual(expected);
        });
        test('with an array of number', () => {
            const result = new Vector2(2, 4).cross([4, 2]);
            const expected = new Vector3(0, 0, -12);

            expect(result).toEqual(expected);
        });
    });

    describe('<2,4> . <4,2> = 16', () => {
        test('with a Vector2', () => {
            const result = new Vector2(2, 4).dot(new Vector2(4, 2));
            const expected = 16;

            expect(result).toBe(expected);
        });
        test('with an array of number', () => {
            const result = new Vector2(2, 4).dot([4, 2]);
            const expected = 16;

            expect(result).toBe(expected);
        });
    });
});

describe('Normalize', () => {
    test('<2,4> => <>', () => {
        const x = 2;
        const y = 4;
        let dot = x * x + y * y;

        if (dot > 0) {
            dot = 1 / Math.sqrt(dot);
        }
        const result = new Vector2(x, y).normalize();
        const expected = new Vector2(x * dot, y * dot);

        expect(result).toEqual(expected);
    });
    test('<0,0> => <0,0>', () => {
        const result = new Vector2().normalize();
        const expected = new Vector2();

        expect(result).toEqual(expected);
    });
});

describe('Transform <2,4>', () => {
    test('with a Matrix2', () => {
        const x = 2;
        const y = 4;
        const matrix = new Matrix2([2, 1, 3, 4]);
        const result = new Vector2(x, y).transform(matrix);
        const expected = new Vector2(
            matrix[0] * x + matrix[2] * y,
            matrix[1] * x + matrix[3] * y);

        expect(result).toEqual(expected);
    });

    test('with a Matrix3', () => {
        const x = 2;
        const y = 4;
        const matrix = new Matrix3([2, 1, 3, 4, 7, 6, 8, 9]);
        const result = new Vector2(x, y).transform(matrix);
        const expected = new Vector2(
            matrix[0] * x + matrix[3] * y + matrix[6],
            matrix[1] * x + matrix[4] * y + matrix[7]);

        expect(result).toEqual(expected);
    });

    test('with a Matrix4', () => {
        const x = 2;
        const y = 4;
        const matrix = new Matrix4([2, 1, 3, 4, 7, 6, 8, 9, 11, 10, 12, 13, 15, 14, 16]);
        const result = new Vector2(x, y).transform(matrix);
        const expected = new Vector2(
            matrix[0] * x + matrix[4] * y + matrix[12],
            matrix[1] * x + matrix[5] * y + matrix[13]);

        expect(result).toEqual(expected);
    });
});