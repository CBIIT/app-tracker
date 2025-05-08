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

jest.mock('../../../hooks/useAuth');
jest.mock('../../../constants/checkAuth');
jest.mock('axios');

describe('SubmitModal component', () => {
    const mockVisible = true;
    let mockHandleCancel;
    let mockDraftId;
    let mockEditSubmitted; // returns True or False
    let mockAppSysId;
    let mockSubmitEdittedApp = jest.fn();
    let mockSubmitNewApp = jest.fn();

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

        const header = screen.getByText(/Ready to submit application?/i);
        expect(header).toBeInTheDocument();

        const p1 = screen.getByText(/Please ensure that the correct documents have been submitted./i);
        expect(p1).toBeInTheDocument();

        const p2 = screen.getByText(/Once the application is submitted, and the close date has been reached, it cannot be edited./i);
        expect(p2).toBeInTheDocument();
    });

    test('should render updated modal to let user know that the application is being submitted', () => {
        mockEditSubmitted = false;

        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        const handleOkElement = screen.getByText(/Ok/i);
        fireEvent.click(handleOkElement);
        mockSubmitNewApp = jest.fn();
        // mockApplicationAttachmentCheckResponse
        
    });

    
});