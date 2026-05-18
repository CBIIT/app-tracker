export const EXPORT_COLUMNS = {
    // Columns might need some tweaking to correctly match tenantCaps and roleCaps on each column
	triage: [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{ key: 'submitted', label: 'Submitted' },
		{ key: 'triage_status', label: 'Triage Status', roles: ['canViewTriage'] },
		{
			key: 'chair_triage_status',
			label: 'Chair Triage Status',
			roles: ['canViewTriage']
		},
		{
			key: 'total_received_references',
			label: 'Reference Status',
			roles: ['isVacancyManager']
		},
	],
	scoring: [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{
			key: 'top_25',
			label: 'Top 25',
			roles: ['isVacancyManager'],
			tenantCaps: ['enableTop25Percent']
		},
		{
			key: 'focus_area',
			label: 'Focus Area',
			tenantCaps: ['enableFocusArea']
		},
		{
			key: 'average_member_score',
			label: 'Average Score',
			tenantCapsNot: ['enableTop25Percent']
		},
		{ key: 'scoring_status', label: 'Scoring Status', stages: ['scoring'] },
		{
			key: 'interview_recommendation',
			label: 'Interview Recommendation',
			stages: ['scoring']
		},
		{
			key: 'total_received_references',
			label: 'Reference Status',
			roles: ['isVacancyManager']
		},
	],
	review: [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{
			key: 'average_member_score',
			label: 'Average Score',
			tenantCapsNot: ['enableTop25Percent']
		},
		{ key: 'referred_to_interview', label: 'Referred to Interview' },
		{ key: 'committee_comments', label: 'Committee Comments' },
		{
			key: 'total_received_references',
			label: 'Reference Status',
			roles: ['isVacancyManager']
		},
	],
	voting: [
		{ key: 'name', label: 'Name' },
		{ key: 'email', label: 'Email' },
		{
			key: 'average_member_score',
			label: 'Average Score',
			tenantCapsNot: ['enableTop25Percent']
		},
		{ key: 'referred_to_interview', label: 'Referred to Interview' },
		{
			key: 'referred_to_selecting_official',
			label: 'Referred to Selecting Official',
		},
		{ key: 'selected', label: 'Selected' },
		{ key: 'committee_comments', label: 'Committee Comments' },
		{
			key: 'total_received_references',
			label: 'Reference Status',
			roles: ['isVacancyManager']
		},
	],
};
