import Angle from'../../../src/libs/math/Angle';

describe('Angle conversion', () =>{
    test('180 degrees equals π radians', ()=>{
        expect(Angle.toRadian(180)).toBe(Math.PI);
    });
    
    test('540 degrees equals 3π radians', ()=>{
        expect(Angle.toRadian(540)).toBe(3 * Math.PI);
    });
    
    test('π radians equals 180 degrees ', ()=>{
        expect(Angle.toDegree(Math.PI)).toBe(180);
    });
    
    test('3π radians equals 540 degrees ', ()=>{
        expect(Angle.toDegree(3 * Math.PI)).toBe(540);
    });
});