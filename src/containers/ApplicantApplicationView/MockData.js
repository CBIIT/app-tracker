// Mocks the response from the APPLICANT_GET_APPLICATION API for the ApplicantApplicationView component
export const mockResponse = {
	data: {
		result: {
			basic_info: {
				vacancy: '12345',
				first_name: 'John',
				middle_name: 'A',
				last_name: 'Doe',
				email: 'john.doe@example.com',
				phone: '123-456-7890',
				business_phone: '098-765-4321',
				highest_level_of_education: 'PhD',
				us_citizen: true,
				address: '123 Main St',
				address_2: 'Apt 4',
				city: 'Anytown',
				state_province: 'CA',
				zip_code: '12345',
				country: 'USA',
			},
			focus_area: [],
			references: [
				{
					ref_sys_id: 'ref1',
					first_name: 'Jane',
					middle_name: 'B',
					last_name: 'Smith',
					email: 'jane.smith@example.com',
					contact_allowed: true,
					organization: 'Org1',
					phone: '321-654-0987',
					relationship: 'Colleague',
					title: 'Manager',
				},
			],
			app_documents: [
				{
					doc_name: 'Resume',
					file_name: 'resume.pdf',
					attachment_dl: 'http://example.com/resume.pdf',
					attach_sys_id: 'doc1',
				},
			],
		},
	},
};

export const mockStadtmanResponse = {
	data: {
		result: {
			basic_info: {
				vacancy: '12345',
				first_name: 'John',
				middle_name: 'A',
				last_name: 'Doe',
				email: 'john.doe@example.com',
				phone: '123-456-7890',
				business_phone: '098-765-4321',
				highest_level_of_education: 'PhD',
				us_citizen: true,
				address: '123 Main St',
				address_2: 'Apt 4',
				city: 'Anytown',
				state_province: 'CA',
				zip_code: '12345',
				country: 'USA',
			},
			focus_area: 'Area1,Area2',
			references: [
				{
					ref_sys_id: 'ref1',
					first_name: 'Jane',
					middle_name: 'B',
					last_name: 'Smith',
					email: 'jane.smith@example.com',
					contact_allowed: true,
					organization: 'Org1',
					phone: '321-654-0987',
					relationship: 'Colleague',
					title: 'Manager',
				},
			],
			app_documents: [
				{
					doc_name: 'Resume',
					file_name: 'resume.pdf',
					attachment_dl: 'http://example.com/resume.pdf',
					attach_sys_id: 'doc1',
				},
			],
		},
	},
};

export const mockStadtmanApplication = {
	sysId: '12345',
	basicInfo: {
		firstName: 'John',
		middleName: 'A',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		phone: '123-456-7890',
		businessPhone: '098-765-4321',
		highestLevelEducation: 'PhD',
		isUsCitizen: true,
	},
	focusArea: ['Area1', 'Area2'],
	address: {
		address: '123 Main St',
		address2: 'Apt 4',
		city: 'Anytown',
		stateProvince: 'CA',
		postalCode: '12345',
		country: 'USA',
	},
	references: [
		{
			refSysId: 'ref1',
			firstName: 'Jane',
			middleName: 'B',
			lastName: 'Smith',
			email: 'jane.smith@example.com',
			contactAllowed: true,
			organization: 'Org1',
			phone: '321-654-0987',
			relationship: 'Colleague',
			positionTitle: 'Manager',
		},
	],
	referenceEmail: true,
	applicantDocuments: [
		{
			documentName: 'Resume',
			fileName: 'resume.pdf',
			downloadLink: 'http://example.com/resume.pdf',
			attachSysId: 'doc1',
		},
	],
};

export const mockApplication = {
	sysId: '12345',
	basicInfo: {
		firstName: 'John',
		middleName: 'A',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		phone: '123-456-7890',
		businessPhone: '098-765-4321',
		highestLevelEducation: 'PhD',
		isUsCitizen: true,
	},
	focusArea: [],
	address: {
		address: '123 Main St',
		address2: 'Apt 4',
		city: 'Anytown',
		stateProvince: 'CA',
		postalCode: '12345',
		country: 'USA',
	},
	references: [
		{
			refSysId: 'ref1',
			firstName: 'Jane',
			middleName: 'B',
			lastName: 'Smith',
			email: 'jane.smith@example.com',
			contactAllowed: true,
			organization: 'Org1',
			phone: '321-654-0987',
			relationship: 'Colleague',
			positionTitle: 'Manager',
		},
	],
	applicantDocuments: [
		{
			documentName: 'Resume',
			fileName: 'resume.pdf',
			downloadLink: 'http://example.com/resume.pdf',
			attachSysId: 'doc1',
		},
	],
};

export const mockProps = {
	computedMatch: {
		isExact: true,
		params: {
			appSysId: '123'
		},
		path: '/apply/view/:appSysId',
		url: '/apply/view/123',
	},
	history: {
		action: 'PUSH',
		length: 1,
	},
	location: {
		hash: '',
		pathname: '/apply/view/123',
		search: '',
		state: undefined,
	},
	match: {
		isExact: true,
		params: {
			appSysId: '123',
		},
		path: '/apply/view/:appSysId',
		url: '/apply/view/123',
	},
	path: '/apply/view/:appSysId',
	staticContext: undefined,
}
