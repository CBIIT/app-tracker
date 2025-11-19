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
        bannerMessage: data.banner_message,
        bannerDescription: data.banner_description,
        user: {
            firstName: data.user.first_name,
            lastInitial: data.user.last_initial,
            uid: data.user.user_id,
            hasProfile: data.has_profile,
            tenant: data.user.tenant, // deprecated
            isChair: data.is_chair, // deprecated, this will depend on tenant
            isReadOnlyUser: data.is_read_only_user, // deprecated, this will depend on tenant
            isManager: data.is_manager, // based on group assignment
            isCommitteeMember: data.is_committee_member, // based on group assignment
            isExecSec: data.is_exec_sec, // deprecated, this will depend on tenant
            hasApplications: data.user.has_applications,
            roles: data.user.roles,
        },
        oktaLoginAndRedirectUrl: data.okta_login_and_redirect_url,
        tenants: data.tenants,
    });
    setIsLoading(false);
};