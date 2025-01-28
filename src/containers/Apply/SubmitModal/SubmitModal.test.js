import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import SubmitModal from './SubmitModal';
import useAuth from '../../../hooks/useAuth';
import checkAuth from '../../../constants/checkAuth';
import axios from 'axios';
import { 
    mockUseAuth, 
    mockFormData,
    mockFormData1,
    mockSaveAppDraftResponse,
    mockSaveAppDraftFailResponse,
    mockSaveDraftDocResponse,
    mockSaveDraftDocFailResponse,
    mockOptions,
    mockFile,
    mockFileAttachResponse,
    mockAttachmentCheckResponse,
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
            data={mockFormData1}
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
        axios.post.mockImplementationOnce(() => Promise.resolve(mockFileAttachResponse));

        const saveDraft = await axios.post(SAVE_APP_DRAFT, { jsonobj: JSON.stringify(mockFormData1), draft_id: mockDraftId });
        const saveDocs = await axios.post(CREATE_APP_DOCS, { jsonobj: (mockFormData1), draft_id: mockDraftId });
        const attachFile = await axios.post(SERVICE_NOW_FILE_ATTACHMENT, { options: mockOptions, file: mockFile });
        const attachmentCheck = await axios.post(ATTACHMENT_CHECK, { draft_id: mockDraftId });

        expect(axios.post).toHaveBeenCalledTimes(6);
        expect(axios.post).toHaveBeenNthCalledWith(1, SAVE_APP_DRAFT, { jsonobj: JSON.stringify(mockFormData1), draft_id: mockDraftId });
        expect(saveDraft).toEqual(mockSaveAppDraftResponse);
        expect(axios.post).toHaveBeenNthCalledWith(4, CREATE_APP_DOCS, { jsonobj: (mockFormData1), draft_id: mockDraftId });
        expect(saveDocs).toEqual(mockSaveDraftDocResponse);
        expect(axios.post).toHaveBeenNthCalledWith(5, SERVICE_NOW_FILE_ATTACHMENT, { options: mockOptions, file: mockFile });
        expect(attachFile).toEqual(mockFileAttachResponse);
        expect(axios.post).toHaveBeenNthCalledWith(6, ATTACHMENT_CHECK, { draft_id: mockDraftId });
        expect(attachmentCheck).toEqual(mockAttachmentCheckResponse);

    });

});