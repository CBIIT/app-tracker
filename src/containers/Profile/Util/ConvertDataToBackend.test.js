import { convertDataToBackend } from './ConvertDataToBackend';

describe('convertDataToBackend', () => {
    it('should convert data correctly', () => {
        const input = {
            userSysId: '123',
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
                focusArea: ['AI', 'ML'],
                address: {
                    address: '123 Main St',
                    address2: 'Apt 4',
                    city: 'Somewhere',
                    zip: '12345',
                    stateProvince: 'CA',
                    country: 'USA',
                },
            },
            demographics: {
                share: true,
                sex: 'Male',
                ethnicity: 'Hispanic',
                race: ['White'],
                disability: ['None'],
            },
        };

        const expectedOutput = {
            basic_info: {
                sys_id: '123',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '+11234567890',
                business_phone: '+10987654321',
                highest_level_of_education: 'PhD',
                us_citizen: 'true',
                focus_area: 'AI,ML',
                address: {
                    address: '123 Main St',
                    address_2: 'Apt 4',
                    city: 'Somewhere',
                    zip_code: '12345',
                    state_province: 'CA',
                    country: 'USA',
                },
            },
            demographics: {
                share: true,
                sex: 'Male',
                ethnicity: 'Hispanic',
                race: 'White',
                disability: 'None',
            },
        };

        expect(convertDataToBackend(input)).toEqual(expectedOutput);
    });

    it('should handle empty focus area', () => {
        const input = {
            userSysId: '123',
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
                focusArea: [],
                address: {
                    address: '123 Main St',
                    address2: 'Apt 4',
                    city: 'Somewhere',
                    zip: '12345',
                    stateProvince: 'CA',
                    country: 'USA',
                },
            },
            demographics: {
                share: true,
                sex: 'Male',
                ethnicity: 'Hispanic',
                race: ['White'],
                disability: ['None'],
            },
        };

        const expectedOutput = {
            basic_info: {
                sys_id: '123',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '+11234567890',
                business_phone: '+10987654321',
                highest_level_of_education: 'PhD',
                us_citizen: 'true',
                focus_area: '',
                address: {
                    address: '123 Main St',
                    address_2: 'Apt 4',
                    city: 'Somewhere',
                    zip_code: '12345',
                    state_province: 'CA',
                    country: 'USA',
                },
            },
            demographics: {
                share: true,
                sex: 'Male',
                ethnicity: 'Hispanic',
                race: 'White',
                disability: 'None',
            },
        };

        expect(convertDataToBackend(input)).toEqual(expectedOutput);
    });

    it('should handle undefined focus area', () => {
        const input = {
            userSysId: '123',
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
                focusArea: ['undefined'],
                address: {
                    address: '123 Main St',
                    address2: 'Apt 4',
                    city: 'Somewhere',
                    zip: '12345',
                    stateProvince: 'CA',
                    country: 'USA',
                },
            },
            demographics: {
                share: true,
                sex: 'Male',
                ethnicity: 'Hispanic',
                race: ['White'],
                disability: ['None'],
            },
        };

        const expectedOutput = {
            basic_info: {
                sys_id: '123',
                first_name: 'John',
                middle_name: 'A',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                phone: '+11234567890',
                business_phone: '+10987654321',
                highest_level_of_education: 'PhD',
                us_citizen: 'true',
                focus_area: '',
                address: {
                    address: '123 Main St',
                    address_2: 'Apt 4',
                    city: 'Somewhere',
                    zip_code: '12345',
                    state_province: 'CA',
                    country: 'USA',
                },
            },
            demographics: {
                share: true,
                sex: 'Male',
                ethnicity: 'Hispanic',
                race: 'White',
                disability: 'None',
            },
        };

        expect(convertDataToBackend(input)).toEqual(expectedOutput);
    });
});