import { displayReferenceContactQuestion } from './Application';

describe('displayReferenceContactQuestion', () => {
    test('should return true for tenantType other than "Stadtman"', () => {
        expect(displayReferenceContactQuestion('OtherType')).toBe(true);
        expect(displayReferenceContactQuestion('AnotherType')).toBe(true);
    });

    test('should return false for tenantType "Stadtman"', () => {
        expect(displayReferenceContactQuestion('Stadtman')).toBe(false);
    });

    test('should return true for tenantType with different casing', () => {
        expect(displayReferenceContactQuestion('stadtman')).toBe(true);
        expect(displayReferenceContactQuestion('STADTMAN')).toBe(true);
    });

    test('should return true for empty tenantType', () => {
        expect(displayReferenceContactQuestion('')).toBe(true);
    });

    test('should return true for undefined tenantType', () => {
        expect(displayReferenceContactQuestion(undefined)).toBe(true);
    });

    test('should return true for null tenantType', () => {
        expect(displayReferenceContactQuestion(null)).toBe(true);
    });
});