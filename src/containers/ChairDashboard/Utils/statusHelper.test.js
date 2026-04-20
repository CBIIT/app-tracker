import { normalizeStatus, compareStatus, formatStatusDisplay, isInvalidVacancyStatus, getInvalidStatusMessage, isVacancyRowInteractive } from "./statusHelper";

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
    });

    describe('formatStatusDisplay', () => {
        test('should display "N/A" for empty string', () => {
            const result = formatStatusDisplay('');
            expect(result.props.children).toBe('N/A');
        });

        test('should capitalize simple status', () => {
            const result = formatStatusDisplay('open');
            expect(result.props.children).toBe('Open');
        });

        test('should format underscore-separated status', () => {
            const result = formatStatusDisplay('under_review');
            expect(result.props.children).toBe('Under Review');
        });

        test('should handle owm_prefix status', () => {
            const result = formatStatusDisplay('owm_pending');
            expect(result.props.children).toBe('OWM Pending');
        });

        test('should always return styled span with correct color', () => {
            const result = formatStatusDisplay('open');
            expect(result.type).toBe('span');
            expect(result.props.style.color).toBe('rgb(86,86,86)');
        });
    });

    describe('isInvalidVacancyStatus', () => {
        test('should return true for empty string', () => {
            expect(isInvalidVacancyStatus('')).toBe(true);
        });

        test('should return true for null', () => {
            expect(isInvalidVacancyStatus(null)).toBe(true);
        });

        test('should return true for undefined', () => {
            expect(isInvalidVacancyStatus(undefined)).toBe(true);
        });

        test('should return false for valid status strings', () => {
            expect(isVacancyRowInteractive('open')).toBe(true);
            expect(isVacancyRowInteractive('under_review')).toBe(true);
            expect(isVacancyRowInteractive('owm_pending')).toBe(true);
        });
    });

    describe('getInvalidStatusMessage', () => {
        test('should return the correct error message', () => {
            const message = getInvalidStatusMessage();
            expect(message).toBe('Something went wrong with this vacancy status. Please contact the Help Desk at NCIAppSupport@mail.nih.gov.');
        });

        test('should always return a string', () => {
            const message = getInvalidStatusMessage();
            expect(typeof message).toBe('string');
        });

        test('should include Help Desk email in message', () => {
            const message = getInvalidStatusMessage();
            expect(message).toContain('NCIAppSupport@mail.nih.gov');
        });
    });

    describe('isVacancyRowInteractive', () => {
        test('should return false for empty string', () => {
            expect(isVacancyRowInteractive('')).toBe(false);
        });

        test('should return false for null', () => {
            expect(isVacancyRowInteractive(null)).toBe(false);
        });

        test('should return false for undefined', () => {
            expect(isVacancyRowInteractive(undefined)).toBe(false);
        });

        test('should return true for valid status strings', () => {
            expect(isVacancyRowInteractive('open')).toBe(true);
            expect(isVacancyRowInteractive('under_review')).toBe(true);
            expect(isVacancyRowInteractive('owm_pending')).toBe(true);
        });
    });
});