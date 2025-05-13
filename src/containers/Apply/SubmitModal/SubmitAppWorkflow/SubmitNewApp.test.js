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
	let mockSetPercent;
	const mockSetAppSysId = jest.fn();
	const mockSetConfirmLoading = jest.fn();
	const mockCheckAuth = jest.fn();
	const mockSetAuth = jest.fn();
	const mockSetSubmitted = jest.fn();

	beforeEach(() => {});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('Should handle sucessful saveAppDraft function call', async () => {
        axios.post.mockResolvedValueOnce(mockSaveAppDraftResponse);

        const saveDraft = await axios.post(SAVE_APP_DRAFT, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(SAVE_APP_DRAFT, mockFormData);
        expect(saveDraft).toEqual(mockSaveAppDraftResponse);
        // expect(mockSetPercent).toBe(20);
    });

    test('Should handle failed saveAppDraft function call', async () => {
        axios.post.mockResolvedValueOnce(mockSaveAppDraftFailResponse);

        const saveDraft = await axios.post(SAVE_APP_DRAFT, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(SAVE_APP_DRAFT, mockFormData);
        expect(saveDraft).toEqual(mockSaveAppDraftFailResponse);
        waitFor (() => expect(screen.getAllByText("Sorry! There was an error when attempting to submit your application")).toBeInTheDocument());
        // expect(mockSetSubmitted).toBe(false);
    });

    test('Should handle sucessful createAppDocs function call', async () => {
        axios.post.mockResolvedValueOnce(mockSaveDraftDocResponse);

        const saveDraft = await axios.post(CREATE_APP_DOCS, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(CREATE_APP_DOCS, mockFormData);
        expect(saveDraft).toEqual(mockSaveDraftDocResponse);
        // expect(mockSetPercent).toBe(40);
    });

    test('Should handle failed createAppDocs function call', async () => {
        axios.post.mockResolvedValueOnce(mockSaveDraftDocFailResponse);

        const saveDraft = await axios.post(CREATE_APP_DOCS, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(CREATE_APP_DOCS, mockFormData);
        expect(saveDraft).toEqual(mockSaveDraftDocFailResponse);
        waitFor (() => expect(screen.getAllByText("Sorry! There was an error when attempting to submit your application")).toBeInTheDocument());
        // expect(mockSetSubmitted).toBe(false);
    });

    test('Should handle sucessful attachDocuments function call', async () => {
        axios.post.mockResolvedValueOnce(mockFileAttachResponse);

        const saveDraft = await axios.post(SERVICE_NOW_FILE_ATTACHMENT, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(SERVICE_NOW_FILE_ATTACHMENT, mockFormData);
        expect(saveDraft).toEqual(mockFileAttachResponse);
        // expect(mockSetPercent).toBe(60);
    });

    test('Should handle failed attachDocuments function call', async () => {
        axios.post.mockResolvedValueOnce(mockFileAttachResponse);

        const saveDraft = await axios.post(SERVICE_NOW_FILE_ATTACHMENT, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(SERVICE_NOW_FILE_ATTACHMENT, mockFormData);
        expect(saveDraft).toEqual(mockFileAttachResponse);
        waitFor (() => expect(screen.getAllByText("Sorry! There was an error when attempting to submit your application")).toBeInTheDocument());
        // expect(mockSetSubmitted).toBe(false);
    });

    test('should handle sucessful checkAttachments function call', async () => {
        axios.post.mockResolvedValueOnce(mockAttachmentCheckResponse);

        const checkAttachments = await axios.post(ATTACHMENT_CHECK, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(ATTACHMENT_CHECK, mockFormData);
        expect(checkAttachments).toEqual(mockAttachmentCheckResponse);
        // expect(mockSetPercent).toBe(80);
    });

    test('should handle failed checkAttachments function call', async () => {
        axios.post.mockResolvedValueOnce(mockAttachmentCheckFailResponse);

        const checkAttachments = await axios.post(ATTACHMENT_CHECK, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(ATTACHMENT_CHECK, mockFormData);
        expect(checkAttachments).toEqual(mockAttachmentCheckFailResponse);
        waitFor (() => expect(screen.getAllByText("Sorry! There was an error when attempting to submit your application")).toBeInTheDocument());
        // expect(mockSetSubmitted).toBe(false);
    });

    // test to verify if attachments are attached success

    // test to verify if attachments are attached failed and handle document deletion and redirect

    test('should handle sucessful submitApplication function call', async () => {
        axios.post.mockResolvedValueOnce(mockSubmitAppResponse);

        const submitApplication = await axios.post(SUBMIT_APPLICATION, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(SUBMIT_APPLICATION, mockFormData);
        expect(submitApplication).toEqual(mockSubmitAppResponse);
        // expect(mockSetPercent).toBe(100);
        // expect(mockSetAppSysId).toBe(mockSubmitAppResponse.data.result.sys_id);
    });

    test('should handle error on submitApplication function call', async () => {
        axios.post.mockResolvedValueOnce(mockSubmitAppFailResponse);

        const submitApplication = await axios.post(SUBMIT_APPLICATION, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(SUBMIT_APPLICATION, mockFormData);
        expect(submitApplication).toEqual(mockSubmitAppFailResponse);
        waitFor (() => expect(screen.getAllByText("Sorry! There was an error when attempting to submit your application")).toBeInTheDocument());
        // expect(mockSetSubmitted).toBe(false);
    });

    test('should handle closed vacancy error on submitApplication function call', async () => {
        axios.post.mockResolvedValueOnce(mockClosedVacancyResponse);

        const submitApplication = await axios.post(SUBMIT_APPLICATION, mockFormData);

        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(SUBMIT_APPLICATION, mockFormData);
        expect(submitApplication).toEqual(mockClosedVacancyResponse);
        waitFor (() => expect(screen.getAllByText("Sorry! Your application cannot be submitted because this vacancy has been closed or is past the close date.")).toBeInTheDocument());
        // expect(mockSetSubmitted).toBe(false);
    });
});
