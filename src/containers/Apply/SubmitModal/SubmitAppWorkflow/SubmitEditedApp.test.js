import axios from 'axios';
import { message, notification } from 'antd';
import submitEditedApp from './SubmitEditedApp';
import { getMissingRequiredAttachments } from './SubmitEditedApp';
import {
	createMockTransformedData,
	mockEmptyAttachmentCheckResponse,
	mockMissingRequiredAttachmentResponse,
	mockNoMissingAttachmentResponse,
	mockSubmitEditedAppData,
	mockSubmittedAppSysId,
	mockSuccessfulApplicationSubmissionResponse,
	mockSuccessfulAttachmentCheckResponse,
	mockUnsuccessfulApplicationSubmissionResponse,
} from './SubmitEditedAppMockData';
import {
	APPLICATION_SUBMISSION,
	ATTACHMENT_CHECK_FOR_APPLICATIONS,
	DELETE_ATTACHMENT,
	SERVICE_NOW_FILE_ATTACHMENT,
} from '../../../../constants/ApiEndpoints';
import { transformJsonToBackend } from '../../Util/TransformJsonToBackend';

jest.mock('axios');
jest.mock('antd', () => ({
	message: {
		error: jest.fn(),
	},
	notification: {
		error: jest.fn(),
	},
}));
jest.mock('../../Util/TransformJsonToBackend', () => ({
	transformJsonToBackend: jest.fn(),
}));

const createCallbacks = () => ({
	setConfirmLoading: jest.fn(),
	setSubmitted: jest.fn(),
	setPercent: jest.fn(),
	setAppSysId: jest.fn(),
	history: {
		goBack: jest.fn(),
	},
	checkAuth: jest.fn(),
	setAuth: jest.fn(),
});

