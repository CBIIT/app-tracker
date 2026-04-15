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
})