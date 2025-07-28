export const mockRCVacancy = {
	basicInfo: {
		allowHrSpecialistTriage: false,
		applicationDocuments: [
			{
				document: 'doc1',
				isDocumentOptional: false,
			},
		],
		appointmentPackageIndicator: '789',
		closeDate: '',
		description: '<p>adlna;slv;sad</p>',
		numberOfCategories: '4',
		numberOfRecommendations: '1',
		openDate: '02/07/2025',
		positionClassification: 'Research Fellow',
		referenceCollection: true,
		referenceCollectionDate: '02/28/2025',
		requireFocusArea: false,
		sacCode: 'HNC',
		scoringDueByDate: '',
		tenant: 'NCI',
		title: 'asdlfklasd',
		useCloseDate: false,
		vacancyPoc: '789',
	},
	emailTemplates: [
		{
			active: true,
			type: 'Application Saved',
		},
		{
			active: true,
			type: 'Application submitted confirmation',
		},
	],
	mandatoryStatements: {
		equalOpportunityEmployer: true,
		foreignEducation: true,
		reasonableAccommodation: true,
		standardOfconduct: true,
	},
	ratingPlan: {
		downloadLink: null,
		fileName: null,
		sysId: null,
	},
	state: 'rolling_close',
	status: 'open',
	sysId: '12345',
	vacancyCommittee: [
		{
			key: '789',
			role: 'Executive Secretary (non-voting)',
			user: {
				name: {
					value: 'John Doe',
				},
			},
		},
		{
			key: '456',
			role: 'Chair',
			user: {
				name: {
					value: 'Jane Doe',
				},
			},
		},
	],
};

export const mockNRCVacancy = {
	basicInfo: {
		allowHrSpecialistTriage: false,
		applicationDocuments: [
			{
				document: 'doc1',
				isDocumentOptional: false,
			},
		],
		appointmentPackageIndicator: '789',
		closeDate: '11/15/2024',
		description: '<p>adlna;slv;sad</p>',
		numberOfCategories: '4',
		numberOfRecommendations: '1',
		openDate: '02/07/2025',
		positionClassification: 'Research Fellow',
		referenceCollection: true,
		referenceCollectionDate: '02/28/2025',
		requireFocusArea: false,
		sacCode: 'HNC',
		scoringDueByDate: '',
		tenant: 'NCI',
		title: 'asdlfklasd',
		useCloseDate: true,
		vacancyPoc: '789',
	},
	emailTemplates: [
		{
			active: true,
			type: 'Application Saved',
		},
		{
			active: true,
			type: 'Application submitted confirmation',
		},
	],
	mandatoryStatements: {
		equalOpportunityEmployer: true,
		foreignEducation: true,
		reasonableAccommodation: true,
		standardOfconduct: true,
	},
	ratingPlan: {
		downloadLink: null,
		fileName: null,
		sysId: null,
	},
	state: 'voting_complete',
	status: 'closed',
	sysId: '12345',
	vacancyCommittee: [
		{
			key: '789',
			role: 'Executive Secretary (non-voting)',
			user: {
				name: {
					value: 'John Doe',
				},
			},
		},
		{
			key: '456',
			role: 'Chair',
			user: {
				name: {
					value: 'Jane Doe',
				},
			},
		},
	],
};

export const mockUser = {
	firstName: 'John',
	hasApplications: undefined,
	hasProfile: undefined,
	isChair: undefined,
	isExecSec: true,
	isReadOnlyUser: undefined,
	lastInitial: 'D',
	roles: [
		'x_g_nci_app_tracke.vacancy_manager',
		'x_g_nci_app_tracke.committee_member',
		'x_g_nci_app_tracke.user',
		'snc_internal',
	],
	tenant: 'OWM',
	uid: '789',
};

export const mockGetRollingApplicantList = {
	data: {
		result: {
			response: {
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
				references_sent: '1',
				refferred_to_interview: null,
				referred_to_selecting_official: null,
				scores: [],
				scoring_status: 'Scoring Complete',
				selected: null,
				state: 'triage',
				sys_id: '12345',
				total: 0,
				total_received_references: '2 out of 3',
				triage_comments: '',
				triage_status: 'pending',
				yes: 0,
			},
		},
	},
};

export const mockGetApplicantList = {
	data: {
		result: {
			response: {
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
				references_sent: '1',
				refferred_to_interview: null,
				referred_to_selecting_official: null,
				scores: [],
				scoring_status: 'Scoring Complete',
				selected: 'yes',
				submitted: '11/14/2024 15:52:08',
				sys_id: '12345',
				total: 0,
				total_received_references: '1 out of 3',
				triage_comments: '',
				triage_status: 'maybe',
				yes: 0,
			}
		}
	}
};
