import MathArray from'../../../src/libs/math/MathArray';
    describe('equals a MathArray', () => {
        test('should return true if values are the same', () => {
            expect(new MathArray([2, 4]).equals(new MathArray([2, 4]))).toBeTruthy();
        });

        test('should return false if values are different', () => {
            expect(new MathArray([2, 4]).equals(new MathArray([4,2]))).toBeFalsy();
        });
    });
