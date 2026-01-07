import { transformJsonFromBackend } from './TransformJsonFromBackend';

describe('transformJsonFromBackend', () => {
    it('should transform the JSON from the backend correctly', () => {
        const sourceJson = {
            basic_info: {
                vacancy: '12345',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '123-456-7890',
                business_phone: '098-765-4321',
                highest_level_of_education: 'PhD',
                us_citizen: true,
                address: '123 Main St',
                address_2: 'Apt 4',
                city: 'Anytown',
                state_province: 'CA',
                zip_code: '12345',
                country: 'USA',
            },
            focus_area: 'Area1,Area2',
            references: [
                {
                    ref_sys_id: 'ref1',
                    first_name: 'Jane',
                    middle_name: 'B',
                    last_name: 'Smith',
                    email: 'jane.smith@example.com',
                    contact_allowed: true,
                    organization: 'Org1',
                    phone: '321-654-0987',
                    reference_received: 'No',
                    reference_requested: '2',
                    relationship: 'Colleague',
                    title: 'Manager',
                },
            ],
            app_documents: [
                {
                    doc_name: 'Resume',
                    file_name: 'resume.pdf',
                    attachment_dl: 'http://example.com/resume.pdf',
                    attach_sys_id: 'doc1',
                },
            ],
        };

        const expectedTransformedJson = {
            sysId: '12345',
            basicInfo: {
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '123-456-7890',
                businessPhone: '098-765-4321',
                highestLevelEducation: 'PhD',
                isUsCitizen: true,
            },
            focusArea: ['Area1', 'Area2'],
            address: {
                address: '123 Main St',
                address2: 'Apt 4',
                city: 'Anytown',
                stateProvince: 'CA',
                postalCode: '12345',
                country: 'USA',
            },
            references: [
                {
                    refSysId: 'ref1',
                    firstName: 'Jane',
                    middleName: 'B',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    contactAllowed: true,
                    organization: 'Org1',
                    phone: '321-654-0987',
                    referenceReceived: 'No',
                    referenceRequested: '2',
                    relationship: 'Colleague',
                    positionTitle: 'Manager',
                },
            ],
            applicantDocuments: [
                {
                    documentName: 'Resume',
                    fileName: 'resume.pdf',
                    downloadLink: 'http://example.com/resume.pdf',
                    attachSysId: 'doc1',
                },
            ],
        };

        const result = transformJsonFromBackend(sourceJson);
        expect(result).toEqual(expectedTransformedJson);
    });

    it('should handle empty focus areas correctly', () => {
        const sourceJson = {
            basic_info: {
                vacancy: '12345',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '123-456-7890',
                business_phone: '098-765-4321',
                highest_level_of_education: 'PhD',
                us_citizen: true,
                address: '123 Main St',
                address_2: 'Apt 4',
                city: 'Anytown',
                state_province: 'CA',
                zip_code: '12345',
                country: 'USA',
            },
            focus_area: '',
            references: [],
            app_documents: [],
        };

        const expectedTransformedJson = {
            sysId: '12345',
            basicInfo: {
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '123-456-7890',
                businessPhone: '098-765-4321',
                highestLevelEducation: 'PhD',
                isUsCitizen: true,
            },
            focusArea: [],
            address: {
                address: '123 Main St',
                address2: 'Apt 4',
                city: 'Anytown',
                stateProvince: 'CA',
                postalCode: '12345',
                country: 'USA',
            },
            references: [],
            applicantDocuments: [],
        };

        const result = transformJsonFromBackend(sourceJson);
        expect(result).toEqual(expectedTransformedJson);
    });
});