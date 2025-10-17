import { transformJsonFromBackend } from './TransformJsonFromBackend';
import moment from 'moment';

describe('transformJsonFromBackend', () => {
    it('should transform basic info correctly', () => {
        const sourceJson = {
            basic_info: {
                sys_id: { value: '123' },
                state: { value: 'active' },
                status: { value: 'open' },
                open_date: { value: '2023-01-01' },
                use_close_date: { value: '1' },
                reference_collection: { value: '1' },
                reference_collection_date: { value: '2023-02-01' },
                close_date: { value: '2023-03-01' },
                scoring_due_by_date: { value: '2023-04-01' },
                vacancy_title: { value: 'Developer' },
                allow_hr_specialist_triage: { value: '1' },
                require_focus_area: { value: '1' },
                vacancy_description: { value: 'Job description' },
                vacancy_poc: { value: 'John Doe' },
                location: { value: 'Bethesda, MD' },
                package_initiator: { value: 'HR' },
                title_42_position_classification: { value: 'A' },
                organization_code: { value: '12345' },
                number_of_recommendation: { value: '3' },
                number_of_categories: { value: '2' },
                show_eoes: { value: '1' },
                show_socs: { value: '1' },
                show_fes: { value: '1' },
                show_ras: { value: '1' },
                equal_opportunity_employment_statement: { value: 'EOE statement' },
                standards_of_conduct_statement: { value: 'SOC statement' },
                foreign_education_statement: { value: 'FE statement' },
                reasonable_accommodation_statement: { value: 'RA statement' },
            },
            vacancy_documents: [
                {
                    sys_id: { value: 'doc1' },
                    title: { value: 'Document 1' },
                    is_optional: { value: '1' },
                },
            ],
            vacancy_emails: [
                {
                    sys_id: { value: 'email1' },
                    active: { value: '1' },
                    email_type: { value: 'type1' },
                    email_message: { value: 'message1' },
                },
            ],
            committee: [
                {
                    role: { value: 'Chair' },
                    user: { value: 'user1', label: 'User One' },
                    email: 'user1@example.com',
                    orginization: 'Org1',
                },
            ],
            rating_plan: {
                sys_id: 'rp1',
                attachment_dl: 'link1',
                file_name: 'file1',
            },
        };

        const expectedJson = {
            sysId: '123',
            state: 'active',
            status: 'open',
            basicInfo: {
                sys_id: '123',
                openDate: moment('2023-01-01'),
                useCloseDate: true,
                referenceCollection: true,
                referenceCollectionDate: moment('2023-02-01'),
                closeDate: moment('2023-03-01'),
                scoringDueByDate: moment('2023-04-01'),
                title: 'Developer',
                allowHrSpecialistTriage: true,
                requireFocusArea: true,
                description: 'Job description',
                vacancyPoc: 'John Doe',
                location: 'Bethesda, MD',
                appointmentPackageIndicator: 'HR',
                positionClassification: 'A',
                sacCode: '12345',
                applicationDocuments: [
                    {
                        sys_id: 'doc1',
                        document: 'Document 1',
                        isDocumentOptional: true,
                    },
                ],
                numberOfRecommendations: '3',
                numberOfCategories: '2',
            },
            emailTemplates: [
                {
                    sys_id: 'email1',
                    active: true,
                    type: 'type1',
                    text: 'message1',
                },
            ],
            vacancyCommittee: [
                {
                    role: 'Chair',
                    user: {
                        sys_id: { value: 'user1', display_value: 'user1' },
                        name: { value: 'User One', display_value: 'User One' },
                        email: 'user1@example.com',
                        orginization: 'Org1',
                    },
                    key: 0,
                },
            ],
            mandatoryStatements: {
                equalOpportunityEmployer: true,
                standardsOfConduct: true,
                foreignEducation: true,
                reasonableAccomodation: true,
                equalOpportunityEmployerText: 'EOE statement',
                standardsOfConductText: 'SOC statement',
                foreignEducationText: 'FE statement',
                reasonableAccomodationText: 'RA statement',
            },
            ratingPlan: {
                sysId: 'rp1',
                downloadLink: 'link1',
                fileName: 'file1',
            },
        };

        const result = transformJsonFromBackend(sourceJson);
        expect(result).toEqual(expectedJson);
    });

    it('should handle missing optional fields', () => {
        const sourceJson = {
            basic_info: {
                sys_id: { value: '123' },
                state: { value: 'active' },
                status: { value: 'open' },
                open_date: { value: null },
                use_close_date: { value: '0' },
                reference_collection: { value: '0' },
                reference_collection_date: { value: null },
                close_date: { value: null },
                scoring_due_by_date: { value: null },
                vacancy_title: { value: 'Developer' },
                allow_hr_specialist_triage: { value: '0' },
                require_focus_area: { value: '0' },
                vacancy_description: { value: 'Job description' },
                vacancy_poc: { value: 'undefined' },
                location: { value: '' },
                package_initiator: { value: 'HR' },
                title_42_position_classification: { value: 'A' },
                organization_code: { value: '12345' },
                number_of_recommendation: { value: '3' },
                number_of_categories: { value: '2' },
                show_eoes: { value: '0' },
                show_socs: { value: '0' },
                show_fes: { value: '0' },
                show_ras: { value: '0' },
                equal_opportunity_employment_statement: { value: 'EOE statement' },
                standards_of_conduct_statement: { value: 'SOC statement' },
                foreign_education_statement: { value: 'FE statement' },
                reasonable_accommodation_statement: { value: 'RA statement' },
            },
            vacancy_documents: [],
            vacancy_emails: [],
            committee: [],
            rating_plan: null,
        };

        const expectedJson = {
            sysId: '123',
            state: 'active',
            status: 'open',
            basicInfo: {
                sys_id: '123',
                openDate: null,
                useCloseDate: false,
                referenceCollection: false,
                referenceCollectionDate: null,
                closeDate: null,
                scoringDueByDate: null,
                title: 'Developer',
                allowHrSpecialistTriage: false,
                requireFocusArea: false,
                description: 'Job description',
                vacancyPoc: undefined,
                location: '',
                appointmentPackageIndicator: 'HR',
                positionClassification: 'A',
                sacCode: '12345',
                applicationDocuments: [],
                numberOfRecommendations: '3',
                numberOfCategories: '2',
            },
            emailTemplates: [],
            vacancyCommittee: [],
            mandatoryStatements: {
                equalOpportunityEmployer: false,
                standardsOfConduct: false,
                foreignEducation: false,
                reasonableAccomodation: false,
                equalOpportunityEmployerText: 'EOE statement',
                standardsOfConductText: 'SOC statement',
                foreignEducationText: 'FE statement',
                reasonableAccomodationText: 'RA statement',
            },
            ratingPlan: {
                sysId: null,
                downloadLink: null,
                fileName: null,
            },
        };

        const result = transformJsonFromBackend(sourceJson);
        expect(result).toEqual(expectedJson);
    });

});