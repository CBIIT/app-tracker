export const mockAuth = {
	result: {
		banner_description: '',
		banner_message: '',
		itrust_idp: '',
		itrust_url: '',
		logged_in: false,
		okta_idp: '',
		okta_login_and_redirect_url: '',
		omb_exp: 'Expiration Date: 12/31/3000',
		omb_no: '5029-1067-1205',
		session_timeout: '',
		tenants: [],
		user: {
			roles: [],
		},
	},
};
export const mockVacancyList = {
	data: {
		result: [
			{
				close_date: '',
				open_date: '2026-01-01',
				state: 'rolling_close',
				sys_id: '00nci',
				tenant: 'NCI',
				title: 'Mock NCI Vacancy',
				use_close_date: '0',
			},
			{
				close_date: '2026-03-15',
				open_date: '2025-11-15',
				state: 'live',
				sys_id: '00sta',
				tenant: 'Stadtman',
				title: 'Mock Stadtman Vacancy',
				use_close_date: '1',
			},
		],
	},
};

export const noVacancyList = {
	data: {
		result: [],
	},
};

export const mockVacancyListForSorting = {
	data: {
		result: [
			{
				close_date: '2026-03-15',
				open_date: '2025-11-15',
				state: 'live',
				sys_id: '001',
				tenant: 'NCI', // 3 chars
				title: 'Short Title', // 11 chars
				use_close_date: '1',
			},
			{
				close_date: '2026-05-20',
				open_date: '2025-12-01',
				state: 'live',
				sys_id: '002',
				tenant: 'Stadtman', // 8 chars
				title: 'Very Long Vacancy Title Here', // 30 chars
				use_close_date: '1',
			},
			{
				close_date: '',
				open_date: '2026-01-01',
				state: 'rolling_close',
				sys_id: '003',
				tenant: 'NIAID', // 5 chars
				title: 'Medium Length Title', // 19 chars
				use_close_date: '0',
			},
		],
	},
};
