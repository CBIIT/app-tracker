import { normalizeStatus, compareStatus, formatStatusDisplay } from "./statusHelper";

describe('statusHelpers utilities', () => {

    describe('normalizeStatus', () => {
        test('should return empty string for null', () => {
            expect(normalizeStatus(null)).toBe('');
        });

        test('should return empty string for undefined', () => {
            expect(normalizeStatus(undefined)).toBe('');
        });

        test('should return empty string for empty string', () => {
            expect(normalizeStatus('')).toBe('');
        });

        test('should return the string unchanged for valid status', () => {
            expect(normalizeStatus('open')).toBe('open');
            expect(normalizeStatus('under_review')).toBe('under_review');
            expect(normalizeStatus('owm_pending')).toBe('owm_pending');
        });

        test('should handle non-string primitives', () => {
            expect(normalizeStatus(123)).toBe('');
            expect(normalizeStatus(true)).toBe('');
            expect(normalizeStatus({})).toBe('')
        });
    });

    describe('compareStatus', () => {
        test('should not throw when comparing null and null', () => {
            expect(() => compareStatus(null, null)).not.toThrow();
        });

        test('should not throw when comparing undefined and undefined', () =>{
            expect(() => compareStatus(undefined, undefined)).not.toThrow();
        });

        test('should not throw when comparing null and valid status', () => {
            expect(() => compareStatus(null, 'open')).not.toThrow();
        });

        test('should return consistent ordering for valid statuses', () => {
            const result1 = compareStatus('alpha', 'beta');
            const result2 = compareStatus('beta', 'alpha');
            expect(result1).toBeLessThan(0);
            expect(result2).toBeGreaterThan(0);
        });

        test('should sort empty statuses (from null/undefined) consistently', () => {
            const result = compareStatus(null, 'open');
            expect(typeof result).toBe('number');
        })
    })
})