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

export const mockVacancyOptionsResponse = {
    data: {
        result: {
            ic: 'NCI',
            isOWM: true,
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
        }
    }
}
