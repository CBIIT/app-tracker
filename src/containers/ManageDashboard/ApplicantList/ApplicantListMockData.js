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
	state: 'triage',
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
			},
		},
	},
};

// Mock applicants for pagination, search, and filter tests
export const mockApplicants = [
	{
		sys_id: '1',
		applicant_name: 'Alice Smith',
		applicant_email: 'alice.smith@email.com',
		state: 'triage',
		primary_focus_area: 'Cancer Biology',
		secondary_focus_area: 'Genomics',
		scoring_status: 'Scoring Complete',
		interview_recommendation: { Yes: 1, No: 0, Maybe: 0 },
		total_received_references: '2 out of 3',
	},
	{
		sys_id: '2',
		applicant_name: 'Bob Johnson',
		applicant_email: 'bob.johnson@email.com',
		state: 'scoring',
		primary_focus_area: 'Immunology',
		secondary_focus_area: 'Cancer Biology',
		scoring_status: 'Pending',
		interview_recommendation: { Yes: 0, No: 1, Maybe: 0 },
		total_received_references: '1 out of 3',
	},
	{
		sys_id: '3',
		applicant_name: 'Carol Lee',
		applicant_email: 'carol.lee@email.com',
		state: 'in_review',
		primary_focus_area: 'Genomics',
		secondary_focus_area: 'Bioinformatics',
		scoring_status: 'Scoring Complete',
		interview_recommendation: { Yes: 0, No: 0, Maybe: 1 },
		total_received_references: '3 out of 3',
	},
	{
		sys_id: '4',
		applicant_name: 'Dave Kim',
		applicant_email: 'dave.kim@email.com',
		state: 'review_complete',
		primary_focus_area: 'Bioinformatics',
		secondary_focus_area: 'Immunology',
		scoring_status: 'Pending',
		interview_recommendation: { Yes: 1, No: 0, Maybe: 0 },
		total_received_references: '0 out of 3',
	},
	{
		sys_id: '5',
		applicant_name: 'Eve Miller',
		applicant_email: 'eve.miller@email.com',
		state: 'completed',
		primary_focus_area: 'Cancer Biology',
		secondary_focus_area: 'Immunology',
		scoring_status: 'Scoring Complete',
		interview_recommendation: { Yes: 0, No: 1, Maybe: 0 },
		total_received_references: '2 out of 3',
	},
	{
		sys_id: '6',
		applicant_name: 'Frank Moore',
		applicant_email: 'frank.moore@email.com',
		state: 'triage',
		primary_focus_area: 'Genomics',
		secondary_focus_area: 'Cancer Biology',
		scoring_status: 'Pending',
		interview_recommendation: { Yes: 0, No: 0, Maybe: 1 },
		total_received_references: '1 out of 3',
	},
	{
		sys_id: '7',
		applicant_name: 'Grace Park',
		applicant_email: 'grace.park@email.com',
		state: 'scoring',
		primary_focus_area: 'Immunology',
		secondary_focus_area: 'Bioinformatics',
		scoring_status: 'Scoring Complete',
		interview_recommendation: { Yes: 1, No: 0, Maybe: 0 },
		total_received_references: '3 out of 3',
	},
	{
		sys_id: '8',
		applicant_name: 'Henry Young',
		applicant_email: 'henry.young@email.com',
		state: 'in_review',
		primary_focus_area: 'Cancer Biology',
		secondary_focus_area: 'Immunology',
		scoring_status: 'Pending',
		interview_recommendation: { Yes: 0, No: 1, Maybe: 0 },
		total_received_references: '2 out of 3',
	},
	{
		sys_id: '9',
		applicant_name: 'Ivy Chen',
		applicant_email: 'ivy.chen@email.com',
		state: 'review_complete',
		primary_focus_area: 'Bioinformatics',
		secondary_focus_area: 'Genomics',
		scoring_status: 'Scoring Complete',
		interview_recommendation: { Yes: 0, No: 0, Maybe: 1 },
		total_received_references: '0 out of 3',
	},
	{
		sys_id: '10',
		applicant_name: 'Jack Lee',
		applicant_email: 'jack.lee@email.com',
		state: 'completed',
		primary_focus_area: 'Immunology',
		secondary_focus_area: 'Cancer Biology',
		scoring_status: 'Pending',
		interview_recommendation: { Yes: 1, No: 0, Maybe: 0 },
		total_received_references: '1 out of 3',
	},
	{
		sys_id: '11',
		applicant_name: 'Kathy Wu',
		applicant_email: 'kathy.wu@email.com',
		state: 'triage',
		primary_focus_area: 'Genomics',
		secondary_focus_area: 'Bioinformatics',
		scoring_status: 'Scoring Complete',
		interview_recommendation: { Yes: 0, No: 1, Maybe: 0 },
		total_received_references: '2 out of 3',
	},
	{
		sys_id: '12',
		applicant_name: 'Leo Patel',
		applicant_email: 'leo.patel@email.com',
		state: 'scoring',
		primary_focus_area: 'Cancer Biology',
		secondary_focus_area: 'Immunology',
		scoring_status: 'Pending',
		interview_recommendation: { Yes: 0, No: 0, Maybe: 1 },
		total_received_references: '3 out of 3',
	},
	{
		sys_id: '13',
		applicant_name: 'Mona Singh',
		applicant_email: 'mona.singh@email.com',
		state: 'in_review',
		primary_focus_area: 'Bioinformatics',
		secondary_focus_area: 'Genomics',
		scoring_status: 'Scoring Complete',
		interview_recommendation: { Yes: 1, No: 0, Maybe: 0 },
		total_received_references: '0 out of 3',
	},
	{
		sys_id: '14',
		applicant_name: 'Nina Brown',
		applicant_email: 'nina.brown@email.com',
		state: 'review_complete',
		primary_focus_area: 'Immunology',
		secondary_focus_area: 'Cancer Biology',
		scoring_status: 'Pending',
		interview_recommendation: { Yes: 0, No: 1, Maybe: 0 },
		total_received_references: '1 out of 3',
	},
	{
		sys_id: '15',
		applicant_name: 'Oscar Diaz',
		applicant_email: 'oscar.diaz@email.com',
		state: 'completed',
		primary_focus_area: 'Genomics',
		secondary_focus_area: 'Bioinformatics',
		scoring_status: 'Scoring Complete',
		interview_recommendation: { Yes: 0, No: 0, Maybe: 1 },
		total_received_references: '2 out of 3',
	},
];

