import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    mockFileAttachResponse
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

        fireEvent.click(screen.getByText(/Ok/i));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledTimes(2);
            expect(axios.post).toHaveBeenCalledWith(SAVE_APP_DRAFT, { jsonobj: JSON.stringify(mockFormData1), draft_id: mockDraftId });
            expect(axios.post).toHaveBeenCalledWith(CREATE_APP_DOCS, { draft_id: mockDraftId, jsonobj: mockFormData1 });
        });

    });

});