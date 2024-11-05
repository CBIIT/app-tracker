import { transformJsonFromBackend } from './TransformJsonFromBackend';

describe('transformJsonFromBackend', () => {
    it('should transform the JSON correctly', () => {
        const sourceJson = {
            basic_info: {
                vacancy: '12345',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                business_phone: '+1987654321',
                highest_level_of_education: 'PhD',
                us_citizen: true,
                address: '123 Main St',
                address_2: 'Apt 4',
                city: 'Anytown',
                state_province: 'CA',
                zip_code: '12345',
                country: 'USA',
            },
            focus_area: 'area1,area2',
            references: [
                {
                    ref_sys_id: 'ref1',
                    first_name: 'Jane',
                    middle_name: 'B',
                    last_name: 'Smith',
                    email: 'jane.smith@example.com',
                    contact_allowed: true,
                    organization: 'Org1',
                    phone: '+1234567890',
                    relationship: 'Colleague',
                    title: 'Manager',
                },
            ],
            app_documents: [
                {
                    doc_name: 'Resume',
                    table_name: 'applicant',
                    table_sys_id: 'doc1',
                    attach_sys_id: 'attach1',
                    file_name: 'resume.pdf',
                    attachment_dl: 'http://example.com/resume.pdf',
                },
            ],
        };

        const expectedOutput = {
            sysId: '12345',
            basicInfo: {
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phonePrefix: '+1',
                phone: '234567890',
                businessPhonePrefix: '+1',
                businessPhone: '987654321',
                highestLevelEducation: 'PhD',
                isUsCitizen: true,
            },
            focusArea: ['area1', 'area2'],
            address: {
                address: '123 Main St',
                address2: 'Apt 4',
                city: 'Anytown',
                stateProvince: 'CA',
                zip: '12345',
                country: 'USA',
            },
            references: [
                {
                    ref_sys_id: 'ref1',
                    firstName: 'Jane',
                    middleName: 'B',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    contact: true,
                    organization: 'Org1',
                    phoneNumber: '+1234567890',
                    relationship: 'Colleague',
                    title: 'Manager',
                },
            ],
            applicantDocuments: [
                {
                    documentName: 'Resume',
                    table_name: 'applicant',
                    table_sys_id: 'doc1',
                    uploadedDocument: {
                        fileName: 'resume.pdf',
                        downloadLink: 'http://example.com/resume.pdf',
                        attachSysId: 'attach1',
                        markedToDelete: false,
                    },
                },
            ],
        };

        const result = transformJsonFromBackend(sourceJson);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle empty focus area', () => {
        const sourceJson = {
            basic_info: {
                vacancy: '12345',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                business_phone: '+1987654321',
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

        const expectedOutput = {
            sysId: '12345',
            basicInfo: {
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phonePrefix: '+1',
                phone: '234567890',
                businessPhonePrefix: '+1',
                businessPhone: '987654321',
                highestLevelEducation: 'PhD',
                isUsCitizen: true,
            },
            focusArea: [],
            address: {
                address: '123 Main St',
                address2: 'Apt 4',
                city: 'Anytown',
                stateProvince: 'CA',
                zip: '12345',
                country: 'USA',
            },
            references: [],
            applicantDocuments: [],
        };

        const result = transformJsonFromBackend(sourceJson);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle undefined focus area', () => {
        const sourceJson = {
            basic_info: {
                vacancy: '12345',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                business_phone: '+1987654321',
                highest_level_of_education: 'PhD',
                us_citizen: true,
                address: '123 Main St',
                address_2: 'Apt 4',
                city: 'Anytown',
                state_province: 'CA',
                zip_code: '12345',
                country: 'USA',
            },
            focus_area: 'undefined',
            references: [],
            app_documents: [],
        };

        const expectedOutput = {
            sysId: '12345',
            basicInfo: {
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phonePrefix: '+1',
                phone: '234567890',
                businessPhonePrefix: '+1',
                businessPhone: '987654321',
                highestLevelEducation: 'PhD',
                isUsCitizen: true,
            },
            focusArea: [],
            address: {
                address: '123 Main St',
                address2: 'Apt 4',
                city: 'Anytown',
                stateProvince: 'CA',
                zip: '12345',
                country: 'USA',
            },
            references: [],
            applicantDocuments: [],
        };

        const result = transformJsonFromBackend(sourceJson);
        expect(result).toEqual(expectedOutput);
    });
});