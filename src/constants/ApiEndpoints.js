const VACANCY_DETAILS_FOR_APPLICANTS =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_applicants/';

const GET_COMMITTEE_CHAIR_VACANCIES = '/api/x_g_nci_app_tracke/vacancy/chair';

const GET_APPLICATION = '/api/x_g_nci_app_tracke/application/get_application/';

const GET_APPLICATION_TRIAGE_INFO =
	'/api/x_g_nci_app_tracke/vacancy/get_vacancy_state/';

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

const ADVANCE_VACANCY_TO_NEXT_STEP =
	'/api/x_g_nci_app_tracke/vacancy/next_step/';

const REQUEST_CHAIR_TRIAGE =
	'/api/x_g_nci_app_tracke/vacancy/request_chair_triage/';

const CHECK_AUTH = '/api/x_g_nci_app_tracke/login/check_auth';

const EXTEND_VACANCY = '/api/x_g_nci_app_tracke/vacancy/extend/';

const SERVICE_NOW_FILE_ATTACHMENT = '/api/now/attachment/file';
const SERVICE_NOW_ATTACHMENT = '/api/now/attachment/';

export {
	VACANCY_DETAILS_FOR_APPLICANTS,
	GET_APPLICATION,
	GET_APPLICATION_TRIAGE_INFO,
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
};