describe('submitEditedApp', () => {
	const data = mockSubmitEditedAppData;
	const submittedAppSysId = mockSubmittedAppSysId;

	beforeEach(() => {
		jest.clearAllMocks();
		message.error = jest.fn();
		notification.error = jest.fn();
		transformJsonToBackend.mockReturnValue(createMockTransformedData());
	});

	test('returns an empty array when required attachments helper is called without arguments', () => {
		expect(getMissingRequiredAttachments()).toEqual([]);
	});

	test('submits successfully after deleting and uploading attachments', async () => {
		const callbacks = createCallbacks();

		axios.delete.mockResolvedValue({});
		axios.post.mockResolvedValue({});
		axios.get.mockResolvedValue(mockSuccessfulAttachmentCheckResponse);
		axios.put.mockResolvedValue(mockSuccessfulApplicationSubmissionResponse);

		await submitEditedApp(
			callbacks.setConfirmLoading,
			data,
			submittedAppSysId,
			callbacks.setSubmitted,
			callbacks.setPercent,
			callbacks.setAppSysId,
			callbacks.history,
			callbacks.checkAuth,
			callbacks.setAuth
		);

		expect(transformJsonToBackend).toHaveBeenCalledWith(data);
		expect(callbacks.setSubmitted).toHaveBeenNthCalledWith(1, true);
		expect(callbacks.setPercent).toHaveBeenNthCalledWith(1, 25);
		expect(callbacks.setPercent).toHaveBeenNthCalledWith(2, 50);
		expect(callbacks.setPercent).toHaveBeenNthCalledWith(3, 75);
		expect(callbacks.setPercent).toHaveBeenNthCalledWith(4, 100);

		expect(axios.delete).toHaveBeenCalledWith(
			DELETE_ATTACHMENT + 'attach-delete-1'
		);
		expect(axios.post).toHaveBeenNthCalledWith(
			1,
			SERVICE_NOW_FILE_ATTACHMENT,
			{ name: 'resume.pdf', type: 'application/pdf' },
			{
				params: {
					file_name: 'resume.pdf',
					table_name: 'x_table',
					table_sys_id: 'table-2',
				},
				headers: {
					'Content-Type': 'application/pdf',
				},
			}
		);
		expect(axios.post).toHaveBeenNthCalledWith(
			2,
			SERVICE_NOW_FILE_ATTACHMENT,
			{
				name: 'cover-letter.docx',
				type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			},
			{
				params: {
					file_name: 'cover-letter.docx',
					table_name: 'x_table',
					table_sys_id: 'table-3',
				},
				headers: {
					'Content-Type':
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				},
			}
		);
		expect(axios.get).toHaveBeenCalledWith(
			ATTACHMENT_CHECK_FOR_APPLICATIONS + submittedAppSysId
		);
		expect(axios.put).toHaveBeenCalledWith(APPLICATION_SUBMISSION, {
			app_sys_id: submittedAppSysId,
			vacancy_documents: expect.any(Array),
		});
		expect(callbacks.setAppSysId).toHaveBeenCalledWith(submittedAppSysId);
		expect(callbacks.setConfirmLoading).toHaveBeenCalledWith(false);
		expect(callbacks.checkAuth).toHaveBeenCalledWith(
			callbacks.setConfirmLoading,
			callbacks.setAuth
		);
		expect(message.error).not.toHaveBeenCalled();
		expect(notification.error).not.toHaveBeenCalled();
	});

	test('submits with no documents and no attachment messages without setting completion state', async () => {
		const callbacks = createCallbacks();

		transformJsonToBackend.mockReturnValue({});
		axios.get.mockResolvedValue(mockEmptyAttachmentCheckResponse);
		axios.put.mockResolvedValue(mockUnsuccessfulApplicationSubmissionResponse);

		await submitEditedApp(
			callbacks.setConfirmLoading,
			data,
			submittedAppSysId,
			callbacks.setSubmitted,
			callbacks.setPercent,
			callbacks.setAppSysId,
			callbacks.history,
			callbacks.checkAuth,
			callbacks.setAuth
		);

		expect(axios.delete).not.toHaveBeenCalled();
		expect(axios.post).not.toHaveBeenCalled();
		expect(axios.put).toHaveBeenCalledWith(APPLICATION_SUBMISSION, {
			app_sys_id: submittedAppSysId,
		});
		expect(callbacks.setPercent).toHaveBeenNthCalledWith(1, 25);
		expect(callbacks.setPercent).toHaveBeenNthCalledWith(2, 50);
		expect(callbacks.setPercent).toHaveBeenNthCalledWith(3, 75);
		expect(callbacks.setAppSysId).not.toHaveBeenCalled();
		expect(callbacks.setSubmitted).toHaveBeenCalledTimes(1);
		expect(callbacks.setSubmitted).toHaveBeenCalledWith(true);
	});

	test('shows attachment error and navigates back when required attachments are missing', async () => {
		const callbacks = createCallbacks();

		transformJsonToBackend.mockReturnValue({ vacancy_documents: [] });
		axios.get.mockResolvedValue(mockMissingRequiredAttachmentResponse);

		await submitEditedApp(
			callbacks.setConfirmLoading,
			data,
			submittedAppSysId,
			callbacks.setSubmitted,
			callbacks.setPercent,
			callbacks.setAppSysId,
			callbacks.history,
			callbacks.checkAuth,
			callbacks.setAuth
		);

		expect(callbacks.setSubmitted).toHaveBeenNthCalledWith(1, true);
		expect(callbacks.setSubmitted).toHaveBeenNthCalledWith(2, false);
		expect(notification.error).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Sorry! There was an error with submitting the attachments.',
				duration: 30,
				style: {
					height: '225px',
					display: 'flex',
					alignItems: 'center',
				},
			})
		);
		expect(callbacks.history.goBack).toHaveBeenCalled();
		expect(axios.put).not.toHaveBeenCalled();
		expect(message.error).not.toHaveBeenCalled();
	});

	test('shows closed vacancy message when the api returns status 400', async () => {
		const callbacks = createCallbacks();

		transformJsonToBackend.mockReturnValue({ vacancy_documents: [] });
		axios.get.mockResolvedValue(mockNoMissingAttachmentResponse);
		axios.put.mockRejectedValue({
			response: {
				status: 400,
			},
		});

		await submitEditedApp(
			callbacks.setConfirmLoading,
			data,
			submittedAppSysId,
			callbacks.setSubmitted,
			callbacks.setPercent,
			callbacks.setAppSysId,
			callbacks.history,
			callbacks.checkAuth,
			callbacks.setAuth
		);

		expect(callbacks.setSubmitted).toHaveBeenLastCalledWith(false);
		expect(message.error).toHaveBeenCalledWith(
			'Sorry! Your application cannot be submitted because this vacancy has been closed or is past the close date.'
		);
		expect(notification.error).not.toHaveBeenCalled();
		expect(callbacks.history.goBack).not.toHaveBeenCalled();
	});

	test('shows closed vacancy message when axios rejects with the 400 status text', async () => {
		const callbacks = createCallbacks();

		transformJsonToBackend.mockReturnValue({ vacancy_documents: [] });
		axios.get.mockResolvedValue(mockNoMissingAttachmentResponse);
		axios.put.mockRejectedValue(
			new Error('Request failed with status code 400')
		);

		await submitEditedApp(
			callbacks.setConfirmLoading,
			data,
			submittedAppSysId,
			callbacks.setSubmitted,
			callbacks.setPercent,
			callbacks.setAppSysId,
			callbacks.history,
			callbacks.checkAuth,
			callbacks.setAuth
		);

		expect(message.error).toHaveBeenCalledWith(
			'Sorry! Your application cannot be submitted because this vacancy has been closed or is past the close date.'
		);
		expect(notification.error).not.toHaveBeenCalled();
	});

	test('shows generic submission error when submission fails for another reason', async () => {
		const callbacks = createCallbacks();

		transformJsonToBackend.mockReturnValue({ vacancy_documents: [] });
		axios.get.mockResolvedValue(mockNoMissingAttachmentResponse);
		axios.put.mockRejectedValue(new Error('Network Error'));

		await submitEditedApp(
			callbacks.setConfirmLoading,
			data,
			submittedAppSysId,
			callbacks.setSubmitted,
			callbacks.setPercent,
			callbacks.setAppSysId,
			callbacks.history,
			callbacks.checkAuth,
			callbacks.setAuth
		);

		expect(notification.error).toHaveBeenCalledWith(
			expect.objectContaining({
				message:
					'Sorry! There was an error when attempting to submit your application.',
				duration: 0,
				style: {
					height: '225px',
					display: 'flex',
					alignItems: 'center',
				},
			})
		);
		expect(message.error).not.toHaveBeenCalled();
		expect(callbacks.history.goBack).not.toHaveBeenCalled();
		expect(callbacks.setConfirmLoading).toHaveBeenCalledWith(false);
		expect(callbacks.checkAuth).toHaveBeenCalledWith(
			callbacks.setConfirmLoading,
			callbacks.setAuth
		);
	});
});
