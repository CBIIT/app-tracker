import { validateVacancyData } from './validateVacancyData';

const mockVacancyData = {
	status: 200,
	list: [
		{
			'vacancy_title': 'Test Vacancy 1',
			'vacancy_id': 'sys123',
			'status': 'rolling_close',
			'applicants': 2,
		},
		{
			'vacancy_title': 'Test Vacancy 2',
			'vacancy_id': 'sys456',
			'status': 'triage',
			'applicants': 5,
		},
	],
};

describe('validateVacancyData', () => {
	test('should return normalized vacancy data when list is valid', () => {
        const result = validateVacancyData(mockVacancyData);
		expect(result).toEqual({ list: mockVacancyData.list });
    });

    test('should throw error if vacancy data list is not an array', () => {
        const nullVacancyList = {
            list: null,
        };

        expect(() => validateVacancyData(nullVacancyList)).toThrow('Invalid vacancy data: list must be an array');
    });

    test('should throw error if input is undefined', () => {
        expect(() => validateVacancyData(undefined)).toThrow('Invalid vacancy data: payload must be an object');
    });

    test('should throw error if input is null', () => {
        expect(() => validateVacancyData(null)).toThrow('Invalid vacancy data: payload must be an object');
    });

    test('should throw error if list property is missing', () => {
        const missingList = { status: 200 };
        expect(() => validateVacancyData(missingList)).toThrow('Invalid vacancy data: list must be an array');
    });
});
