import { transformJsonToBackend } from './TransformJsonToBackend';

describe('transformJsonToBackend', () => {
    it('should transform sourceJson to targetJson correctly', () => {
        const sourceJson = {
            sysId: '123',
            basicInfo: {
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phonePrefix: '+1',
                phone: '1234567890',
                businessPhonePrefix: '+1',
                businessPhone: '0987654321',
                highestLevelEducation: 'PhD',
                isUsCitizen: true,
            },
            address: {
                address: '123 Main St',
                address2: 'Apt 4',
                city: 'Anytown',
                zip: '12345',
                stateProvince: 'CA',
                country: 'USA',
            },
            focusArea: ['Area1', 'Area2'],
            applicantDocuments: ['doc1', 'doc2'],
            references: [
                {
                    ref_sys_id: 'ref1',
                    firstName: 'Jane',
                    middleName: 'B',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    phoneNumber: '0987654321',
                    contact: true,
                    organization: 'Org1',
                    title: 'Manager',
                    relationship: 'Colleague',
                },
            ],
        };

        const expectedTargetJson = {
            basic_info: {
                sys_id: '123',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '+11234567890',
                business_phone: '+10987654321',
                highest_level_of_education: 'PhD',
                us_citizen: true,
                address: '123 Main St',
                address_2: 'Apt 4',
                city: 'Anytown',
                zip_code: '12345',
                state_province: 'CA',
                country: 'USA',
            },
            focus_area: 'Area1,Area2',
            vacancy_documents: ['doc1', 'doc2'],
            references: [
                {
                    ref_sys_id: 'ref1',
                    first_name: 'Jane',
                    middle_name: 'B',
                    last_name: 'Smith',
                    email: 'jane.smith@example.com',
                    phone: '0987654321',
                    contact_allowed: true,
                    organization: 'Org1',
                    title: 'Manager',
                    relationship: 'Colleague',
                },
            ],
        };

        const result = transformJsonToBackend(sourceJson);
        expect(result).toEqual(expectedTargetJson);
    });

    it('should handle empty focusArea correctly', () => {
        const sourceJson = {
            sysId: '123',
            basicInfo: {
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phonePrefix: '+1',
                phone: '1234567890',
                businessPhonePrefix: '+1',
                businessPhone: '0987654321',
                highestLevelEducation: 'PhD',
                isUsCitizen: true,
            },
            address: {
                address: '123 Main St',
                address2: 'Apt 4',
                city: 'Anytown',
                zip: '12345',
                stateProvince: 'CA',
                country: 'USA',
            },
            focusArea: [],
            applicantDocuments: ['doc1', 'doc2'],
            references: [
                {
                    ref_sys_id: 'ref1',
                    firstName: 'Jane',
                    middleName: 'B',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    phoneNumber: '0987654321',
                    contact: true,
                    organization: 'Org1',
                    title: 'Manager',
                    relationship: 'Colleague',
                },
            ],
        };

        const expectedTargetJson = {
            basic_info: {
                sys_id: '123',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '+11234567890',
                business_phone: '+10987654321',
                highest_level_of_education: 'PhD',
                us_citizen: true,
                address: '123 Main St',
                address_2: 'Apt 4',
                city: 'Anytown',
                zip_code: '12345',
                state_province: 'CA',
                country: 'USA',
            },
            focus_area: '',
            vacancy_documents: ['doc1', 'doc2'],
            references: [
                {
                    ref_sys_id: 'ref1',
                    first_name: 'Jane',
                    middle_name: 'B',
                    last_name: 'Smith',
                    email: 'jane.smith@example.com',
                    phone: '0987654321',
                    contact_allowed: true,
                    organization: 'Org1',
                    title: 'Manager',
                    relationship: 'Colleague',
                },
            ],
        };

        const result = transformJsonToBackend(sourceJson);
        expect(result).toEqual(expectedTargetJson);
    });
});