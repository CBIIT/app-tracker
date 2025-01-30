//Mocks useAuth data
export const mockUseAuth = {
	auth: {
		isUserLoggedIn: true,
		user: { uid: '123' },
		oktaLoginAndRedirectUrl: 'http://example.com/login',
	},
};

// Mocks a successful response from the SAVE_APP_DRAFT endpoint
export const mockSaveAppDraftResponse = {
	data: {
		result: {
			response: {
				status: 200,
				message: 'Sucessfully updated draft_id:' + '123',
				draft_id: '123',
			},
		},
	},
};

// Mocks a failed response from the SAVE_APP_DRAFT endpoint
export const mockSaveAppDraftFailResponse = {
	data: {
		result: {
			response: {
				status: 500,
				message: 'Application draft save was unsuccessful. Please try again.',
			},
		},
	},
};

// Mocks a successful response from the CREATE_APP_DOCS endpoint
export const mockSaveDraftDocResponse = {
	data: {
		result: {
			response: {
				status: 200,
				response: {
					file_name: 'doc1.docx',
					table_sys_id: '456',
					table_name: 'application_documents',
					uid: 'rc-upload-1737555580020-15',
				},
			},
		},
	},
};

// Mocks a failed response from the CREATE_APP_DOCS endpoint
export const mockSaveDraftDocFailResponse = {
	data: {
		result: {
			response: {
				status: 500,
				message: 'Draft documents save was unsuccessful. Please try again.',
			},
		},
	},
};

// This mock will stand in as the option used to attach documents
export const mockOptions = [
	{
		uid: 'rc-upload-1737555580020-15',
		file_name: 'doc1.docx',
		table_name: 'application_documents',
		table_sys_id: '456',
	},
];

// This mock will stand in as the file that is the fileHashMap
export const mockFile = {
	file: {
		uid: 'rc-upload-1737555580020-15',
		originFileObj: {
			uid: 'rc-upload-1737555580020-15',
			name: 'doc1.docx',
			size: 14296046,
			type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			uid: 'rc-upload-1737555580020-15',
		},
	},
};

// Mocks a successful response from the SERVICE_NOW_FILE_ATTACHMENT endpoint
export const mockFileAttachResponse = {
	data: {
		result: {
			response: {
				status: 200,
			},
		},
	},
};

// Mocks a failed response from the SERVICE_NOW_FILE_ATTACHMENT endpoint

// Mocks a response from the ATTACHMENT_CHECK endpoint
export const mockAttachmentCheckResponse = {
	data: {
		result: {
			response: {
				"exists": true,
				"filename": "Cirriculum Vitae (CV).docx",
				"is_optional": false,
				"message": "Attachment available",
				status: 200,
			},
		},
	},
};

// Mocks a failed response from the ATTACHMENT_CHECK endpoint
export const mockAttachmentCheckFailResponse = {
	data: {
		result: {
			response: {
				status: 500,
				message: 'Attachment check was unsuccessful. Please try again.',
			},
		},
	},
};

// Mocks a successful response from the SUBMIT_APPLICATION endpoint
export const mockSubmitAppResponse = {
	data: {
		result: {
			response: {
				status: 200,
				message: 'Successfully submitted application',
				app_sys_id: '123',
			},
		},
	},
};

// Mocks a failed response from the SUBMIT_APPLICATION endpoint
export const mockSubmitAppFailResponse = {
	data: {
		result: {
			response: {
				status: 500,
				message: 'Application submission was unsuccessful. Please try again.',
			},
		},
	},
};

// Mocks documentToDelete
export const mockDocumentToDelete = {
	uploadedDocument: {
		attachSysId: '123',
		downloadLink: 'http://example.com/download',
		fileName: 'doc1',
		markedToDelete: true,
	},
};

// Mocks a successful response from the SERVICE_NOW_ATTACHMENT endpoint
export const mockAttachmentDeleteResponse = {
	data: {
		result: {
			response: {
				status: 200,
			},
		},
	},
};

// Mocks a failed response from the SERVICE_NOW_ATTACHMENT endpoint

