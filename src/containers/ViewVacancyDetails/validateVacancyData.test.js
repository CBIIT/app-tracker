import { validateVacancyData } from './validateVacancyData';

describe('validateVacancyData', () => {
	test('should return data unchanged when basic_info and vacancy_documents are valid', () => {
		const input = {
			basic_info: { vacancy_title: { value: 'Test Vacancy' } },
			vacancy_documents: [{ title: { value: 'CV' } }],
		};

		const result = validateVacancyData(input);

		expect(result).toEqual(input);
	});

	test('should fallback to empty object when basic_info is missing', () => {
		const input = {
			vacancy_documents: [{ title: { value: 'CV' } }],
		};

		const result = validateVacancyData(input);

		expect(result.basic_info).toEqual({});
		expect(result.vacancy_documents).toEqual(input.vacancy_documents);
	});

	test('should fallback to empty array when vacancy_documents is not an array', () => {
		const input = {
			basic_info: { vacancy_title: { value: 'Test Vacancy' } },
			vacancy_documents: null,
		};

		const result = validateVacancyData(input);

		expect(result.basic_info).toEqual(input.basic_info);
		expect(result.vacancy_documents).toEqual([]);
	});

	test('should handle undefined input safely', () => {
		const result = validateVacancyData(undefined);

		expect(result).toEqual({
			basic_info: {},
			vacancy_documents: [],
		});
	});
});
