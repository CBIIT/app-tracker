import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import SubmitModal from './SubmitModal';
import useAuth from '../../../hooks/useAuth';
import checkAuth from '../../../constants/checkAuth';
import axios from 'axios';
import { 
    mockUseAuth, 
    mockFormData,
    mockSaveAppDraftResponse,
    mockSaveAppDraftFailResponse,
    mockSaveDraftDocResponse,
    mockSaveDraftDocFailResponse,
    mockOptions,
    mockFile,
    mockFileAttachResponse,
    mockAttachmentCheckResponse,
    mockSubmitAppResponse,
    mockInfoToSend,
    mockAttachmentDeleteResponse,
    mockDocumentToDelete,
    mockApplicationAttachmentCheckResponse,
    mockApplicationUpdateResponse,
} from './SubmitModalMockData';
import {
	SUBMIT_APPLICATION,
	APPLICATION_SUBMISSION,
	SAVE_APP_DRAFT,
	CREATE_APP_DOCS,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
	ATTACHMENT_CHECK,
	ATTACHMENT_CHECK_FOR_APPLICATIONS,
} from '../../../constants/ApiEndpoints';

jest.mock('../../../hooks/useAuth');
jest.mock('../../../constants/checkAuth');
jest.mock('axios');

describe('SubmitModal component', () => {
    const mockVisible = true;
    let mockHandleCancel;
    let mockDraftId;
    let mockEditSubmitted; // returns True or False
    let mockAppSysId;

    beforeEach(() => {
        mockHandleCancel = jest.fn();
        useAuth.mockReturnValue(mockUseAuth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render SubmitModal component', () => {
        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        const handleOkElement = screen.getByText(/Ok/i);
        expect(handleOkElement).toBeInTheDocument();

        const handleCancelElement = screen.getByText(/Cancel/i);
        expect(handleCancelElement).toBeInTheDocument();
    });

    test('should begin new app submission process on Ok click', async () => {
        useAuth.mockReturnValue(mockUseAuth);
        mockDraftId = '123';
        mockEditSubmitted = false;
        mockAppSysId = '';

        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        await waitFor (() => {
        fireEvent.click(screen.getByText(/Ok/i));
        });

        axios.post.mockImplementationOnce(() => Promise.resolve(mockSaveAppDraftResponse));
        axios.post.mockImplementationOnce(() => Promise.resolve(mockSaveDraftDocResponse));
        axios.post.mockImplementationOnce(() => Promise.resolve(mockFileAttachResponse));
        axios.get.mockImplementationOnce(() => Promise.resolve(mockAttachmentCheckResponse));
        axios.post.mockImplementationOnce(() => Promise.resolve(mockSubmitAppResponse));

        const saveDraft = await axios.post(SAVE_APP_DRAFT, { jsonobj: JSON.stringify(mockFormData), draft_id: mockDraftId });
        const saveDocs = await axios.post(CREATE_APP_DOCS, { jsonobj: (mockFormData), draft_id: mockDraftId });
        const attachFile = await axios.post(SERVICE_NOW_FILE_ATTACHMENT, { options: mockOptions, file: mockFile });
        const attachmentCheck = await axios.get(ATTACHMENT_CHECK, { draft_id: mockDraftId });
        const submitApp = await axios.post(SUBMIT_APPLICATION, { key: mockInfoToSend });

        expect(axios.post).toHaveBeenCalledTimes(6);
        expect(axios.get).toHaveBeenCalledTimes(1);

        expect(axios.post).toHaveBeenNthCalledWith(1, SAVE_APP_DRAFT, { jsonobj: JSON.stringify(mockFormData), draft_id: mockDraftId });
        expect(saveDraft).toEqual(mockSaveAppDraftResponse);

        expect(axios.post).toHaveBeenNthCalledWith(4, CREATE_APP_DOCS, { jsonobj: (mockFormData), draft_id: mockDraftId });
        expect(saveDocs).toEqual(mockSaveDraftDocResponse);

        expect(axios.post).toHaveBeenNthCalledWith(5, SERVICE_NOW_FILE_ATTACHMENT, { options: mockOptions, file: mockFile });
        expect(attachFile).toEqual(mockFileAttachResponse);

        expect(axios.get).toHaveBeenNthCalledWith(1, ATTACHMENT_CHECK, { draft_id: mockDraftId });
        expect(attachmentCheck).toEqual(mockAttachmentCheckResponse);

        expect(axios.post).toHaveBeenNthCalledWith(6, SUBMIT_APPLICATION, { key: mockInfoToSend });
        expect(submitApp).toEqual(mockSubmitAppResponse);

    });

    test('Should handle editing a submitted application on Ok click', async () => {
        mockDraftId = '';
        mockEditSubmitted = true;
        mockAppSysId = '123';

        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        await waitFor (() => {
            fireEvent.click(screen.getByText(/Ok/i));
        });

        axios.delete.mockImplementationOnce(() => Promise.resolve(mockAttachmentDeleteResponse));
        axios.post.mockImplementationOnce(() => Promise.resolve(mockFileAttachResponse));
        axios.get.mockImplementationOnce(() => Promise.resolve(mockApplicationAttachmentCheckResponse));
        axios.post.mockImplementationOnce(() => Promise.resolve(mockApplicationUpdateResponse));

        const deleteFile = await axios.delete(SERVICE_NOW_ATTACHMENT, { key: mockDocumentToDelete.uploadedDocument.attachSysId });
        const attachFile = await axios.post(SERVICE_NOW_FILE_ATTACHMENT, { options: mockOptions, file: mockFile });
        const applicationAttachmentCheck = await axios.get(ATTACHMENT_CHECK_FOR_APPLICATIONS, { sys_id: mockAppSysId });
        const applicationSubmission = await axios.post(APPLICATION_SUBMISSION, { key: mockInfoToSend });

        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledTimes(2);
        expect(axios.get).toHaveBeenCalledTimes(1);

        expect(axios.delete).toHaveBeenNthCalledWith(1, SERVICE_NOW_ATTACHMENT, { key: mockDocumentToDelete.uploadedDocument.attachSysId });
        expect(deleteFile).toEqual(mockAttachmentDeleteResponse);

        expect(axios.post).toHaveBeenNthCalledWith(1, SERVICE_NOW_FILE_ATTACHMENT, { options: mockOptions, file: mockFile });
        expect(attachFile).toEqual(mockFileAttachResponse);

        expect(axios.get).toHaveBeenNthCalledWith(1, ATTACHMENT_CHECK_FOR_APPLICATIONS, { sys_id: mockAppSysId });
        expect(applicationAttachmentCheck).toEqual(mockApplicationAttachmentCheckResponse);

        expect(axios.post).toHaveBeenNthCalledWith(2, APPLICATION_SUBMISSION, { key: mockInfoToSend });
        expect(applicationSubmission).toEqual(mockApplicationUpdateResponse);

    })

    test('should handle failed app submission process on Ok click', async () => {
        mockDraftId = '123';
        mockEditSubmitted = false;
        mockAppSysId = '';

        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        await waitFor (() => {
            fireEvent.click(screen.getByText(/Ok/i));
        });

        axios.post.mockImplementationOnce(() => Promise.resolve(mockSaveAppDraftFailResponse));

        const saveDraft = await axios.post(SAVE_APP_DRAFT, { jsonobj: JSON.stringify(mockFormData), draft_id: mockDraftId });

        expect(axios.post).toHaveBeenCalledTimes(3);

        expect(axios.post).toHaveBeenNthCalledWith(1, SAVE_APP_DRAFT, { jsonobj: JSON.stringify(mockFormData), draft_id: mockDraftId });
        expect(saveDraft).toEqual(mockSaveAppDraftFailResponse);
        waitFor (() => expect(screen.getAllByText("Sorry! There was an error when attempting to submit your application or it is past the close date.")).toBeInTheDocument());
    });

});