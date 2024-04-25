import axios from 'axios';
import { CHECK_AUTH } from './ApiEndpoints';

export const checkAuth = async (setIsLoading, setAuth) => {
    setIsLoading(true);
    const response = await axios.get(CHECK_AUTH);
    const data = response.data.result;
    setAuth({
        isUserLoggedIn: data.logged_in,
        iTrustGlideSsoId: data.itrust_idp,
        iTrustUrl: data.itrust_url,
        oktaGlideSsoId: data.okta_idp,
        sessionTimeout: data.session_timeout,
        user: {
            firstName: data.user.first_name,
            lastInitial: data.user.last_initial,
            uid: data.user.user_id,
            hasProfile: data.has_profile,
            tenant: data.user.tenant,
            isChair: data.is_chair,
            isReadOnlyUser: data.is_read_only_user,
            isManager: data.is_manager,
            isExecSec: data.is_exec_sec,
            hasApplications: data.user.has_applications,
            roles: data.user.roles,
        },
        oktaLoginAndRedirectUrl: data.okta_login_and_redirect_url,
    });
    setIsLoading(false);
};