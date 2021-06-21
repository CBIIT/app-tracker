const VACANCY_DETAILS_FOR_APPLICANTS =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_applicants/';

const GET_COMMITTEE_CHAIR_VACANCIES = '/api/x_g_nci_app_tracke/vacancy/chair';

const GET_APPLICATION = '/api/x_g_nci_app_tracke/application/get_application/';

const GET_APPLICATION_TRIAGE_INFO =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_state/';

const GET_USER_APPLICATIONS =
	'/api/x_g_nci_app_tracke/application/get_user_apps';

const REMOVE_USER_APPLICATION_DRAFT =
	'/api/x_g_nci_app_tracke/application/remove/';
const WITHDRAW_USER_APPLICATION =
	'/api/x_g_nci_app_tracke/application/withdraw/';

const GET_VACANCY_MANAGER_VIEW =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_manager_view/';
const SUBMIT_COMMITTEE_DECISION =
	'/api/x_g_nci_app_tracke/application/submit_committee_decision';

const SUBMIT_COMMITTEE_COMMENTS =
	'/api/x_g_nci_app_tracke/application/submit_committee_comments';

const GET_COMMITTEE_MEMBER_VIEW = '/api/x_g_nci_app_tracke/vacancy/committee';

const SUBMIT_TRIAGE = '/api/x_g_nci_app_tracke/application/submit_triage';
const SUBMIT_INDIVIDUAL_SCORING =
	'/api/x_g_nci_app_tracke/application/submit_individual_scoring';
const DISPLAY_REFERENCES =
	'/api/x_g_nci_app_tracke/application/display_references';

const GET_DRAFT = '/api/x_g_nci_app_tracke/vacancy/get_draft/';

const SAVE_VACANCY_DRAFT = '/api/x_g_nci_app_tracke/vacancy/save_draft';

const ADVANCE_VACANCY_TO_NEXT_STEP =
	'/api/x_g_nci_app_tracke/vacancy/next_step/';

const REQUEST_CHAIR_TRIAGE =
	'/api/x_g_nci_app_tracke/vacancy/request_chair_triage/';

const CHECK_AUTH = '/api/x_g_nci_app_tracke/login/check_auth';

const EXTEND_VACANCY = '/api/x_g_nci_app_tracke/vacancy/extend/';
const REMOVE_VACANCY = '/api/x_g_nci_app_tracke/vacancy/remove/';
const REMOVE_DRAFT_VACANCY = '/api/x_g_nci_app_tracke/vacancy/remove_draft/';

const SERVICE_NOW_FILE_ATTACHMENT = '/api/now/attachment/file';
const SERVICE_NOW_ATTACHMENT = '/api/now/attachment/';
const EDIT_VACANCY = '/api/x_g_nci_app_tracke/vacancy/edit';

export {
	VACANCY_DETAILS_FOR_APPLICANTS,
	GET_APPLICATION,
	GET_APPLICATION_TRIAGE_INFO,
	GET_USER_APPLICATIONS,
	REMOVE_USER_APPLICATION_DRAFT,
	WITHDRAW_USER_APPLICATION,
	SUBMIT_TRIAGE,
	DISPLAY_REFERENCES,
	REQUEST_CHAIR_TRIAGE,
	CHECK_AUTH,
	GET_VACANCY_MANAGER_VIEW,
	GET_COMMITTEE_MEMBER_VIEW,
	SUBMIT_INDIVIDUAL_SCORING,
	ADVANCE_VACANCY_TO_NEXT_STEP,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
	SUBMIT_COMMITTEE_DECISION,
	SUBMIT_COMMITTEE_COMMENTS,
	GET_COMMITTEE_CHAIR_VACANCIES,
	EXTEND_VACANCY,
	REMOVE_VACANCY,
	SAVE_VACANCY_DRAFT,
	REMOVE_DRAFT_VACANCY,
	GET_DRAFT,
	EDIT_VACANCY,
};
