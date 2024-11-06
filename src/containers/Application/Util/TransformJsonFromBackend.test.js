import { transformJsonFromBackend } from './TransformJsonFromBackend';

describe('transformJsonFromBackend', () => {
    it('should transform backend JSON correctly', () => {
        const backendJson = {
            basic_info: {
                vacancy: { value: '123' },
                sys_id: { value: 'abc' },
                state: { value: 'active' },
                first_name: { value: 'John' },
                middle_name: { value: 'A' },
                last_name: { value: 'Doe' },
                email: { value: 'john.doe@example.com' },
                phone: { value: '123-456-7890' },
                business_phone: { value: '098-765-4321' },
                highest_level_of_education: { value: 'PhD' },
                us_citizen: { value: true },
                address: { value: '123 Main St' },
                address_2: { value: 'Apt 4' },
                city: { value: 'Anytown' },
                state_province: { value: 'CA' },
                zip_code: { value: '12345' },
            },
            focus_area: {
                focus_area: 'area1,area2'
            },
            app_documents: [
                {
                    doc_name: 'Resume',
                    file_name: 'resume.pdf',
                    attachment_dl: 'link_to_resume'
                }
            ],
            references: [
                {
                    name: 'Jane Smith',
                    ref_sys_id: 'ref123',
                    documents: [
                        {
                            attachment_dl: 'link_to_reference_doc',
                            file_name: 'reference.pdf',
                            attach_sys_id: 'attach123'
                        }
                    ],
                    contact_allowed: true,
                    email: 'jane.smith@example.com',
                    organization: 'Org Inc.',
                    phone: '321-654-0987',
                    relationship: 'Colleague',
                    title: 'Manager'
                }
            ]
        };

        const expectedOutput = {
            vacancyId: '123',
            appSysId: 'abc',
            state: 'active',
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
            focusArea: ['area1', 'area2'],
            address: {
                address: '123 Main St',
                address2: 'Apt 4',
                city: 'Anytown',
                stateProvince: 'CA',
                postalCode: '12345',
            },
            documents: [
                {
                    title: 'Resume',
                    filename: 'resume.pdf',
                    downloadLink: 'link_to_resume'
                }
            ],
            references: [
                {
                    name: 'Jane Smith',
                    referenceSysId: 'ref123',
                    documents: [
                        {
                            downloadLink: 'link_to_reference_doc',
                            filename: 'reference.pdf',
                            attachmentSysId: 'attach123'
                        }
                    ],
                    contact_allowed: true,
                    email: 'jane.smith@example.com',
                    organization: 'Org Inc.',
                    phone: '321-654-0987',
                    relationship: 'Colleague',
                    title: 'Manager'
                }
            ]
        };

        const result = transformJsonFromBackend(backendJson);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle empty focus area', () => {
        const backendJson = {
            basic_info: {
                vacancy: { value: '123' },
                sys_id: { value: 'abc' },
                state: { value: 'active' },
                first_name: { value: 'John' },
                middle_name: { value: 'A' },
                last_name: { value: 'Doe' },
                email: { value: 'john.doe@example.com' },
                phone: { value: '123-456-7890' },
                business_phone: { value: '098-765-4321' },
                highest_level_of_education: { value: 'PhD' },
                us_citizen: { value: true },
                address: { value: '123 Main St' },
                address_2: { value: 'Apt 4' },
                city: { value: 'Anytown' },
                state_province: { value: 'CA' },
                zip_code: { value: '12345' },
            },
            focus_area: {
                focus_area: ''
            },
            app_documents: [],
            references: []
        };

        const expectedOutput = {
            vacancyId: '123',
            appSysId: 'abc',
            state: 'active',
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
            },
            documents: [],
            references: []
        };

        const result = transformJsonFromBackend(backendJson);
        expect(result).toEqual(expectedOutput);
    });

    it('should handle undefined focus area', () => {
        const backendJson = {
            basic_info: {
                vacancy: { value: '123' },
                sys_id: { value: 'abc' },
                state: { value: 'active' },
                first_name: { value: 'John' },
                middle_name: { value: 'A' },
                last_name: { value: 'Doe' },
                email: { value: 'john.doe@example.com' },
                phone: { value: '123-456-7890' },
                business_phone: { value: '098-765-4321' },
                highest_level_of_education: { value: 'PhD' },
                us_citizen: { value: true },
                address: { value: '123 Main St' },
                address_2: { value: 'Apt 4' },
                city: { value: 'Anytown' },
                state_province: { value: 'CA' },
                zip_code: { value: '12345' },
            },
            focus_area: {
                focus_area: 'undefined'
            },
            app_documents: [],
            references: []
        };

        const expectedOutput = {
            vacancyId: '123',
            appSysId: 'abc',
            state: 'active',
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
            },
            documents: [],
            references: []
        };

        const result = transformJsonFromBackend(backendJson);
        expect(result).toEqual(expectedOutput);
    });
});