import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { message } from 'antd';
import submitNewApp from './SubmitNewApp';
import {
	SAVE_APP_DRAFT,
	CREATE_APP_DOCS,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
	ATTACHMENT_CHECK,
	SUBMIT_APPLICATION,
} from '../../../../constants/ApiEndpoints';
import {
	mockSaveAppDraftResponse,
	mockSaveAppDraftFailResponse,
	mockSaveDraftDocResponse,
	mockSaveDraftDocFailResponse,
	mockOptions,
	mockFile,
	mockFileAttachResponse,
	mockAttachmentCheckResponse,
	mockAttachmentCheckFailResponse,
	mockSubmitAppResponse,
	mockSubmitAppFailResponse,
	mockClosedVacancyResponse,
	mockDocumentToDelete,
	mockAttachmentDeleteResponse,
	mockApplicationAttachmentCheckResponse,
	mockApplicationUpdateResponse,
	mockInfoToSend,
	mockFormData,
	mockInfoToSendEdit,
} from '../SubmitModalMockData';

jest.mock('axios');
jest.mock('../../Util/TransformJsonToBackend');
jest.mock('./SubmitNewApp');

describe('SubmitNewApp component', () => {
	const mockSetConfirmLoading = jest.fn();
	let mockDraftId;
    let mockSetSubmitted;
	const mockSetPercent = jest.fn();
	const mockSetAppSysId = jest.fn();
    const mockOnCancel = jest.fn();
    const mockReturnToDocuments = jest.fn();
	const mockCheckAuth = jest.fn();
	const mockSetAuth = jest.fn();
    const mockSaveAppDraft = jest.fn();
	

	beforeEach(() => {
        mockDraftId = '12345';
        mockSetSubmitted = true;
    });

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('Should handle successful submitNewApp function call', async () => {
        // submitNewApp(
        //     mockSetConfirmLoading,
        //     mockDraftId,
        //     mockSetSubmitted,
        //     mockSetPercent,
        //     mockSetAppSysId,
        //     mockOnCancel,
        //     mockReturnToDocuments,
        //     mockCheckAuth,
        //     mockSetAuth
        // );
        // expect(submitNewApp).toBeCalledWith(
        //     mockSetConfirmLoading,
        //     mockInfoToSend,
        //     mockDraftId,
        //     mockSetSubmitted,
        //     mockSetPercent,
        //     mockSetAppSysId,
        //     mockOnCancel,
        //     mockReturnToDocuments,
        //     mockCheckAuth,
        //     mockSetAuth
        // );
        // expect(SAVE_APP_DRAFT).toBeCalledWith(
        //     mockDraftId,
        // );
	});

	// test('Should handle failed saveAppDraft function call', async () => {
	//     const errorMessage = 'Sorry! There was an error when attempting to submit your application.';

	//     try {
	//         await axios.post.mockRejectedValueOnce(new Error(errorMessage));
	//     } catch (e) {
	//         expect(setSubmitted).toBe(false);
	//         expect(error).toEqual(new Error(errorMessage));
	//     }

	// });
});
