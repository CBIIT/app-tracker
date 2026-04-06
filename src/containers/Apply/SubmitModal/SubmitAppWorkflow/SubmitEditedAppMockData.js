export const mockSubmitEditedAppData = { some: 'form-data' };

export const mockSubmittedAppSysId = 'app-123';

export const createMockTransformedData = (overrides = {}) => ({
	vacancy_documents: [
		{
			uploadedDocument: {
				markedToDelete: true,
				attachSysId: 'attach-delete-1',
			},
			table_name: 'x_table',
			table_sys_id: 'table-1',
		},
		{
			file: {
				file: {
					name: 'resume.pdf',
					type: 'application/pdf',
				},
			},
			table_name: 'x_table',
			table_sys_id: 'table-2',
		},
		{
			file: {
				fileList: [
					{
						name: 'cover-letter.docx',
						type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					},
				],
			},
			table_name: 'x_table',
			table_sys_id: 'table-3',
		},
		{
			file: {
				fileList: [],
			},
			table_name: 'x_table',
			table_sys_id: 'table-4',
		},
	],
	...overrides,
});

export const mockSuccessfulAttachmentCheckResponse = {
	data: {
		result: {
			messages: [
				{ is_optional: 'false', exists: true },
				{ is_optional: 'true', exists: false },
			],
		},
	},
};

export const mockEmptyAttachmentCheckResponse = {
	data: {
		result: {},
	},
};

export const mockMissingRequiredAttachmentResponse = {
	data: {
		result: {
			messages: [{ is_optional: 'false', exists: false }],
		},
	},
};

export const mockNoMissingAttachmentResponse = {
	data: {
		result: {
			messages: [],
		},
	},
};

export const mockSuccessfulApplicationSubmissionResponse = {
	data: {
		result: {
			status: 200,
		},
	},
};

export const mockUnsuccessfulApplicationSubmissionResponse = {
	data: {
		result: {
			status: 500,
		},
	},
};
