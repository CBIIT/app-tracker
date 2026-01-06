export const mockIntialValues = {
    allowHrSpecialist: false,
    applicationDocuments: [
        {
            document: 'doc1',
        },
        {
            document: 'doc2',
        },
        {
            document: 'doc3',
        },
        {
            document: 'doc4',
        },
    ],
    appointmentPackageIndicator: '12345',
    description: '',
    numberOfCategories: 4,
    numberOfRecommendations: 3,
    referenceCollection: false,
    vacancyPoc: '12345'
};

export const mockPackageInitiators = [
    {
        email: 'john.doe@mail.com',
        name: 'John Doe',
        sys_id: '123'
    }
];

export const mockSacCodes = [
    {
        code: 'HHH00H',
        description: 'description',
        sys_id: '123'
    }
];

export const mockVacancyOptionsResponse = {
    data: {
        result: {
            ic: 'NCI',
            isOWM: true,
            locations: [
                {
                    display_value: 'Bethesda, MD',
                    value: 'bethesda_md'
                }
            ],
            number_of_categories: [1, 2, 3, 4, 5],
            number_of_recommendations: [1, 2, 3, 4, 5],
            package_initiators: [
                {
                    email: 'john.doe@mail.com',
                    name: 'John Doe',
                    sys_id: '123'
                }
            ],
            sac_codes: [
                {
                    0: 'HHH00H',
                }
            ],
            title_42_position_classification: [
                'Research Fellow',
                'Staff Scientist'
            ]
        }
    }
}
