export const mockVacancy = {
    basicInfo: {
        allowHrSpecialistTriage: false,
        applicationDocuments: [
            {
                document: 'doc1',
                isDocumentOptional: false
            }
        ],
        appointmentPackageIndicator: '789',
        closeDate: '',
        description: '<p>adlna;slv;sad</p>',
        numberOfCategories: '4',
        numberOfRecommendations: '1',
        openDate: '02/07/2025',
        positionClassification: 'Research Fellow',
        referenceCollection: true,
        referenceCollectionDate: '02/28/2025',
        requireFocusArea: false,
        sacCode: 'HNC',
        scoringDueByDate: '',
        tenant: 'NCI',
        title: 'asdlfklasd',
        useCloseDate: false,
        vacancyPoc: '789'
    },
    emailTemplates: [
        {
            active: true,
            type: 'Application Saved'
        },
        {
            active: true,
            type: 'Application submitted confirmation'
        }
    ],
    mandatoryStatements: {
        equalOpportunityEmployer: true,
        foreignEducation: true,
        reasonableAccommodation: true,
        standardOfconduct: true
    },
    ratingPlan: {
        downloadLink: null,
        fileName: null,
        sysId: null
    },
    state: 'rolling_close',
    status: 'open',
    sysId: '12345',
    vacancyCommittee: [
        {
            key: '789',
            role: 'Executive Secretary (non-voting)',
            user: {
                name: {
                    value: 'John Doe'
                }
            }
        },
        {
            key: '456',
            role: 'Chair',
            user: {
                name: {
                    value: 'Jane Doe'
                }
            }
        }
    ]
};

export const mockUser = {
    firstName: 'John',
    hasApplications: undefined,
    hasProfile: undefined,
    isChair: undefined,
    isExecSec: true,
    isReadOnlyUser: undefined,
    lastInitial: 'D',
    roles: [
        'x_g_nci_app_tracke.vacancy_manager',
        'x_g_nci_app_tracke.committee_member',
        'x_g_nci_app_tracke.user',
        'snc_internal',
    ],
    tenant: 'OWM',
    uid: '789'
}