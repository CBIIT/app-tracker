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

})

// mockFormData = {
//     address: {
//         address: "123 test",
//         address2: null,
//         city: "tes",
//         country: "United States",
//         stateProvince: "MD",
//         zip: "20855",
//     },
//     applicantDocuments: [
//         {
//             file: {
//                 file: {
//                     uid: "rc-upload-1737555580020-15", 
//                     name: "Cirriculum Vitae (CV).docx", 
//                     size: 14296046, 
//                     type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//                 },
//                 fileList: [{
//                     0: {
//                         name: "Cirriculum Vitae (CV).docx",
//                         originFileObj: {
//                             uid: "rc-upload-1737555580020-15",
//                             name: "Cirriculum Vitae (CV).docx",
//                             size: 14296046,
//                             type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                             uid: "rc-upload-1737555580020-15",
//                         },
//                         size: 14296046,
//                         type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                         uid: "rc-upload-1737555580020-15",
//                     },
//                 }],
//             },
//             is_optional: {label: 'false', value: '0'},
//             sys_created_by: {label: 'gemarhn@nih.gov', value: 'gemarhn@nih.gov'},
//             sys_created_on: {label: '12/09/2024 14:08:15', value: '2024-12-09 19:08:15'},
//             sys_id: {label: '11bcf93a1b1a1610c5c40e1ce54bcb1d', value: '11bcf93a1b1a1610c5c40e1ce54bcb1d'},
//             sys_mod_count: {label: '0', value: '0'},
//             sys_tags: {label: '', value: ''},
//             sys_updated_by: {label: 'gemarhn@nih.gov', value: 'gemarhn@nih.gov'},
//             sys_updated_on: {label: '12/09/2024 14:08:15', value: '2024-12-09 19:08:15'},
//             title: {label: 'Curriculum Vitae (CV)', value: 'Curriculum Vitae (CV)'} ,
//             vacancy_id: {label: 'Vacancy POC Log test 3', value: '15bcf93a1b1a1610c5c40e1ce54bcb1b'}
//         },
//     ],
// }
