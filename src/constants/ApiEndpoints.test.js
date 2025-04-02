import * as ApiEndpoints from './ApiEndpoints';

describe('ApiEndpoints', () => {
    it('should have the correct value for VACANCY_DETAILS_FOR_APPLICANTS', () => {
        expect(ApiEndpoints.VACANCY_DETAILS_FOR_APPLICANTS).toBe('/api/x_g_nci_app_tracke/vacancy/get_vacancy_applicants/');
    });

    it('should have the correct value for GET_COMMITTEE_CHAIR_VACANCIES', () => {
        expect(ApiEndpoints.GET_COMMITTEE_CHAIR_VACANCIES).toBe('/api/x_g_nci_app_tracke/vacancy/chair');
    });

    it('should have the correct value for GET_APPLICATION', () => {
        expect(ApiEndpoints.GET_APPLICATION).toBe('/api/x_g_nci_app_tracke/application/get_application/');
    });

    it('should have the correct value for GET_APPLICATION_DRAFT', () => {
        expect(ApiEndpoints.GET_APPLICATION_DRAFT).toBe('/api/x_g_nci_app_tracke/application/app_draft/');
    });

    it('should have the correct value for GET_APPLICATION_TRIAGE_INFO', () => {
        expect(ApiEndpoints.GET_APPLICATION_TRIAGE_INFO).toBe('/api/x_g_nci_app_tracke/vacancy/get_vacancy_state/');
    });

    it('should have the correct value for GET_USER_APPLICATIONS', () => {
        expect(ApiEndpoints.GET_USER_APPLICATIONS).toBe('/api/x_g_nci_app_tracke/application/get_user_apps');
    });

    it('should have the correct value for GET_APPLICANT_LIST', () => {
        expect(ApiEndpoints.GET_APPLICANT_LIST).toBe('/api/x_g_nci_app_tracke/vacancy/get_applicant_list/');
    });

    it('should have the correct value for GET_ROLLING_APPLICANT_LIST', () => {
        expect(ApiEndpoints.GET_ROLLING_APPLICANT_LIST).toBe('/api/x_g_nci_app_tracke/vacancy/get_applicants_list_rolling_close/');
    });

    it('should have the correct value for GET_APPLICATION_SCORES', () => {
        expect(ApiEndpoints.GET_APPLICATION_SCORES).toBe('/api/x_g_nci_app_tracke/application/get_scores/');
    });

    it('should have the correct value for REMOVE_USER_APPLICATION_DRAFT', () => {
        expect(ApiEndpoints.REMOVE_USER_APPLICATION_DRAFT).toBe('/api/x_g_nci_app_tracke/application/remove/');
    });

    it('should have the correct value for WITHDRAW_USER_APPLICATION', () => {
        expect(ApiEndpoints.WITHDRAW_USER_APPLICATION).toBe('/api/x_g_nci_app_tracke/application/withdraw/');
    });

    it('should have the correct value for GET_VACANCY_MANAGER_VIEW', () => {
        expect(ApiEndpoints.GET_VACANCY_MANAGER_VIEW).toBe('/api/x_g_nci_app_tracke/vacancy/get_vacancy_manager_view/');
    });

    it('should have the correct value for SUBMIT_COMMITTEE_DECISION', () => {
        expect(ApiEndpoints.SUBMIT_COMMITTEE_DECISION).toBe('/api/x_g_nci_app_tracke/application/submit_committee_decision');
    });

    it('should have the correct value for SUBMIT_COMMITTEE_COMMENTS', () => {
        expect(ApiEndpoints.SUBMIT_COMMITTEE_COMMENTS).toBe('/api/x_g_nci_app_tracke/application/submit_committee_comments');
    });

    it('should have the correct value for GET_COMMITTEE_MEMBER_VIEW', () => {
        expect(ApiEndpoints.GET_COMMITTEE_MEMBER_VIEW).toBe('/api/x_g_nci_app_tracke/vacancy/committee');
    });

    it('should have the correct value for SUBMIT_TRIAGE', () => {
        expect(ApiEndpoints.SUBMIT_TRIAGE).toBe('/api/x_g_nci_app_tracke/application/submit_triage');
    });

    it('should have the correct value for SUBMIT_INDIVIDUAL_SCORING', () => {
        expect(ApiEndpoints.SUBMIT_INDIVIDUAL_SCORING).toBe('/api/x_g_nci_app_tracke/application/submit_individual_scoring');
    });

    it('should have the correct value for DISPLAY_REFERENCES', () => {
        expect(ApiEndpoints.DISPLAY_REFERENCES).toBe('/api/x_g_nci_app_tracke/application/display_references');
    });

    it('should have the correct value for GET_DRAFT', () => {
        expect(ApiEndpoints.GET_DRAFT).toBe('/api/x_g_nci_app_tracke/vacancy/get_draft/');
    });

    it('should have the correct value for SAVE_VACANCY_DRAFT', () => {
        expect(ApiEndpoints.SAVE_VACANCY_DRAFT).toBe('/api/x_g_nci_app_tracke/vacancy/v2/save_draft');
    });

    it('should have the correct value for ADVANCE_VACANCY_TO_NEXT_STEP', () => {
        expect(ApiEndpoints.ADVANCE_VACANCY_TO_NEXT_STEP).toBe('/api/x_g_nci_app_tracke/vacancy/next_step/');
    });

    it('should have the correct value for CHANGE_VACANCY_STATUS', () => {
        expect(ApiEndpoints.CHANGE_VACANCY_STATUS).toBe('/api/x_g_nci_app_tracke/vacancy/change_status/');
    });

    it('should have the correct value for REQUEST_CHAIR_TRIAGE', () => {
        expect(ApiEndpoints.REQUEST_CHAIR_TRIAGE).toBe('/api/x_g_nci_app_tracke/vacancy/request_chair_triage/');
    });

    it('should have the correct value for CHECK_AUTH', () => {
        expect(ApiEndpoints.CHECK_AUTH).toBe('/api/x_g_nci_app_tracke/login/v2/check_auth');
    });

    it('should have the correct value for EXTEND_VACANCY', () => {
        expect(ApiEndpoints.EXTEND_VACANCY).toBe('/api/x_g_nci_app_tracke/vacancy/extend');
    });

    it('should have the correct value for REMOVE_VACANCY', () => {
        expect(ApiEndpoints.REMOVE_VACANCY).toBe('/api/x_g_nci_app_tracke/vacancy/remove/');
    });

    it('should have the correct value for REMOVE_DRAFT_VACANCY', () => {
        expect(ApiEndpoints.REMOVE_DRAFT_VACANCY).toBe('/api/x_g_nci_app_tracke/vacancy/remove_draft/');
    });

    it('should have the correct value for SERVICE_NOW_FILE_ATTACHMENT', () => {
        expect(ApiEndpoints.SERVICE_NOW_FILE_ATTACHMENT).toBe('/api/now/attachment/file');
    });

    it('should have the correct value for SERVICE_NOW_ATTACHMENT', () => {
        expect(ApiEndpoints.SERVICE_NOW_ATTACHMENT).toBe('/api/now/attachment/');
    });

    it('should have the correct value for EDIT_VACANCY', () => {
        expect(ApiEndpoints.EDIT_VACANCY).toBe('/api/x_g_nci_app_tracke/vacancy/edit');
    });

    it('should have the correct value for SUBMIT_APPLICATION', () => {
        expect(ApiEndpoints.SUBMIT_APPLICATION).toBe('/api/x_g_nci_app_tracke/application/submit_app');
    });

    it('should have the correct value for CREATE_OKTA_USER', () => {
        expect(ApiEndpoints.CREATE_OKTA_USER).toBe('/api/x_g_nci_app_tracke/login/create_okta_user');
    });

    it('should have the correct value for CHECK_USER_ALREADY_APPLIED', () => {
        expect(ApiEndpoints.CHECK_USER_ALREADY_APPLIED).toBe('/api/x_g_nci_app_tracke/application/check_existing/');
    });

    it('should have the correct value for APPLICANT_GET_APPLICATION', () => {
        expect(ApiEndpoints.APPLICANT_GET_APPLICATION).toBe('/api/x_g_nci_app_tracke/application/get_application_applicant/');
    });

    it('should have the correct value for COLLECT_REFERENCES', () => {
        expect(ApiEndpoints.COLLECT_REFERENCES).toBe('/api/x_g_nci_app_tracke/application/collect_references/');
    });

    it('should have the correct value for SCORES', () => {
        expect(ApiEndpoints.SCORES).toBe('/api/x_g_nci_app_tracke/application/scores/');
    });

    it('should have the correct value for RECUSE', () => {
        expect(ApiEndpoints.RECUSE).toBe('/api/x_g_nci_app_tracke/scoring/recuse');
    });

    it('should have the correct value for VACANCY_COUNTS', () => {
        expect(ApiEndpoints.VACANCY_COUNTS).toBe('/api/x_g_nci_app_tracke/vacancy/v2/counts/');
    });

    it('should have the correct value for DASHBOARD_VACANCIES', () => {
        expect(ApiEndpoints.DASHBOARD_VACANCIES).toBe('/api/x_g_nci_app_tracke/vacancy/v2/get_dashboard_vacancy_list/');
    });

    it('should have the correct value for SAVE_APP_DRAFT', () => {
        expect(ApiEndpoints.SAVE_APP_DRAFT).toBe('/api/x_g_nci_app_tracke/application/save_app_draft');
    });

    it('should have the correct value for APPLICATION_SUBMISSION', () => {
        expect(ApiEndpoints.APPLICATION_SUBMISSION).toBe('/api/x_g_nci_app_tracke/application/submission');
    });

    it('should have the correct value for INTERVIEW', () => {
        expect(ApiEndpoints.INTERVIEW).toBe('/api/x_g_nci_app_tracke/application/interview');
    });

    it('should have the correct value for REFERRED_TO_SELECTING_OFFICIAL', () => {
        expect(ApiEndpoints.REFERRED_TO_SELECTING_OFFICIAL).toBe('/api/x_g_nci_app_tracke/application/selecting-official');
    });

    it('should have the correct value for SELECTED', () => {
        expect(ApiEndpoints.SELECTED).toBe('/api/x_g_nci_app_tracke/application/selected');
    });

    it('should have the correct value for GET_PROFILE', () => {
        expect(ApiEndpoints.GET_PROFILE).toBe('/api/x_g_nci_app_tracke/user/user_profile/');
    });

    it('should have the correct value for SAVE_PROFILE', () => {
        expect(ApiEndpoints.SAVE_PROFILE).toBe('/api/x_g_nci_app_tracke/user/save_user_profile');
    });

    it('should have the correct value for CHECK_HAS_PROFILE', () => {
        expect(ApiEndpoints.CHECK_HAS_PROFILE).toBe('/api/x_g_nci_app_tracke/user/check_profile');
    });

    it('should have the correct value for GET_VACANCY_OPTIONS', () => {
        expect(ApiEndpoints.GET_VACANCY_OPTIONS).toBe('/api/x_g_nci_app_tracke/vacancy/get_vacancy_options');
    });
});