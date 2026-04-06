import {
	mockApplicationAttachmentCheckResponse,
	mockApplicationUpdateResponse,
	mockAttachmentCheckFailResponse,
	mockAttachmentCheckResponse,
	mockAttachmentDeleteResponse,
	mockClosedVacancyResponse,
	mockDocumentToDelete,
	mockFile,
	mockFileAttachResponse,
	mockFormData,
	mockInfoToSend,
	mockInfoToSendEdit,
	mockOptions,
	mockSaveAppDraftFailResponse,
	mockSaveAppDraftResponse,
	mockSaveDraftDocFailResponse,
	mockSaveDraftDocResponse,
	mockSubmitAppFailResponse,
	mockSubmitAppResponse,
	mockUseAuth,
} from './SubmitModalMockData';

describe('SubmitModalMockData', () => {
	test('exports auth and form data mocks with expected shape', () => {
		expect(mockUseAuth).toEqual({
			auth: {
				isUserLoggedIn: true,
				user: { uid: '123' },
				oktaLoginAndRedirectUrl: 'http://example.com/login',
			},
		});

		expect(mockFormData).toMatchObject({
			sysId: '123',
			basicInfo: {
				firstName: 'John',
				highestLevelEducation: 'PhD',
			},
			address: {
				city: 'Anytown',
				country: 'USA',
			},
			questions: {
				share: '0',
			},
		});
		expect(mockFormData.references).toHaveLength(1);
		expect(mockFormData.applicantDocuments).toEqual(['doc1', 'doc2']);
	});

	test('exports draft and document response mocks', () => {
		expect(mockSaveAppDraftResponse.data.result.response).toEqual({
			status: 200,
			message: 'Successfully updated draft_id:123',
			draft_id: '123',
		});
		expect(mockSaveAppDraftFailResponse.data.result.response.status).toBe(500);
		expect(
			mockSaveDraftDocResponse.data.result.response.response
		).toMatchObject({
			file_name: 'doc1.docx',
			table_sys_id: '456',
			table_name: 'application_documents',
		});
		expect(mockSaveDraftDocFailResponse.data.result.response.message).toBe(
			'Draft documents save was unsuccessful. Please try again.'
		);
		expect(mockOptions).toEqual([
			{
				uid: 'rc-upload-1737555580020-15',
				file_name: 'doc1.docx',
				table_name: 'application_documents',
				table_sys_id: '456',
			},
		]);
		expect(mockFile.file.originFileObj).toMatchObject({
			name: 'doc1.docx',
			type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		});
	});

	test('exports attachment and submission response mocks', () => {
		expect(mockFileAttachResponse.data.result.response.status).toBe(200);
		expect(mockAttachmentCheckResponse.data.result.response).toMatchObject({
			exists: true,
			filename: 'Curriculum Vitae (CV).docx',
			message: 'Attachment available',
			status: 200,
		});
		expect(mockAttachmentCheckFailResponse.data.result.response.status).toBe(
			500
		);
		expect(mockSubmitAppResponse.data.result.response).toMatchObject({
			status: 200,
			app_sys_id: '123',
		});
		expect(mockSubmitAppFailResponse.data.result.response.message).toBe(
			'Application submission was unsuccessful. Please try again.'
		);
		expect(mockClosedVacancyResponse.data.result.response).toMatchObject({
			status: 404,
			message:
				'Sorry! Your application cannot be submitted because this vacancy has been closed or is past the close date.',
		});
		expect(mockDocumentToDelete.uploadedDocument).toMatchObject({
			attachSysId: '123',
			markedToDelete: true,
		});
		expect(mockAttachmentDeleteResponse.data.result.response.status).toBe(200);
		expect(
			mockApplicationAttachmentCheckResponse.data.result.response
		).toMatchObject({
			exists: true,
			status: 200,
		});
		expect(mockApplicationUpdateResponse.data.result.response).toEqual({
			status: 200,
			message: 'Application updated successfully.',
		});
	});

	test('exports transformed application payload mocks', () => {
		expect(mockInfoToSend).toMatchObject({
			sysId: '123',
			focusArea: ['Area1', 'Area2'],
			vacancy_documents: ['doc1', 'doc2'],
			questions: {
				share: true,
				sex: 'Male',
			},
		});
		expect(mockInfoToSend.references[0]).toMatchObject({
			ref_sys_id: 'ref1',
			email: 'jane.smith@example.com',
		});

		expect(mockInfoToSendEdit).toMatchObject({
			sysId: '123',
			focusArea: ['Area1', 'Area2'],
			questions: {
				share: true,
			},
		});
		expect(mockInfoToSendEdit.vacancy_documents).toHaveLength(1);
		expect(mockInfoToSendEdit.vacancy_documents[0]).toMatchObject({
			documentName: 'doc11',
			uploadedDocument: {
				attachSysId: '123',
				markedToDelete: false,
			},
		});
		expect(mockInfoToSendEdit.vacancy_documents[0].file.file).toMatchObject({
			name: 'doc11',
			type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		});
	});
});
