import { Color } from '../../../src/libs/core/Color';
import { Vector3 } from '../../../src/libs/math/Vector3';

describe('When using Color get / set', () => {
    test('get rgba should return a Vector4 equal to the Color', () => {
        const color = new Color();
        const vector4 = color.rgba;

        expect(vector4).not.toBe(color);
        expect(vector4).toEqual(color);
    });

    test('set rgba should update all the value of the Color', () => {
        const color = new Color();
        const expected = new Color(1, 1, 1, 1);
        color.rgba = expected;

        expect(color).not.toBe(expected);
        expect(color).toEqual(expected);
    });

    test('get rgb should return a Vector3 equal to the Color', () => {
        const expected = new Vector3(1, 1, 1);
        const color = new Color(expected.toVector4(0));
        const vector3 = color.rgb;

        expect(vector3).not.toBe(expected);
        expect(vector3).toEqual(expected);
    });

    test('set rgb should update only the rgb value of the Color', () => {
        const color = new Color(0,0,0,0);
        const expected = new Color(1, 1, 1, 1);
        color.rgb = expected.toVector3();

        expect(color).not.toBe(expected);
        expect(color).not.toEqual(expected);
        expect(color.toVector3()).toEqual(expected.toVector3());
    });

    test('get r should return the red value of the Color', () => {
        const expected = 1;
        const color = new Color(1,2,3,4);

        expect(color.r).toBe(expected);
    });

    test('set r should update only the red value of the Color', () => {
        const expected = 5;
        const color = new Color(1,2,3,4);
        color.r = expected;

        expect(color[0]).toBe(expected);
    });

    test('get g should return the green value of the Color', () => {
        const expected = 2;
        const color = new Color(1,2,3,4);

        expect(color.g).toBe(expected);
    });

    test('set g should update only the green value of the Color', () => {
        const expected = 5;
        const color = new Color(1,2,3,4);
        color.g = expected;

        expect(color[1]).toBe(expected);
    });

    test('get b should return the blue value of the Color', () => {
        const expected = 3;
        const color = new Color(1,2,3,4);

        expect(color.b).toBe(expected);
    });

    test('set b should update only the blue value of the Color', () => {
        const expected = 5;
        const color = new Color(1,2,3,4);
        color.b = expected;

        expect(color[2]).toBe(expected);
    });

    test('get a should return the alpha value of the Color', () => {
        const expected = 4;
        const color = new Color(1,2,3,4);

        expect(color.a).toBe(expected);
    });

    test('set a should update only the alpha value of the Color', () => {
        const expected = 5;
        const color = new Color(1,2,3,4);
        color.a = expected;

        expect(color[3]).toBe(expected);
    });
});