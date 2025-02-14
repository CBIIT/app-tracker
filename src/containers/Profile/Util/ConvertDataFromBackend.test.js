import { convertDataFromBackend } from './ConvertDataFromBackend';

describe('convertDataFromBackend', () => {
    it('should convert basic info correctly', () => {
        const data = {
            basic_info: {
                sys_id: '123',
                first_name: 'John',
                middle_name: 'Doe',
                last_name: 'Smith',
                email: 'john@example.com',
                phone: '+1234567890',
                business_phone: '+1987654321',
                highest_level_of_education: 'PhD',
                us_citizen: '1',
                address: '123 Main St',
                address_2: 'Apt 4',
                city: 'Anytown',
                state_province: 'CA',
                zip_code: '12345',
                country: 'USA',
            },
            focus_area: 'area1,area2',
        };

        const result = convertDataFromBackend(data);

        expect(result).toEqual({
            userSysId: '123',
            basicInfo: {
                firstName: 'John',
                middleName: 'Doe',
                lastName: 'Smith',
                email: 'john@example.com',
                phonePrefix: '+1',
                phone: '234567890',
                businessPhonePrefix: '+1',
                businessPhone: '987654321',
                highestLevelEducation: 'PhD',
                isUsCitizen: 1,
                address: {
                    address: '123 Main St',
                    address2: 'Apt 4',
                    city: 'Anytown',
                    stateProvince: 'CA',
                    zip: '12345',
                    country: 'USA',
                },
            },
            focusArea: ['area1', 'area2'],
        });
    });

    it('should handle missing demographics correctly', () => {
        const data = {
            basic_info: {
                sys_id: '123',
                first_name: 'John',
                last_name: 'Smith',
                email: 'john@example.com',
                phone: '+1234567890',
                highest_level_of_education: 'PhD',
                us_citizen: '1',
                address: '123 Main St',
                city: 'Anytown',
                state_province: 'CA',
                zip_code: '12345',
                country: 'USA',
            },
            focus_area: 'area1,area2',
        };

        const result = convertDataFromBackend(data);

        expect(result).toEqual({
            userSysId: '123',
            basicInfo: {
                firstName: 'John',
                middleName: null,
                lastName: 'Smith',
                email: 'john@example.com',
                phonePrefix: '+1',
                phone: '234567890',
                businessPhonePrefix: '+1',
                businessPhone: null,
                highestLevelEducation: 'PhD',
                isUsCitizen: 1,
                address: {
                    address: '123 Main St',
                    address2: undefined,
                    city: 'Anytown',
                    stateProvince: 'CA',
                    zip: '12345',
                    country: 'USA',
                },
            },
            focusArea: ['area1', 'area2'],
        });
    });

    it('should handle empty focus area correctly', () => {
        const data = {
            basic_info: {
                sys_id: '123',
                first_name: 'John',
                last_name: 'Smith',
                email: 'john@example.com',
                phone: '+1234567890',
                highest_level_of_education: 'PhD',
                us_citizen: '1',
                address: '123 Main St',
                city: 'Anytown',
                state_province: 'CA',
                zip_code: '12345',
                country: 'USA',
            },
            focus_area: '',
        };

        const result = convertDataFromBackend(data);

        expect(result).toEqual({
            userSysId: '123',
            basicInfo: {
                firstName: 'John',
                middleName: null,
                lastName: 'Smith',
                email: 'john@example.com',
                phonePrefix: '+1',
                phone: '234567890',
                businessPhonePrefix: '+1',
                businessPhone: null,
                highestLevelEducation: 'PhD',
                isUsCitizen: 1,
                address: {
                    address: '123 Main St',
                    address2: undefined,
                    city: 'Anytown',
                    stateProvince: 'CA',
                    zip: '12345',
                    country: 'USA',
                },
            },
            focusArea: [],
        });
    });
});