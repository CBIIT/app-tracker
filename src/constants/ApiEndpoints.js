// Application Scripted REST API Endpoints
export const GET_APPLICATION_DRAFT =
	'/api/x_g_nci_app_tracke/application/app_draft/';

export const ATTACHMENT_CHECK =
	'/api/x_g_nci_app_tracke/application/attachment_check/';

export const CHECK_USER_ALREADY_APPLIED =
	'/api/x_g_nci_app_tracke/application/check_existing/';

export const COLLECT_REFERENCES =
	'/api/x_g_nci_app_tracke/application/collect_references/';

export const CREATE_APP_DOCS =
	'/api/x_g_nci_app_tracke/application/createApplicationDocument';

export const DISPLAY_REFERENCES =
	'/api/x_g_nci_app_tracke/application/display_references';

export const ATTACHMENT_CHECK_FOR_APPLICATIONS =
	'/api/x_g_nci_app_tracke/application/getAttachmentApplication/';

export const GET_APPLICATION =
	'/api/x_g_nci_app_tracke/application/get_application/';

export const APPLICANT_GET_APPLICATION =
	'/api/x_g_nci_app_tracke/application/get_application_applicant/';

export const GET_APPLICATION_SCORES =
	'/api/x_g_nci_app_tracke/application/get_scores/';

export const GET_USER_APPLICATIONS =
	'/api/x_g_nci_app_tracke/application/get_user_apps';

export const INTERVIEW = '/api/x_g_nci_app_tracke/application/interview';

export const REMOVE_USER_APPLICATION_DRAFT =
	'/api/x_g_nci_app_tracke/application/remove/';

export const SAVE_APP_DRAFT =
	'/api/x_g_nci_app_tracke/application/save_app_draft';

export const SCORES = '/api/x_g_nci_app_tracke/application/scores/';

export const SELECTED = '/api/x_g_nci_app_tracke/application/selected';

export const REFERRED_TO_SELECTING_OFFICIAL =
	'/api/x_g_nci_app_tracke/application/selecting-official';

export const APPLICATION_SUBMISSION =
	'/api/x_g_nci_app_tracke/application/submission';

export const SUBMIT_APPLICATION =
	'/api/x_g_nci_app_tracke/application/submit_app';

export const SUBMIT_COMMITTEE_COMMENTS =
	'/api/x_g_nci_app_tracke/application/submit_committee_comments';

export const SUBMIT_COMMITTEE_DECISION =
	'/api/x_g_nci_app_tracke/application/submit_committee_decision';

export const SUBMIT_INDIVIDUAL_SCORING =
	'/api/x_g_nci_app_tracke/application/submit_individual_scoring';

export const SUBMIT_TRIAGE =
	'/api/x_g_nci_app_tracke/application/submit_triage';

export const WITHDRAW_USER_APPLICATION =
	'/api/x_g_nci_app_tracke/application/withdraw/';

// Login Scripted REST API Endpoints
export const CHECK_AUTH = '/api/x_g_nci_app_tracke/login/check_auth';

export const CREATE_OKTA_USER =
	'/api/x_g_nci_app_tracke/login/create_okta_user';

// Scoring Scripted REST API Endpoints
export const RECUSE = '/api/x_g_nci_app_tracke/scoring/recuse';

// User Scripted REST API Endpoints
export const GET_PROFILE = '/api/x_g_nci_app_tracke/user/user_profile/';

export const SAVE_PROFILE = '/api/x_g_nci_app_tracke/user/save_user_profile';

export const CHECK_HAS_PROFILE = '/api/x_g_nci_app_tracke/user/check_profile';

// Vacancy Scripted REST API Endpoints
export const GET_COMMITTEE_CHAIR_VACANCIES =
	'/api/x_g_nci_app_tracke/vacancy/chair';

export const CHANGE_VACANCY_STATUS =
	'/api/x_g_nci_app_tracke/vacancy/change_status/';

export const GET_COMMITTEE_MEMBER_VIEW =
	'/api/x_g_nci_app_tracke/vacancy/committee';

export const VACANCY_COUNTS = '/api/x_g_nci_app_tracke/vacancy/counts/';

export const EDIT_VACANCY = '/api/x_g_nci_app_tracke/vacancy/edit';

export const EXTEND_VACANCY = '/api/x_g_nci_app_tracke/vacancy/extend';

export const GET_ROLLING_APPLICANT_LIST =
	'/api/x_g_nci_app_tracke/vacancy/get_applicants_list_rolling_close/';

export const GET_APPLICANT_LIST =
	'/api/x_g_nci_app_tracke/vacancy/get_applicant_list/';

export const DASHBOARD_VACANCIES =
	'/api/x_g_nci_app_tracke/vacancy/get_dashboard_vacancy_list/';

export const GET_DRAFT = '/api/x_g_nci_app_tracke/vacancy/get_draft/';

export const VACANCY_DETAILS_FOR_APPLICANTS =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_applicants/';

export const GET_VACANCY_MANAGER_VIEW =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_manager_view/';

export const GET_VACANCY_OPTIONS =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_options';

export const GET_APPLICATION_TRIAGE_INFO =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_state/';

export const ADVANCE_VACANCY_TO_NEXT_STEP =
	'/api/x_g_nci_app_tracke/vacancy/next_step/';

export const REMOVE_VACANCY = '/api/x_g_nci_app_tracke/vacancy/remove/';

export const REMOVE_DRAFT_VACANCY =
	'/api/x_g_nci_app_tracke/vacancy/remove_draft/';

export const REQUEST_CHAIR_TRIAGE =
	'/api/x_g_nci_app_tracke/vacancy/request_chair_triage/';

export const SAVE_VACANCY_DRAFT = '/api/x_g_nci_app_tracke/vacancy/save_draft';

// ServiceNow Scripted REST API Endpoints
export const SERVICE_NOW_FILE_ATTACHMENT = '/api/now/attachment/file';

export const SERVICE_NOW_ATTACHMENT = '/api/now/attachment/';
