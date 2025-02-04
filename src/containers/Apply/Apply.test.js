import { render } from '@testing-library/react';
import Apply from './Apply';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import checkAuth from '../../constants/checkAuth';
import { useParams, MemoryRouter } from 'react-router-dom';
import { 
    SAVE_APP_DRAFT, 
    VACANCY_DETAILS_FOR_APPLICANTS,
    GET_PROFILE,
} from '../../constants/ApiEndpoints';
import { mockUseAuth } from './SubmitModal/SubmitModalMockData';

jest.mock('../../hooks/useAuth');
jest.mock('../../constants/checkAuth');
jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
  }));

describe('Apply component', () => {

    beforeEach(() => {
        const mockUseAuth = {
            auth: {
                isUserLoggedIn: true,
                user: { uid: '123' },
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should render new application form', async () => {
        useParams.mockReturnValue({ id: '' });
        const mockVacancySysId = '12345';
        const mockDefaultFormData = {
            basicInfo: {
                phonePrefix: '+1',
                businessPhonePrefix: '+1'
            },
            focusArea: [],
            address: {},
            references: [],
            applicantDocuments: [],
            questions: {},
        };

        const mockVacancyResponse = {
            data: {
                result: {
                    basic_info: {
                        number_of_recommendations: {label: '1', value: '1'},
                        tenant: {label: 'test tenant', value: '123'},
                        vacancy_title: {label: 'Test Vacancy', value: 'Test Vacancy'},
                    },
                    vacancy_documents: [
                        {
                            is_optional: {label: 'false', value: '0'},
                            title: {label: 'Test Document', value: 'Test Document'},
                            vacancy_id: {label: 'Test Vacancy', value: '12345'},
                        },
                    ],
                    exists: true
                }
            }
        };

        const mockProfileResponse = {
            data: {
                result: {
                    response: {
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
                        demographics: {
                            share: '1',
                            disability: 'none',
                            ethnicity: 'Hispanic',
                            race: 'White,Asian',
                            sex: 'Male',
                        },
                        status: 200,
                    },
                },
            },
        };

        const mockProfileData = {
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
            demographics: {
                share: '1',
                disability: ['none'],
                ethnicity: 'Hispanic',
                race: ['White', 'Asian'],
                sex: 'Male',
            },
        };

        axios.get.mockImplementationOnce(() => Promise.resolve(mockProfileData));
        axios.get.mockResolvedValueOnce({ data: { result: { exists: true } } });
        axios.get.mockResolvedValueOnce(mockProfileResponse);

        axios.get.mockImplementationOnce(() => Promise.resolve(mockVacancyResponse));
        axios.get.mockResolvedValueOnce({ data: { result: { exists: true } } });
        axios.get.mockResolvedValueOnce(mockVacancyResponse);

        render(
            <MemoryRouter initialEntries={['/apply']}>
                <Apply
                    initialValues={mockDefaultFormData}
                    profileData={mockProfileData}
                />
            </MemoryRouter>
        );

    });

});