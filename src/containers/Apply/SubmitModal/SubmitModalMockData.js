//Mocks useAuth data
export const mockUseAuth = {
    auth: {
        isUserLoggedIn: true,
        user: { uid: '123' },
        oktaLoginAndRedirectUrl: 'http://example.com/login',
    },
};

// Mocks the formData that is passed to the SubmitModal
export const mockFormData = {
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

// Mocks a successful response from the SAVE_APP_DRAFT endpoint
export const mockSaveAppDraftResponse = {
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

// Mocks a failed response from the SAVE_APP_DRAFT endpoint
export const mockSaveAppDraftFailResponse = {
    data: {
        result: {
            response: {
                'status': 500,
                'message': 'Failed to update draft_id:' + '123',
            },
        },
    },
};

// Mocks a successful response from the CREATE_APP_DOCS endpoint
export const mockSaveDraftDocResponse = {
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

// Mocks a failed response from the CREATE_APP_DOCS endpoint
export const mockSaveDraftDocFailResponse = {
    data: {
        result: {
            response: {
                'status': 500,
                'message': 'Failed to attach documents',
            },
        },
    },
};

// This mock will stand in as the option used to attach documents
export const mockOptions = [
    {
        uid: "rc-upload-1737555580020-15",
        file_name: "Cirriculum Vitae (CV).docx",
        table_name: 'application_documents',
        table_sys_id: '456',
    },
];

// This mock will stand in as the file that is the fileHashMap
export const mockFile = {
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

// Mocks a successful response from the SERVICE_NOW_FILE_ATTACHMENT endpoint
export const mockFileAttachResponse = {
    data: {
        result: {
            response: {
                'status': 200,
            },
        },
    },
};

// Mocks a failed response from the SERVICE_NOW_FILE_ATTACHMENT endpoint

// Mocks infoToSend data that is sent with the SUBMIT_APPLICATION endpoint

// Mocks a successful response from the SUBMIT_APPLICATION endpoint

// Mocks a failed response from the SUBMIT_APPLICATION endpoint

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