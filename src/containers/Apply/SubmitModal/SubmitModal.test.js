import { fireEvent, render, screen } from '@testing-library/react';
import SubmitModal from './SubmitModal';
import useAuth from '../../../hooks/useAuth';
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
    mockFileAttachResponse
} from './SubmitModalMockData';

jest.mock('../../../hooks/useAuth');
jest.mock('axios');


describe('SubmitModal component', () => {
    let mockVisible; // returns True or False
    let mockHandleCancel;
    let mockDraftId;
    let mockEditSubmitted; // returns True or False
    let mockAppSysId;

    beforeEach(() => {
        mockHandleCancel = jest.fn();
    });

    test('should render SubmitModal component', () => {
        mockVisible = true;
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

    // Test cases for new app submissions
    test('should begin new app submission process on Ok click', () => {
        
        useAuth.mockReturnValue(mockUseAuth);

        mockVisible = true;
        mockDraftId = 123;
        mockEditSubmitted = false;
        mockAppSysId = null;

        // Mocks axios.post call for SAVE_APP_DRAFT
        axios.post.mockResolvedValue(mockSaveAppDraftResponse);

        // Mocks axios.post call for CREATE_APP_DOCS
        axios.post.mockResolvedValue(mockSaveDraftDocResponse);

        // Mocks axios.post call for SERVICE_NOW_FILE_ATTACHMENT
        axios.post.mockResolvedValue(mockFileAttachResponse);

        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        fireEvent.click(screen.getByText(/Ok/i));
        expect(axios.post).toHaveBeenCalledWith('/api/x_g_nci_app_tracke/application/save_app_draft', { key: mockFormData, draft_id: mockDraftId });
        expect(axios.post).toHaveBeenCalledWith('/api/x_g_nci_app_tracke/application/createApplicationDocument', { key: mockFormData, draft_id: mockDraftId });
        expect(axios.post).toHaveBeenCalledWith('/api/now/attachment/file', { key: mockOptions, file: mockFile });
    });
    


    
    // Test cases for editing submitted applications

});