export const mockApplicantFocusArea = {
	data: {
		result: ['Cancer Biology', 'Immunology', 'Bioinformatics', 'Genomics'],
	},
};

// Mock SearchContext value for tests
export const mockSearchContextValue = {
	searchText: '',
	setSearchText: jest.fn(),
	searchedColumn: '',
	setSearchedColumn: jest.fn(),
	searchInput: { current: null },
	tenants: ['NCI'],
};

export const mockStadtmanAuth = {
	auth: {
		isUserLoggedIn: true,
		user: {
			isManager: true,
			roles: [],
			hasApplications: false,
			uid: '123',
		},
		tenants: [
			{
				value: 'f24965fc1b9c11106daea681f54bcb04',
				label: 'tenant 1',
				roles: [
					'x_g_nci_app_tracke.vacancy_manager',
					'x_g_nci_app_tracke.committee_member',
				],
				is_exec_sec: true,
				is_read_only_user: true,
				is_chair: true,
				is_hr: false,
				properties: [
					{
						name: 'enableFocusArea',
						value: 'true',
					},
					{
						name: 'enableTop25Percent',
						value: 'true',
					},
				],
			},
		],
	},
	currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
};

export const mockNonStadtmanAuth = {
	auth: {
		isUserLoggedIn: true,
		user: {
			isManager: true,
			roles: [],
			hasApplications: false,
			uid: '123',
		},
		tenants: [
			{
				value: 'f24965fc1b9c11106daea681f54bcb04',
				label: 'tenant 1',
				roles: [
					'x_g_nci_app_tracke.vacancy_manager',
				],
				is_exec_sec: true,
				is_read_only_user: false,
				is_chair: false,
				is_hr: false,
				properties: [],
			},
		],
	},
	currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
};
