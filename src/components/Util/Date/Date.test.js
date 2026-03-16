import { transformDateToDisplay, transformDateTimeToDisplay } from './Date';

describe('transformDateToDisplay', () => {
    // Happy path: Valid date string
    test('should return formatted date string for valid date', () => {
      const date = '2024-10-01';
      const expected = '10/01/2024';
      expect(transformDateToDisplay(date)).toBe(expected);
    });
  
    // Error case: Invalid date string
    test('should return an empty string for an invalid date', () => {
      const invalidDate = 'invalid-date';
      expect(transformDateToDisplay(invalidDate)).toBe('');
    });
  
    // Edge case: Null or undefined date
    test('should return an empty string when date is null or undefined', () => {
      expect(transformDateToDisplay(null)).toBe('');
      expect(transformDateToDisplay(undefined)).toBe('');
    });
  
    // Edge case: Empty string date
    test('should return an empty string for an empty date string', () => {
      expect(transformDateToDisplay('')).toBe('');
    });
  });
  
  describe('transformDateTimeToDisplay', () => {
    // Happy path: Valid dateTime string
    test('should return formatted date-time string for valid dateTime', () => {
      const dateTime = '2024-10-01T10:30:00';
      const expected = '10/01/2024 10:30 am';
      expect(transformDateTimeToDisplay(dateTime)).toBe(expected);
    });
  
    // Error case: Invalid dateTime string
    test('should return an empty string for an invalid dateTime', () => {
      const invalidDateTime = 'invalid-dateTime';
      expect(transformDateTimeToDisplay(invalidDateTime)).toBe('');
    });
  
    // Edge case: Null or undefined dateTime
    test('should return an empty string when dateTime is null or undefined', () => {
      expect(transformDateTimeToDisplay(null)).toBe('');
      expect(transformDateTimeToDisplay(undefined)).toBe('');
    });
  
    // Edge case: Empty string dateTime
    test('should return an empty string for an empty dateTime string', () => {
      expect(transformDateTimeToDisplay('')).toBe('');
    });
  });
  