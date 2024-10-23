import { extractAndTransformMandatoryStatements } from './Vacancy';

describe('extractAndTransformMandatoryStatements', () => {
    const vacancyDetails = {
        basic_info: {
            equal_opportunity_employment_statement: { value: 'EOE Statement' },
            show_eoes: { value: true },
            standards_of_conduct_statement: { value: 'SOC Statement' },
            show_socs: { value: true },
            foreign_education_statement: { value: 'FES Statement' },
            show_fes: { value: true },
            reasonable_accommodation_statement: { value: 'RAS Statement' },
            show_ras: { value: true },
        },
    };

    it('should extract and transform mandatory statements correctly', () => {
        const result = extractAndTransformMandatoryStatements(vacancyDetails);

        expect(result).toEqual([
            {
                label: 'Equal Opportunity Employment',
                text: 'EOE Statement',
                display: true,
            },
            {
                label: 'Standards of Conduct/Financial Disclosure',
                text: 'SOC Statement',
                display: true,
            },
            {
                label: 'Foreign Education',
                text: 'FES Statement',
                display: true,
            },
            {
                label: 'Reasonable Accomodation',
                text: 'RAS Statement',
                display: true,
            },
        ]);
    });

    it('should set display to false if statement is empty, and display to true if populated', () => {
        const incompleteVacancyDetails = {
            basic_info: {
                equal_opportunity_employment_statement: { value: 'EOE Statement' },
                show_eoes: { value: true },
                standards_of_conduct_statement: { value: '' },
                show_socs: { value: false },
                foreign_education_statement: { value: 'FES Statement' },
                show_fes: { value: true },
                reasonable_accommodation_statement: { value: '' },
                show_ras: { value: false },
            },
        };

        const result = extractAndTransformMandatoryStatements(incompleteVacancyDetails);

        expect(result).toEqual([
            {
                label: 'Equal Opportunity Employment',
                text: 'EOE Statement',
                display: true,
            },
            {
                label: 'Standards of Conduct/Financial Disclosure',
                text: '',
                display: false,
            },
            {
                label: 'Foreign Education',
                text: 'FES Statement',
                display: true,
            },
            {
                label: 'Reasonable Accomodation',
                text: '',
                display: false,
            },
        ]);
    });

    it('should handle empty vacancy details correctly by setting display to false', () => {
        const emptyVacancyDetails = {
            basic_info: {
                equal_opportunity_employment_statement: { value: '' },
                show_eoes: { value: false },
                standards_of_conduct_statement: { value: '' },
                show_socs: { value: false },
                foreign_education_statement: { value: '' },
                show_fes: { value: false },
                reasonable_accommodation_statement: { value: '' },
                show_ras: { value: false },
            },
        };

        const result = extractAndTransformMandatoryStatements(emptyVacancyDetails);

        expect(result).toEqual([
            {
                label: 'Equal Opportunity Employment',
                text: '',
                display: false,
            },
            {
                label: 'Standards of Conduct/Financial Disclosure',
                text: '',
                display: false,
            },
            {
                label: 'Foreign Education',
                text: '',
                display: false,
            },
            {
                label: 'Reasonable Accomodation',
                text: '',
                display: false,
            },
        ]);
    });
});