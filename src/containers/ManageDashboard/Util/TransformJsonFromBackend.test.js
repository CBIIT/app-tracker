import { transformJsonFromBackend } from './TransformJsonFromBackend';

describe('transformJsonFromBackend', () => {
    it('should transform the JSON correctly', () => {
        const sourceJson = {
            basic_info: {
                sys_id: { value: '123' },
                state: { value: 'active' },
                status: { value: 'open' },
                open_date: { label: '2023-01-01' },
                bulk_email_sent: { value: '1' },
                use_close_date: { value: '1' },
                reference_collection: { value: '1' },
                reference_collection_date: { label: '2023-02-01' },
                close_date: { label: '2023-03-01' },
                scoring_due_by_date: { label: '2023-04-01' },
                vacancy_title: { value: 'Developer' },
                tenant: { label: 'Tenant A' },
                allow_hr_specialist_triage: { value: '1' },
                require_focus_area: { value: '1' },
                vacancy_description: { value: 'Job description' },
                vacancy_poc: { value: 'POC' },
                package_initiator: { value: 'Initiator' },
                title_42_position_classification: { value: 'Classification' },
                organization_code: { value: 'Code' },
                number_of_recommendation: { value: '5' },
                number_of_categories: { value: '3' },
                show_eoes: { value: '1' },
                show_socs: { value: '1' },
                show_fes: { value: '1' },
                show_ras: { value: '1' },
            },
            vacancy_documents: [
                { title: { value: 'Doc1' }, is_optional: { value: '1' } },
                { title: { value: 'Doc2' }, is_optional: { value: '0' } },
            ],
            vacancy_emails: [
                { active: { value: '1' }, email_type: { value: 'Type1' } },
                { active: { value: '0' }, email_type: { value: 'Type2' } },
            ],
            committee: [
                { role: { value: 'Role1' }, user: { label: 'User1' }, sys_id: { value: '1' } },
                { role: { value: 'Role2' }, user: { label: 'User2' }, sys_id: { value: '2' } },
            ],
            rating_plan: {
                sys_id: 'RP123',
                attachment_dl: 'link',
                file_name: 'file.pdf',
            },
        };

        const expectedJson = {
            sysId: '123',
            state: 'active',
            status: 'open',
            basicInfo: {
                bulkEmail: true,
                openDate: '2023-01-01',
                useCloseDate: true,
                referenceCollection: true,
                referenceCollectionDate: '2023-02-01',
                closeDate: '2023-03-01',
                scoringDueByDate: '2023-04-01',
                title: 'Developer',
                tenant: 'Tenant A',
                allowHrSpecialistTriage: true,
                requireFocusArea: true,
                description: 'Job description',
                vacancyPoc: 'POC',
                appointmentPackageIndicator: 'Initiator',
                positionClassification: 'Classification',
                sacCode: 'Code',
                applicationDocuments: [
                    { document: 'Doc1', isDocumentOptional: true },
                    { document: 'Doc2', isDocumentOptional: false },
                ],
                numberOfRecommendations: '5',
                numberOfCategories: '3',
            },
            emailTemplates: [
                { active: true, type: 'Type1' },
                { active: false, type: 'Type2' },
            ],
            vacancyCommittee: [
                { role: 'Role1', user: { name: { value: 'User1' } }, key: '1' },
                { role: 'Role2', user: { name: { value: 'User2' } }, key: '2' },
            ],
            mandatoryStatements: {
                equalOpportunityEmployer: true,
                standardsOfConduct: true,
                foreignEducation: true,
                reasonableAccomodation: true,
            },
            ratingPlan: {
                sysId: 'RP123',
                downloadLink: 'link',
                fileName: 'file.pdf',
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
                open_date: { label: '2023-01-01' },
                use_close_date: { value: '0' },
                reference_collection: { value: '0' },
                reference_collection_date: { label: '2023-02-01' },
                close_date: { label: '2023-03-01' },
                bulk_email_sent: { value: '0' },
                scoring_due_by_date: { label: '2023-04-01' },
                vacancy_title: { value: 'Developer' },
                tenant: { label: 'Tenant A' },
                allow_hr_specialist_triage: { value: '0' },
                require_focus_area: { value: '0' },
                vacancy_description: { value: 'Job description' },
                vacancy_poc: { value: 'POC' },
                package_initiator: { value: 'Initiator' },
                title_42_position_classification: { value: 'Classification' },
                organization_code: { value: 'Code' },
                number_of_recommendation: { value: '5' },
                number_of_categories: { value: '3' },
                show_eoes: { value: '0' },
                show_socs: { value: '0' },
                show_fes: { value: '0' },
                show_ras: { value: '0' },
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
                bulkEmail: false,
                openDate: '2023-01-01',
                useCloseDate: false,
                referenceCollection: false,
                referenceCollectionDate: '2023-02-01',
                closeDate: '2023-03-01',
                scoringDueByDate: '2023-04-01',
                title: 'Developer',
                tenant: 'Tenant A',
                allowHrSpecialistTriage: false,
                requireFocusArea: false,
                description: 'Job description',
                vacancyPoc: 'POC',
                appointmentPackageIndicator: 'Initiator',
                positionClassification: 'Classification',
                sacCode: 'Code',
                applicationDocuments: [],
                numberOfRecommendations: '5',
                numberOfCategories: '3',
            },
            emailTemplates: [],
            vacancyCommittee: [],
            mandatoryStatements: {
                equalOpportunityEmployer: false,
                standardsOfConduct: false,
                foreignEducation: false,
                reasonableAccomodation: false,
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