// Mocks a successful response from the ATTACHMENT_CHECK_FOR_APPLICATIONS endpoint
export const mockApplicationAttachmentCheckResponse = {
	data: {
		result: {
			response: {
				"exists": true,
				"filename": "Cirriculum Vitae (CV).docx",
				"is_optional": false,
				"message": "Attachment available",
				status: 200,
			},
		},
	},
};

// Mocks a failed response from the ATTACHMENT_CHECK_FOR_APPLICATIONS endpoint

// Mocks a successful response from the APPLICATION_SUBMISSION endpoint

// Mocks a failed response from the APPLICATION_SUBMISSION endpoint

export const mockInfoToSend = {
	sysId: '123',
	basicInfo: {
		firstName: 'John',
		middleName: 'A',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		phonePrefix: '+1',
		phone: '1234567890',
		businessPhonePrefix: '+1',
		businessPhone: '0987654321',
		highestLevelEducation: 'PhD',
		isUsCitizen: true,
	},
	address: {
		address: '123 Main St',
		address2: 'Apt 4',
		city: 'Anytown',
		zip: '12345',
		stateProvince: 'CA',
		country: 'USA',
	},
	focusArea: ['Area1', 'Area2'],
	vacancy_documents: ['doc1', 'doc2'],
	references: [
		{
			ref_sys_id: 'ref1',
			firstName: 'Jane',
			middleName: 'B',
			lastName: 'Smith',
			email: 'jane.smith@example.com',
			phoneNumber: '0987654321',
			contact: true,
			organization: 'Org1',
			title: 'Manager',
			relationship: 'Colleague',
		},
	],
	questions: {
		share: true,
		sex: 'Male',
		ethnicity: 'Hispanic',
		race: ['White'],
		disability: ['None'],
	},
};

export const mockFormData = {
	basicInfo: {
		firstName: 'John',
		middleName: 'A',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		phonePrefix: '+1',
		phone: '1234567890',
		businessPhonePrefix: '+1',
		businessPhone: '0987654321',
		highestLevelEducation: 'PhD',
		isUsCitizen: true,
		address: {
			address: '123 Main St',
			address2: 'Apt 4',
			city: 'Anytown',
			zip: '12345',
			stateProvince: 'CA',
			country: 'USA',
		},
	},
	address: {
		address: '123 Main St',
		address2: 'Apt 4',
		city: 'Anytown',
		zip: '12345',
		stateProvince: 'CA',
		country: 'USA',
	},
	references: [
		{
			ref_sys_id: 'ref1',
			firstName: 'Jane',
			middleName: 'B',
			lastName: 'Smith',
			email: 'jane.smith@example.com',
			phoneNumber: '0987654321',
			contact: true,
			organization: 'Org1',
			title: 'Manager',
			relationship: 'Colleague',
		},
	],
	applicantDocuments: ['doc1', 'doc2'],
	questions: {
		share: '0',
	},
	sysId: '123',
};

export const mockInfoToSendEdit = {
	sysId: '123',
	basicInfo: {
		firstName: 'John',
		middleName: 'A',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		phonePrefix: '+1',
		phone: '1234567890',
		businessPhonePrefix: '+1',
		businessPhone: '0987654321',
		highestLevelEducation: 'PhD',
		isUsCitizen: true,
	},
	address: {
		address: '123 Main St',
		address2: 'Apt 4',
		city: 'Anytown',
		zip: '12345',
		stateProvince: 'CA',
		country: 'USA',
	},
	focusArea: ['Area1', 'Area2'],
	vacancy_documents: [
		{
			documentName: 'doc11',
			file: {
				file: {
					uid: 'rc-upload-1737555580020-15',
					name: 'doc11',
					size: 14296046,
					type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				},
			},
			fileList: [
				{
					name: 'doc11',
					originFileObj: {
						uid: 'rc-upload-1737555580020-15',
						name: 'doc11',
						size: 14296046,
						type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						uid: 'rc-upload-1737555580020-15',
					},
					size: 14296046,
					type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					uid: 'rc-upload-1737555580020-15',
				},
			],
			uploadedDocument: {
				attachSysId: '123',
				downloadLink: 'http://example.com/download',
				fileName: 'doc1',
				markedToDelete: false,
			},
		},
	],
	references: [
		{
			ref_sys_id: 'ref1',
			firstName: 'Jane',
			middleName: 'B',
			lastName: 'Smith',
			email: 'jane.smith@example.com',
			phoneNumber: '0987654321',
			contact: true,
			organization: 'Org1',
			title: 'Manager',
			relationship: 'Colleague',
		},
	],
	questions: {
		share: true,
		sex: 'Male',
		ethnicity: 'Hispanic',
		race: ['White'],
		disability: ['None'],
	},
};

