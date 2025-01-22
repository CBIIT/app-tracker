import { fireEvent, render, screen } from '@testing-library/react';
import SubmitModal from './SubmitModal';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';

jest.mock('../../../hooks/useAuth');
jest.mock('axios');


describe('SubmitModal component', () => {
    let mockUseAuth;
    let mockVisible; // returns True or False
    let mockHandleCancel;
    let mockFormData;
    let mockDraftId;
    let mockEditSubmitted; // returns True or False
    let mockAppSysId;
    let mockInfoToSend;

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
        mockUseAuth = {
            auth: {
                isUserLoggedIn: true,
                user: { uid: '123' },
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);

        mockVisible = true;
        mockDraftId = 123;
        mockEditSubmitted = false;
        mockAppSysId = null;
        mockFormData = {
            applicantDocuments: [
                {
                    file: {
                        file: {
                            uid: "rc-upload-1737555580020-15", 
                            name: "Cirriculum Vitae (CV).docx", 
                            size: 14296046, 
                            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        },
                        fileList: [{
                            0: {
                                name: "Cirriculum Vitae (CV).docx",
                                originFileObj: {
                                    uid: "rc-upload-1737555580020-15",
                                    name: "Cirriculum Vitae (CV).docx",
                                    size: 14296046,
                                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                    uid: "rc-upload-1737555580020-15",
                                },
                                size: 14296046,
                                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                uid: "rc-upload-1737555580020-15",
                            },
                        }],
                    },
                },
            ],
        }

        const mockSaveAppDraftResponse = {
            data: {
                result: {
                    response: {
                        'status': 200,
						'message': 'Sucessfully updated draft_id:' + '123',
						'draft_id': '123',
                    },
                },
            },
        };
        axios.post.mockResolvedValue(mockSaveAppDraftResponse);

        const mockSaveDraftDocResponse = {
            data: {
                result: {
                    response: {
                        'status': 200,
                        response: {
                            'file_name': "Cirriculum Vitae (CV).docx",
                            'table_sys_id': '456',
                            'table_name': 'application_documents',
                            'uid': 'rc-upload-1737555580020-15',
                        }
                    },
                },
            },
        };
        axios.post.mockResolvedValue(mockSaveDraftDocResponse);

        // This mock will stand in as the option used to attach documents
        const mockOptions = [
            {
                uid: "rc-upload-1737555580020-15",
                file_name: "Cirriculum Vitae (CV).docx",
                table_name: 'application_documents',
                table_sys_id: '456',
            },
        ];

        // This mock will stand in as the file that is the fileHashMap
        const mockFile = {
            file: {
                uid: "rc-upload-1737555580020-15", 
                originFileObj: {
                    uid: "rc-upload-1737555580020-15",
                    name: "Cirriculum Vitae (CV).docx",
                    size: 14296046,
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    uid: "rc-upload-1737555580020-15",
                },
            },
        };

        const mockFileAttachResponse = {
            response: {
                'status': 200,
            }
        }
        axios.post.mockResolvedValue(mockFileAttachResponse);

        mockInfoToSend = {
            vacancy_documents: {
                file: {
                    file: {
                        uid: "rc-upload-1737555580020-15", 
                        name: "Cirriculum Vitae (CV).docx", 
                        size: 14296046, 
                        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    },
                    fileList: [{
                        0: {
                            name: "Cirriculum Vitae (CV).docx",
                            originFileObj: {
                                uid: "rc-upload-1737555580020-15",
                                name: "Cirriculum Vitae (CV).docx",
                                size: 14296046,
                                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                uid: "rc-upload-1737555580020-15",
                            },
                            size: 14296046,
                            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            uid: "rc-upload-1737555580020-15",
                        },
                    }],
                },
            }
        };

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
        // expect(axios.post).toHaveBeenCalledWith('/api/now/attachment/file', { key: mockOptions, file: mockFile });
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
