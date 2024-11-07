import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { message, notification } from 'antd';
import Apply from './Apply';
import ViewVacancyDetails from '../ViewVacancyDetails/ViewVacancyDetails';
import ApplicantDocuments from './Forms/ApplicantDocuments/ApplicantDocuments';
import useAuth from '../../hooks/useAuth';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useHistory: jest.fn(),
}));
jest.mock('../../hooks/useAuth');
jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    },
}));

const mockUseAuth = {
    auth: {
        iTrustGlideSsoId: 'testSsoId',
        iTrustUrl: 'https://test.itrust.com',
        isUserLoggedIn: false,
        user: { firstName: 'John', lastInitial: 'D' },
        oktaLoginAndRedirectUrl: 'https://test.okta.com',

    },
};

const mockUser = {
    data: {
        results: {
            response: {
                basic_info: {
                    address: '123 Main St',
                    address_2: null,
                    business_phone: '+1',
                    city: 'tes',
                    country: 'United States',
                    email: 'luke.skywalker@TheForce.com',
                    first_name: 'Luke',
                    highest_level_of_education: 'Doctorate',
                    last_name: 'Skywalker',
                    middle_name: null,
                    number: 'USR0000001',
                    phone: '+11234567890',
                    state_province: 'MD',
                    sys_id: '123',
                    us_citizen: 'Yes',
                    zip_code: '20855'
                }
            },
        },
    },
};

const mockVacancyProps = {
    closeDate: '',
    openDate: '2024-09-13',
    sysId: '456',
    title: 'Vacancy Title',
    vacancyPOC: {
        email: 'vacancy.poc@email.com',
        name: 'Vacancy POC',
        value: '789',
    },
    vacancyState: 'rolling_close',
    vacancyStatus: 'open',
};



