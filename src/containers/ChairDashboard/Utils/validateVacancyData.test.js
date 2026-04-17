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

    test('should fall back to an empty array if vacancy data list is not an array', () => {
        const nullVacancyList = {
            list: null,
        };

        const result = validateVacancyData(nullVacancyList);
        expect(result).toEqual({ list: [] });
    });

    test('should handle undefined input safely', () => {
        const result = validateVacancyData(undefined);
        expect(result).toEqual({ list: [] });
    })
});
