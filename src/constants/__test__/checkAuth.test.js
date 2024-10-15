import axios from 'axios';
import { checkAuth } from '../checkAuth';

// Mocking axios module
jest.mock('axios');

describe('checkAuth', () => {
  it('sets loading state and updates auth state correctly', async () => {
    // Mocking axios response
    const mockData = {
      result: {
        logged_in: true,
        itrust_idp: '',
        itrust_url: 'http://itrust.example.com/login_with_sso.do?&glide_sso_id=',
        okta_idp: '',
        session_timeout: 1800000,
        user: {
          first_name: 'Luke',
          last_initial: 'S',
          user_id: 'db3ceb081bbec21089b9ece0f54bcbb3',
          has_profile: true,
          has_applications: true,
          roles: ['x_g_nci_app_tracke', 'snc_internal'],
          tenant: null,
        },
        okta_login_and_redirect_url: 'http://okta.example.com/login',
      },
    };
    axios.get.mockResolvedValue({ data: mockData });

    // Mocking setIsLoading and setAuth functions
    const setIsLoading = jest.fn();
    const setAuth = jest.fn();

    // Execute the function
    await checkAuth(setIsLoading, setAuth);

    // Assertions
    expect(setIsLoading).toHaveBeenCalledTimes(2);
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
    expect(setAuth).toHaveBeenCalledWith({
      isUserLoggedIn: mockData.result.logged_in,
      iTrustGlideSsoId: mockData.result.itrust_idp,
      iTrustUrl: mockData.result.itrust_url,
      oktaGlideSsoId: mockData.result.okta_idp,
      sessionTimeout: mockData.result.session_timeout,
      user: {
        firstName: mockData.result.user.first_name,
        lastInitial: mockData.result.user.last_initial,
        uid: mockData.result.user.user_id,
        hasProfile: mockData.result.has_profile,
        hasApplications: mockData.result.user.has_applications,
        roles: mockData.result.user.roles,
        tenant: mockData.result.user.tenant,
      },
      oktaLoginAndRedirectUrl: mockData.result.okta_login_and_redirect_url,
    });
  });
});