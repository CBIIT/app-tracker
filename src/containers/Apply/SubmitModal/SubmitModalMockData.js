// Mocks checkAuth response
export const mockCheckAuth = {
    mockData: {
        auth: {
            isUserLoggedIn: true,
            user: { uid: '123' },
            oktaLoginAndRedirectUrl: 'http://example.com/login',
        },
    }
};

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

export const mockFormData1 = {
    sysId: '123',
    basicInfo: {
        firstName: 'John',
        middleName: 'A',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phonePrefix: '+1',
        phone: '1234567890',
        businessPhonePrefix: '+1',
        businessPhone: '0987654321',
        highestLevelEducation: 'PhD',
        isUsCitizen: true,
    },
    address: {
        address: '123 Main St',
        address2: 'Apt 4',
        city: 'Anytown',
        zip: '12345',
        stateProvince: 'CA',
        country: 'USA',
    },
    focusArea: ['Area1', 'Area2'],
    applicantDocuments: ['doc1', 'doc2'],
    references: [
        {
            ref_sys_id: 'ref1',
            firstName: 'Jane',
            middleName: 'B',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phoneNumber: '0987654321',
            contact: true,
            organization: 'Org1',
            title: 'Manager',
            relationship: 'Colleague',
        },
    ],
    questions: {
        share: true,
        sex: 'Male',
        ethnicity: 'Hispanic',
        race: ['White'],
        disability: ['None'],
    },
};