// {
//     sys_id: {
//         label: '321',
//         value: '321',
//     },
//     sys_updated_by: {
//         label: '',
//         value: '',
//     },
//     vacancy_id: {
//         label: 'Jest Test Vacancy',
//         value: '789',
//     },
//     sys_created_on: {
//         label: '',
//         value: '',
//     },
//     sys_mod_count: {
//         label: '0',
//         value: '0',
//     },
//     sys_updated_on: {
//         label: '',
//         value: '',
//     },
//     title: {
//         label: 'Cover Letter',
//         value: 'Cover Letter',
//     },
//     sys_tags: {
//         label: '',
//         value: '',
//     },
//     sys_created_by: {
//         label: '',
//         value: '',
//     },
//     is_optional: {
//         label: 'true',
//         value: '1',
//     },
//     file: {
//         fileList: [],
//     },
// },
// {
//     sys_id: {
//         label: '321',
//         value: '321',
//     },
//     sys_updated_by: {
//         label: '',
//         value: '',
//     },
//     vacancy_id: {
//         label: 'Jest Test Vacancy',
//         value: '789',
//     },
//     sys_created_on: {
//         label: '',
//         value: '',
//     },
//     sys_mod_count: {
//         label: '0',
//         value: '0',
//     },
//     sys_updated_on: {
//         label: '',
//         value: '',
//     },
//     title: {
//         label: 'Qualification Statement',
//         value: 'Qualification Statement',
//     },
//     sys_tags: {
//         label: '',
//         value: '',
//     },
//     sys_created_by: {
//         label: '',
//         value: '',
//     },
//     is_optional: {
//         label: 'true',
//         value: '1',
//     },
//     file: {
//         fileList: [],
//     },
// },
// {
//     sys_id: {
//         label: '321',
//         value: '321',
//     },
//     sys_updated_by: {
//         label: '',
//         value: '',
//     },
//     vacancy_id: {
//         label: 'Jest Test Vacancy',
//         value: '789',
//     },
//     sys_created_on: {
//         label: '',
//         value: '',
//     },
//     sys_mod_count: {
//         label: '0',
//         value: '0',
//     },
//     sys_updated_on: {
//         label: '',
//         value: '',
//     },
//     title: {
//         label: 'Vision Statement',
//         value: 'Vision Statement',
//     },
//     sys_tags: {
//         label: '',
//         value: '',
//     },
//     sys_created_by: {
//         label: '',
//         value: '',
//     },
//     is_optional: {
//         label: 'true',
//         value: '1',
//     },
//     file: {
//         fileList: [],
//     },
// },

// file: {
//     file: {
//         uid: 'rc-upload-1737555580020-15',
//         name: 'Cirriculum Vitae (CV).docx',
//         size: 14296046,
//         type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     },
//     fileList: [
//         {
//             0: {
//                 name: 'Cirriculum Vitae (CV).docx',
//                 originFileObj: {
//                     uid: 'rc-upload-1737555580020-15',
//                     name: 'Cirriculum Vitae (CV).docx',
//                     size: 14296046,
//                     type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//                     uid: 'rc-upload-1737555580020-15',
//                 },
//                 size: 14296046,
//                 type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//                 uid: 'rc-upload-1737555580020-15',
//             },
//         },
//     ],
// },
