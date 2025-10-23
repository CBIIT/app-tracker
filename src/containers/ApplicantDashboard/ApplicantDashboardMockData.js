export const mockUseAuth = {
    auth: {
        has_profile: true,
        itrust_idp: '',
        itrust_url: '',
        logged_in: true,
        okta_idp: '',
        okta_login_and_redirect_url: '',
        session_timeout: 1800000,
        tenants: [],
        user: {
            first_name: 'John',
            has_applications: true,
            last_initial: 'D',
            roles: [
                'snc_internal'
            ],
            user_id: '12345',
        }
    }
};

export const mockUserApps = [
    {
        app_id: '000',
        reference_status: '1 out of 4',
        state: 'submitted',
        vacancy: 'Test Vacancy 1',
        vacancy_closes: '2024-12-31',
        vacancy_id: '111',
        vacancy_state: 'individual_scoring_in_progress',
        vacancy_status: 'closed',
        vacancy_submitted: '2024-11-30 11:13:12',
    },
    {
        app_id: '001',
        reference_status: '2 out of 3',
        state: 'triage',
        vacancy: 'Rolling Close Vacancy',
        vacancy_closes: '',
        vacancy_id: '222',
        vacancy_state: 'rolling_close',
        vacancy_status: 'open',
        vacancy_submitted: '2024-11-30 11:13:12',
    },
];