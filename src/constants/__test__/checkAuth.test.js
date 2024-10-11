import axios from 'axios';
import { checkAuth } from '../checkAuth';
import { TestScheduler } from 'jest';

jest.mock('axios');

describe('checkAuth test with mock data', () => {
    const setIsLoading = jest.fn();
    const setAuth = jest.fn();
    const mockData = {
        result: {
            logged_in: true,
            itrust_idp: '',
            itrust_url: 'https://specializedscientificjobs-dev2.nih.gov/login_with_sso.do?&glide_sso_id=',
            okta_idp: '',
            session_timeout: 1800000,
            user: {
                first_name: 'Luke',
                last_initial: 'S',
                user_id: 'db3ceb081bbec21089b9ece0f54bcbb3',
                hasProfile: true,
                tenant: null,
                isChair: false,
                isReadOnlyUser: false,
                isManager: false,
                isExecSec: false,
                hasApplications: true,
                roles: [
                    'x_g_nci_app_tracke.user', 
                    'snc_internal'
                ],
            },
            okta_login_and_redirect_url: 'https://iam-stage.cancer.gov/app/servicenow_ud/exk13dplx1oy5d1pZ0h8/sso/saml?RelayState=https://specializedscientificjobs-dev2.nih.gov/nih-ssj.do#/',
        },
    };

    it('should set Auth data to mockData', async () => {

        axios.get.mockResolvedValue({
            data: mockData
        });
    });

    it('should set setIsLoading to true/false after call', async () => {

        axios.get.mockResolvedValue({
            data: mockData
        });

        await checkAuth(setIsLoading, setAuth);

        expect(setIsLoading).toHaveBeenCalledWith(true);
        expect(setIsLoading).toHaveBeenCalledWith(false);
    });
});