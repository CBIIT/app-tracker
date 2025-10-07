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
				roles: ['x_g_nci_app_tracke.vacancy_manager'],
				is_exec_sec: true,
				is_read_only_user: false,
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
					{
						name: 'enableEmailbutton',
						value: 'true',
					},
				],
			},
		],
	},
	currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
};

export const mockStadtmanVacancy = {
	data: {
		result: {
			basic_info: {
				sys_id: { value: '123' },
				state: {
					label: 'Individual Scoring in Progress',
					value: 'Individual Scoring in Progress',
				},
				status: { label: 'Closed', value: 'closed' },
				open_date: { label: '2023-01-01' },
				bulk_email_sent: { value: '1' },
				use_close_date: { value: '1' },
				reference_collection: { value: '1' },
				reference_collection_date: { label: '2023-02-01' },
				close_date: { label: '2023-03-01' },
				scoring_due_by_date: { label: '2023-04-01' },
				vacancy_title: { value: 'Developer' },
				tenant: { label: 'Tenant A' },
				allow_hr_specialist_triage: { value: '1' },
				require_focus_area: { value: '1' },
				vacancy_description: { value: 'Job description' },
				vacancy_poc: { value: 'POC' },
				package_initiator: { value: 'Initiator' },
				title_42_position_classification: { value: 'Classification' },
				organization_code: { value: 'Code' },
				number_of_recommendation: { value: '5' },
				number_of_categories: { value: '3' },
				show_eoes: { value: '1' },
				show_socs: { value: '1' },
				show_fes: { value: '1' },
				show_ras: { value: '1' },
				next_step: { label: 'committee_scoring', value: 'committee_scoring' },
			},
			vacancy_documents: [
				{ title: { value: 'Doc1' }, is_optional: { value: '1' } },
				{ title: { value: 'Doc2' }, is_optional: { value: '0' } },
			],
			vacancy_emails: [
				{ active: { value: '1' }, email_type: { value: 'Type1' } },
				{ active: { value: '0' }, email_type: { value: 'Type2' } },
			],
			committee: [
				{
					role: { value: 'Role1' },
					user: { label: 'User1' },
					sys_id: { value: '1' },
				},
				{
					role: { value: 'Role2' },
					user: { label: 'User2' },
					sys_id: { value: '2' },
				},
			],
			user: {
				committee_role_of_current_vacancy: 'Executive Secretary',
				roles: ['x_g_nci_app_tracke.vacancy_manager'],
			},
			rating_plan: {
				sys_id: 'RP123',
				attachment_dl: 'link',
				file_name: 'file.pdf',
			},
		},
	},
};

export const mockStadtmanVacancyTransformed = {
	sysId: '123',
	state: 'Individual Scoring in Progress',
	status: 'closed',
	basicInfo: {
		bulkEmail: true,
		openDate: '2023-01-01',
		useCloseDate: true,
		referenceCollection: true,
		referenceCollectionDate: '2023-02-01',
		closeDate: '2023-03-01',
		scoringDueByDate: '2023-04-01',
		title: 'Developer',
		tenant: 'Tenant A',
		allowHrSpecialistTriage: true,
		requireFocusArea: true,
		description: 'Job description',
		vacancyPoc: 'POC',
		appointmentPackageIndicator: 'Initiator',
		positionClassification: 'Classification',
		sacCode: 'Code',
		applicationDocuments: [
			{ document: 'Doc1', isDocumentOptional: true },
			{ document: 'Doc2', isDocumentOptional: false },
		],
		numberOfRecommendations: '5',
		numberOfCategories: '3',
	},
	emailTemplates: [
		{ active: true, type: 'Type1' },
		{ active: false, type: 'Type2' },
	],
	vacancyCommittee: [
		{ role: 'Role1', user: { name: { value: 'User1' } }, key: '1' },
		{ role: 'Role2', user: { name: { value: 'User2' } }, key: '2' },
	],
	mandatoryStatements: {
		equalOpportunityEmployer: true,
		standardsOfConduct: true,
		foreignEducation: true,
		reasonableAccomodation: true,
	},
	ratingPlan: {
		sysId: 'RP123',
		downloadLink: 'link',
		fileName: 'file.pdf',
	},
};
