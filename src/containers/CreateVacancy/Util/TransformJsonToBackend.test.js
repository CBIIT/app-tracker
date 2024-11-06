import { transformJsonToBackend } from './TransformJsonToBackend';
import moment from 'moment';

describe('transformJsonToBackend', () => {
    it('should transform basic info correctly', () => {
        const sourceJson = {
            basicInfo: {
                title: 'Vacancy Title',
                allowHrSpecialistTriage: true,
                requireFocusArea: false,
                description: 'Description',
                vacancyPoc: 'POC',
                appointmentPackageIndicator: 'Indicator',
                positionClassification: 'Classification',
                sacCode: 'SAC123',
                openDate: '2023-10-01',
                useCloseDate: true,
                closeDate: '2023-11-01',
                scoringDueByDate: '2023-12-01',
                numberOfRecommendations: 3,
                referenceCollection: 'Collection',
                referenceCollectionDate: '2023-10-15',
                numberOfCategories: 5,
                applicationDocuments: ['Document1', 'Document2', 'Document3'],
            },
            mandatoryStatements: {
                equalOpportunityEmployerText: 'EOE Text',
                standardsOfConductText: 'SOC Text',
                foreignEducationText: 'FE Text',
                reasonableAccomodationText: 'RA Text',
                equalOpportunityEmployer: true,
                standardsOfConduct: true,
                foreignEducation: true,
                reasonableAccomodation: true,
            },
            sysId: 'SYS123',
            vacancyCommittee: 'Committee',
            emailTemplates: [
                { type: 'Type1', text: 'Text1', active: true, sys_id: 'EMAIL1' },
                { type: 'Type2', text: 'Text2', active: false },
            ],
            draftId: 'DRAFT123',
        };

        const expectedJson = {
            basic_info: {
                vacancy_title: 'Vacancy Title',
                allow_hr_specialist_triage: true,
                require_focus_area: false,
                vacancy_description: 'Description',
                vacancy_poc: 'POC',
                package_initiator: 'Indicator',
                title_42_position_classification: 'Classification',
                organization_code: 'SAC123',
                open_date: '2023-10-01',
                use_close_date: true,
                close_date: '2023-11-01',
                scoring_due_by_date: '2023-12-01',
                number_of_recommendation: 3,
                reference_collection: 'Collection',
                reference_collection_date: '2023-10-15',
                number_of_categories: 5,
                equal_opportunity_employment_statement: 'EOE Text',
                standards_of_conduct_statement: 'SOC Text',
                foreign_education_statement: 'FE Text',
                reasonable_accommodation_statement: 'RA Text',
                show_eoes: true,
                show_socs: true,
                show_fes: true,
                show_ras: true,
                sys_id: 'SYS123',
            },
            vacancy_committee: 'Committee',
            vacancy_emails: [
                { email: 'Type1', email_message: 'Text1', active: true, sys_id: 'EMAIL1' },
                { email: 'Type2', email_message: 'Text2', active: false },
            ],
            vacancy_documents: ['Document1', 'Document2', 'Document3'],
            draft_id: 'DRAFT123',
        };

        const result = transformJsonToBackend(sourceJson);
        expect(result).toEqual(expectedJson);
    });

    it('should handle missing optional fields', () => {
        const sourceJson = {
            basicInfo: {
                title: 'Vacancy Title',
                allowHrSpecialistTriage: true,
                requireFocusArea: false,
                description: 'Description',
                vacancyPoc: 'POC',
                appointmentPackageIndicator: 'Indicator',
                positionClassification: 'Classification',
                sacCode: 'SAC123',
                openDate: '2023-10-01',
                useCloseDate: false,
                numberOfRecommendations: 3,
                referenceCollection: 'Collection',
                numberOfCategories: 5,
                applicationDocuments: ['Document1', 'Document2', 'Document3'],
            },
            mandatoryStatements: {
                equalOpportunityEmployerText: 'EOE Text',
                standardsOfConductText: 'SOC Text',
                foreignEducationText: 'FE Text',
                reasonableAccomodationText: 'RA Text',
                equalOpportunityEmployer: true,
                standardsOfConduct: true,
                foreignEducation: true,
                reasonableAccomodation: true,
            },
            vacancyCommittee: 'Committee',
            emailTemplates: [
                { type: 'Type1', text: 'Text1', active: true },
            ],
        };

        const expectedJson = {
            basic_info: {
                vacancy_title: 'Vacancy Title',
                allow_hr_specialist_triage: true,
                require_focus_area: false,
                vacancy_description: 'Description',
                vacancy_poc: 'POC',
                package_initiator: 'Indicator',
                title_42_position_classification: 'Classification',
                organization_code: 'SAC123',
                open_date: '2023-10-01',
                use_close_date: false,
                close_date: null,
                scoring_due_by_date: null,
                number_of_recommendation: 3,
                reference_collection: 'Collection',
                reference_collection_date: null,
                number_of_categories: 5,
                equal_opportunity_employment_statement: 'EOE Text',
                standards_of_conduct_statement: 'SOC Text',
                foreign_education_statement: 'FE Text',
                reasonable_accommodation_statement: 'RA Text',
                show_eoes: true,
                show_socs: true,
                show_fes: true,
                show_ras: true,
            },
            vacancy_committee: 'Committee',
            vacancy_emails: [
                { email: 'Type1', email_message: 'Text1', active: true },
            ],
            vacancy_documents: ['Document1', 'Document2', 'Document3'],
        };

        const result = transformJsonToBackend(sourceJson);
        expect(result).toEqual(expectedJson);
    });
});