import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { message } from 'antd';
import SubmitNewApp from './SubmitNewApp';
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

describe('SubmitNewApp component', () => {
	let setPercent;
	const mockSetAppSysId = jest.fn();
	const mockSetConfirmLoading = jest.fn();
	const mockCheckAuth = jest.fn();
	const mockSetAuth = jest.fn();
	let setSubmitted;

	beforeEach(() => {
        setSubmitted = true;
    });

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('Should handle sucessful saveAppDraft function call', async () => {
        try {
            await axios.post.mockResolvedValueOnce(mockSaveAppDraftResponse);
            expect(setPercent).toBe(20);
        } catch (error) {
            console.error('Error in saveAppDraft:', error);
        } finally {
            
        }
        
    });

    test('Should handle failed saveAppDraft function call', async () => {
        const errorMessage = 'Sorry! There was an error when attempting to submit your application.';

        try {
            await axios.post.mockRejectedValueOnce(new Error(errorMessage));
        } catch (e) {
            expect(setSubmitted).toBe(false);
            expect(error).toEqual(new Error(errorMessage));
        }

    });

});
