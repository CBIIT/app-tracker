import { createContext } from 'react';
const defaultFormData = {
	basicInfo: {
		phonePrefix: '+1',
		businessPhonePrefix: '+1',
	},
	address: {},
	references: [],
	applicantDocuments: [],
	questions: {},
};

// Only for debugging purposes.
// const defaultFormData = {
// 	basicInfo: {
// 		phonePrefix: '+1',
// 		businessPhonePrefix: '+1',
// 		firstName: 'FirstName',
// 		middleName: 'MiddleName',
// 		lastName: 'LastName',
// 		email: 'email@email.com',
// 		phone: '1111111111',
// 		businessPhone: '1111111111',
// 		hasDegree: 'Yes',
// 	},
// 	address: {
// 		address: 'Address1',
// 		address2: 'Address2',
// 		city: 'ThisCity',
// 		stateProvince: 'ThisState',
// 		country: 'USA',
// 		zip: '22222',
// 	},
// 	references: [
// 		{
// 			email: 'r@r.com',
// 			firstName: 'r',
// 			middleName: 'r',
// 			lastName: 'r',
// 			phoneNumber: '1111111111',
// 		},
// 		{
// 			firstName: 'r',
// 			middleName: 'r',
// 			lastName: 'r',
// 			email: 'r@r.com',
// 			phoneNumber: '2222222222',
// 		},
// 		{
// 			firstName: 'r',
// 			middleName: 'r',
// 			lastName: 'r',
// 			email: 'r@r.com',
// 			phoneNumber: '3333333333',
// 		},
// 	],
// 	applicantDocuments: [
// 		{
// 			sys_id: {
// 				label: '0481948f1b436010e541631ee54bcb76',
// 				value: '0481948f1b436010e541631ee54bcb76',
// 			},
// 			sys_updated_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			vacancy_id: {
// 				label:
// 					'Senior Investigator/Laboratory Chief (Laboratory of Cancer Immunometabolism)',
// 				value: '8081948f1b436010e541631ee54bcb74',
// 			},
// 			sys_created_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			sys_mod_count: {
// 				label: '0',
// 				value: '0',
// 			},
// 			sys_updated_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			title: {
// 				label: 'Vision Statement',
// 				value: 'Vision Statement',
// 			},
// 			sys_tags: {
// 				label: '',
// 				value: '',
// 			},
// 			sys_created_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			is_optional: {
// 				label: 'false',
// 				value: '0',
// 			},
// 			file: {
// 				file: {
// 					uid: 'rc-upload-1617199271443-43',
// 				},
// 				fileList: [
// 					{
// 						uid: 'rc-upload-1617199271443-43',
// 						lastModified: 1617199472802,
// 						lastModifiedDate: '2021-03-31T14:04:32.802Z',
// 						name: 'Some Document 1.docx',
// 						size: 11816,
// 						type:
// 							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// 						percent: 0,
// 						originFileObj: {
// 							uid: 'rc-upload-1617199271443-43',
// 						},
// 					},
// 				],
// 			},
// 		},
// 		{
// 			sys_id: {
// 				label: '0881948f1b436010e541631ee54bcb76',
// 				value: '0881948f1b436010e541631ee54bcb76',
// 			},
// 			sys_updated_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			vacancy_id: {
// 				label:
// 					'Senior Investigator/Laboratory Chief (Laboratory of Cancer Immunometabolism)',
// 				value: '8081948f1b436010e541631ee54bcb74',
// 			},
// 			sys_created_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			sys_mod_count: {
// 				label: '0',
// 				value: '0',
// 			},
// 			sys_updated_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			title: {
// 				label: 'Misc.',
// 				value: 'Misc.',
// 			},
// 			sys_tags: {
// 				label: '',
// 				value: '',
// 			},
// 			sys_created_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			is_optional: {
// 				label: 'false',
// 				value: '0',
// 			},
// 			file: {
// 				file: {
// 					uid: 'rc-upload-1617199271443-45',
// 				},
// 				fileList: [
// 					{
// 						uid: 'rc-upload-1617199271443-45',
// 						lastModified: 1617199446014,
// 						lastModifiedDate: '2021-03-31T14:04:06.014Z',
// 						name: 'Some document 2.docx',
// 						size: 11769,
// 						type:
// 							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// 						percent: 0,
// 						originFileObj: {
// 							uid: 'rc-upload-1617199271443-45',
// 						},
// 					},
// 				],
// 			},
// 		},
// 		{
// 			sys_id: {
// 				label: '8081948f1b436010e541631ee54bcb76',
// 				value: '8081948f1b436010e541631ee54bcb76',
// 			},
// 			sys_updated_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			vacancy_id: {
// 				label:
// 					'Senior Investigator/Laboratory Chief (Laboratory of Cancer Immunometabolism)',
// 				value: '8081948f1b436010e541631ee54bcb74',
// 			},
// 			sys_created_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			sys_mod_count: {
// 				label: '0',
// 				value: '0',
// 			},
// 			sys_updated_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			title: {
// 				label: 'Cover Letter',
// 				value: 'Cover Letter',
// 			},
// 			sys_tags: {
// 				label: '',
// 				value: '',
// 			},
// 			sys_created_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			is_optional: {
// 				label: 'true',
// 				value: '1',
// 			},
// 			file: {
// 				fileList: [],
// 			},
// 		},
// 		{
// 			sys_id: {
// 				label: '8481948f1b436010e541631ee54bcb76',
// 				value: '8481948f1b436010e541631ee54bcb76',
// 			},
// 			sys_updated_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			vacancy_id: {
// 				label:
// 					'Senior Investigator/Laboratory Chief (Laboratory of Cancer Immunometabolism)',
// 				value: '8081948f1b436010e541631ee54bcb74',
// 			},
// 			sys_created_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			sys_mod_count: {
// 				label: '0',
// 				value: '0',
// 			},
// 			sys_updated_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			title: {
// 				label: 'Qualification Statement',
// 				value: 'Qualification Statement',
// 			},
// 			sys_tags: {
// 				label: '',
// 				value: '',
// 			},
// 			sys_created_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			is_optional: {
// 				label: 'true',
// 				value: '1',
// 			},
// 			file: {
// 				fileList: [],
// 			},
// 		},
// 		{
// 			sys_id: {
// 				label: '8881948f1b436010e541631ee54bcb75',
// 				value: '8881948f1b436010e541631ee54bcb75',
// 			},
// 			sys_updated_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			vacancy_id: {
// 				label:
// 					'Senior Investigator/Laboratory Chief (Laboratory of Cancer Immunometabolism)',
// 				value: '8081948f1b436010e541631ee54bcb74',
// 			},
// 			sys_created_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			sys_mod_count: {
// 				label: '0',
// 				value: '0',
// 			},
// 			sys_updated_on: {
// 				label: '03/26/2021 11:27:21',
// 				value: '2021-03-26 15:27:21',
// 			},
// 			title: {
// 				label: 'Curriculum Vitae (CV)',
// 				value: 'Curriculum Vitae (CV)',
// 			},
// 			sys_tags: {
// 				label: '',
// 				value: '',
// 			},
// 			sys_created_by: {
// 				label: 'apptracker.service',
// 				value: 'apptracker.service',
// 			},
// 			is_optional: {
// 				label: 'false',
// 				value: '0',
// 			},
// 			file: {
// 				file: {
// 					uid: 'rc-upload-1617199271443-47',
// 				},
// 				fileList: [
// 					{
// 						uid: 'rc-upload-1617199271443-47',
// 						lastModified: 1617199462855,
// 						lastModifiedDate: '2021-03-31T14:04:22.855Z',
// 						name: 'Some Document 3.docx',
// 						size: 11806,
// 						type:
// 							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
// 						percent: 0,
// 						originFileObj: {
// 							uid: 'rc-upload-1617199271443-47',
// 						},
// 					},
// 				],
// 			},
// 		},
// 	],
// 	questions: {},
// };

const FormContext = createContext({
	currentFormInstance: null,
	setCurrentFormInstance: () => {},
});

export { defaultFormData };

export default FormContext;
