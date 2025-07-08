export const mockRecommendedApplicants = [
	{
		actual_member_score: 0,
		applicant_email: 'user@mail.com',
		applicant_first_name: 'John',
		applicant_last_name: 'Doe',
		applicant_name: 'Doe, John',
		chair_triage_comment: '',
		chair_triage_status: 'yes',
		committee_comments: '',
		committee_decision: '--',
		interview_recommendation: {
			Maybe: 0,
			No: 0,
			Yes: 0,
		},
		is_app_complete: '',
		maybe: 0,
		no: 0,
		references_sent: '0',
		refferred_to_interview: null,
		referred_to_selecting_official: null,
		scores: [],
		scoring_status: 'Scoring in Progress',
		selected: null,
		state: 'scoring',
		sys_id: '12345',
		total: 0,
		triage_comments: '',
		triage_status: 'yes',
		yes: 0,
	},
];

export const mockRecommendedApplicantsTablePagination = {
	hideOnSinglePage: true,
	pageSize: 10,
	pagesizeOptions: [10, 25],
	total: 1,
};

export const mockUserRoles = [
	'x_g_nci_app_tracke.vacancy_manager',
	'x_g_nci_app_tracke.committee_member',
	'x_g_nci_app_tracke.user',
	'snc_internal',
];

export const mockApplicantsWithFocusAreas = [
  {
    sys_id: '1',
    applicant_name: 'Alice',
    applicant_email: 'alice@example.com',
    primary_focus_area: 'Biology',
    secondary_focus_area: 'Genetics',
    focus_area: 'Biology, Genetics',
    average_member_score: 90,
    scoring_status: 'Complete',
    interview_recommendation: { Yes: 1, No: 0, Maybe: 0 },
  },
  {
    sys_id: '2',
    applicant_name: 'Bob',
    applicant_email: 'bob@example.com',
    primary_focus_area: 'Chemistry',
    secondary_focus_area: 'Physics',
    focus_area: 'Chemistry, Physics',
    average_member_score: 85,
    scoring_status: 'Complete',
    interview_recommendation: { Yes: 0, No: 1, Maybe: 0 },
  },
];

export const mockApplicantsWithFocusAreasWithRepeat = [
  {
    sys_id: '1',
    applicant_name: 'Alice',
    applicant_email: 'alice@example.com',
    primary_focus_area: 'Biology',
    secondary_focus_area: 'Genetics',
    focus_area: 'Biology, Genetics',
    average_member_score: 90,
    scoring_status: 'Complete',
    interview_recommendation: { Yes: 1, No: 0, Maybe: 0 },
  },
  {
    sys_id: '2',
    applicant_name: 'Bob',
    applicant_email: 'bob@example.com',
    primary_focus_area: 'Chemistry',
    secondary_focus_area: 'Biology',
    focus_area: 'Chemistry, Physics',
    average_member_score: 85,
    scoring_status: 'Complete',
    interview_recommendation: { Yes: 0, No: 1, Maybe: 0 },
  },
];