describe('Apply', () => {
    let mockUseAuth;

    beforeEach(() => {
        mockUseAuth = {
            auth: { isUserLoggedIn: true, user: { hasProfile : true} },
        };

        useAuth.mockReturnValue(mockUseAuth);
        mockHistoryPush = jest.fn();
        useHistory.mockReturnValue({ push: mockHistoryPush });
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn() 
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // New Application test cases
    // fetches Profile data
    // it('should fetch profile data', async () => {
    //     useParams.mockReturnValue({ sysId: '123' });

    //     axios.get.mockResolvedValue({ data: { results: { exists: true } } });
    //     axios.get.mockResolvedValue({ mockUser});

    //     render(<Apply {...mockUser} {...mockVacancyProps} {...mockUseAuth} />);

    // });

    it('handles error while fetching profile data', async () => {
        const mockHistoryPush = jest.fn();
        // const notificationError = jest.spyOn(notification, 'error');
        jest.spyOn(notification, 'error');
        jest.spyOn(window.history, 'back').mockImplementation(mockHistoryPush);

        useParams.mockReturnValue({ sysId: '123' });
        axios.get.mockRejectedValue(new Error('This profile does not exist.'));

        await waitFor(() => {
            render(<ViewVacancyDetails {...mockVacancyDetails} />);
            expect(notification.error).toHaveBeenCalledWith({
                message: "Sorry! There was an error retrieving your profile.",
                description: <>
					<p>
					Please verify if the vacancy has closed. If not, please log out and re-login to resubmit your application. If the issue continues, contact the Help Desk by emailing <a href='mailto:NCIAppSupport@mail.nih.gov'>NCIAppSupport@mail.nih.gov</a>
					</p>
				</>,
            });
        });

        expect(mockHistoryPush).toHaveBeenCalled();
        
    });

    // render applicant documents page with optional and mandatory documents

    // renders reference section with number of references

    // renders Additional Questions section

    // renders Review Section



    // Edit Draft Application test cases






    // Edit Submitted Application test cases
    

});

const mockVacancyDetails = {
    response: {
        data: {
            result: {
                basic_info: {
                    allow_hr_specialist_triage: {label: 'false', value: '0'},
                    close_date: {label: '', value: ''},
                    close_date_day: {label: '', value: ''},
                    close_date_month: {label: '', value: ''},
                    close_date_year: {label: '', value: ''},
                    disability_count: {label: '', value: ''},
                    equal_opportunity_employment_statement: {label: '<p>Selection for this position will be based solel…inorities, and individuals with disabilities.</p>', value: '<p>Selection for this position will be based solel…inorities, and individuals with disabilities.</p>'},
                    ethnicity_number: {label: '', value: ''},
                    extended: {label: 'false', value: '0'},
                    female_count: {label: '', value: ''},
                    foreign_education_statement: {label: '<p>Applicants who have completed part or all of th…ior to the effective date of the appointment.</p>', value: '<p>Applicants who have completed part or all of th…ior to the effective date of the appointment.</p>'},
                    ic: {label: 'OD', value: 'OD'},
                    male_count: {label: '', value: ''},
                    next_step: {label: '', value: ''},
                    not_recommended: {label: '0', value: '0'},
                    not_referred: {label: '0', value: '0'},
                    number: {label: 'VAC0001068', value: 'VAC0001068'},
                    number_of_applications: {label: '6', value: '6'},
                    number_of_categories: {label: '4', value: '4'},
                    number_of_recommendation: {label: '1', value: '1'},
                    number_qualified: {label: '0', value: '0'},
                    number_referred: {label: '0', value: '0'},
                    number_selected: {label: '0', value: '0'},
                    open_date: {label: '09/13/2024', value: '2024-09-13'},
                    organization_code: {label: 'HN212', value: 'HN212'},
                    package_initiator: {label: 'Roland Owens', value: '5757ae586fc54e001c857eeeae3ee4d2'},
                    reasonable_accommodation_statement: {label: '<p>NIH provides reasonable accommodations to appli…odation will be made on a case-by-case basis.</p>', value: '<p>NIH provides reasonable accommodations to appli…odation will be made on a case-by-case basis.</p>'},
                    recommendation_type: {label: 'Reference', value: 'reference'},
                    reference_collection: {label: 'false', value: '0'},
                    reference_collection_date: {label: '', value: ''},
                    require_focus_area: {label: 'true', value: '1'},
                    scoring_due_by_date: {label: '', value: ''},
                    scoring_start_date: {label: '', value: ''},
                    show_eoes: {label: 'true', value: '1'},
                    show_fes: {label: 'true', value: '1'},
                    show_ras: {label: 'true', value: '1'},
                    show_socs: {label: 'true', value: '1'},
                    standards_of_conduct_statement: {label: '<p>The National Institutes of Health inspires publ…ior to the effective date of the appointment.</p>', value: '<p>The National Institutes of Health inspires publ…ior to the effective date of the appointment.</p>'},
                    state: {label: 'Rolling Close', value: 'rolling_close'},
                    status: {label: 'Open', value: 'open'},
                    sys_created_by: {label: 'owensrol@nih.gov', value: 'owensrol@nih.gov'},
                    sys_created_on: {label: '09/13/2024 13:44:41', value: '2024-09-13 17:44:41'},
                    sys_id: {label: '0d47e5721b289e9089b9ece0f54bcb67', value: '0d47e5721b289e9089b9ece0f54bcb67'},
                    sys_mod_count: {label: '58', value: '58'},
                    sys_tags: {label: '', value: ''},
                    sys_updated_by: {label: 'luke.skywalker.test@me.com', value: 'luke.skywalker.test@me.com'},
                    sys_updated_on: {label: '10/22/2024 18:05:52', value: '2024-10-22 22:05:52'},
                    tenant: {label: 'Stadtman', value: 'b61e03c81bb01910e541631ee54bcb57'},
                    title_42_position_classification: {label: 'Senior Research Fellow', value: 'Senior Research Fellow'},
                    total_recommended_applicants: {label: '0', value: '0'},
                    total_referred_to_selecting_official: {label: '0', value: '0'},
                    use_close_date: {label: 'false', value: '0'},
                    vacancy_description: {label: '<p>scenario 2</p>', value: '<p>scenario 2</p>'},
                    vacancy_poc: {label: 'Roland Owens', value: '5757ae586fc54e001c857eeeae3ee4d2', email: 'owensrol@mail.nih.gov'},
                    vacancy_title: {label: 'Scenario 2 Stadtman', value: 'Scenario 2 Stadtman'},
                    vacancy_type_id: {label: '', value: ''},
                },
                vacancy_documents: {
                    0: {
                        is_optional: {label: 'false', value: '0'},
                        sys_created_by: {label: 'owensrol@nih.gov', value: 'owensrol@nih.gov'},
                        sys_created_on: {label: '09/13/2024 13:44:41', value: '2024-09-13 17:44:41'},
                        sys_id: {label: '414729721b289e9089b9ece0f54bcbd1', value: '414729721b289e9089b9ece0f54bcbd1'},
                        sys_mod_count: {label: '1', value: '1'},
                        sys_tags: {label: '', value: ''},
                        sys_updated_by: {label: 'harveybr@nih.gov', value: 'harveybr@nih.gov'},
                        sys_updated_on: {label: '10/17/2024 18:23:46', value: '2024-10-17 22:23:46'},
                        title: {label: 'Cover Letter', value: 'Cover Letter'},
                        vacancy_id: {label: 'Scenario 2 Stadtman', value: '0d47e5721b289e9089b9ece0f54bcb67'},
                    },
                    1: {
                        is_optional: {label: 'true', value: '1'},
                        sys_created_by: {label: 'owensrol@nih.gov', value: 'owensrol@nih.gov'},
                        sys_created_on: {label: '09/13/2024 13:44:41', value: '2024-09-13 17:44:41'},
                        sys_id: {label: '454729721b289e9089b9ece0f54bcbd1', value: '454729721b289e9089b9ece0f54bcbd1'},
                        sys_mod_count: {label: '0', value: '0'},
                        sys_tags: {label: '', value: ''},
                        sys_updated_by: {label: 'owensrol@nih.gov', value: 'owensrol@nih.gov'},
                        sys_updated_on: {label: '09/13/2024 13:44:41', value: '2024-09-13 17:44:41'},
                        title: {label: 'Qualification Statement', value: 'Qualification Statement'},
                        vacancy_id: {label: 'Scenario 2 Stadtman', value: '0d47e5721b289e9089b9ece0f54bcb67'},
                    },
                    2: {
                        is_optional: {label: 'false', value: '0'},
                        sys_created_by: {label: 'owensrol@nih.gov', value: 'owensrol@nih.gov'},
                        sys_created_on: {label: '09/13/2024 13:44:41', value: '2024-09-13 17:44:41'},
                        sys_id: {label: 'c14729721b289e9089b9ece0f54bcbd1', value: 'c14729721b289e9089b9ece0f54bcbd1'},
                        sys_mod_count: {label: '1', value: '1'},
                        sys_tags: {label: '', value: ''},
                        sys_updated_by: {label: 'harveybr@nih.gov', value: 'harveybr@nih.gov'},
                        sys_updated_on: {label: '10/17/2024 18:23:49', value: '2024-10-17 22:23:49'},
                        title: {label: 'Vision Statement', value: 'Vision Statement'},
                        vacancy_id: {label: 'Scenario 2 Stadtman', value: '0d47e5721b289e9089b9ece0f54bcb67'},
                    },
                    3: {
                        is_optional: {label: 'false', value: '0'},
                        sys_created_by: {label: 'owensrol@nih.gov', value: 'owensrol@nih.gov'},
                        sys_created_on: {label: '09/13/2024 13:44:41', value: '2024-09-13 17:44:41'},
                        sys_id: {label: 'cd4729721b289e9089b9ece0f54bcbd0', value: 'cd4729721b289e9089b9ece0f54bcbd0'},
                        sys_mod_count: {label: '1', value: '1'},
                        sys_tags: {label: '', value: ''},
                        sys_updated_by: {label: 'harveybr@nih.gov', value: 'harveybr@nih.gov'},
                        sys_updated_on: {label: '10/17/2024 18:23:53', value: '2024-10-17 22:23:53'},
                        title: {label: 'Curriculum Vitae (CV)', value: 'Curriculum Vitae (CV)'},
                        vacancy_id: {label: 'Scenario 2 Stadtman', value: '0d47e5721b289e9089b9ece0f54bcb67'},
                    },
                },
            }
        }
    }
};