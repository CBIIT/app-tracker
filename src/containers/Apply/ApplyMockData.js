export const mockDefaultFormData = {
    basicInfo: {
        phonePrefix: '+1',
        businessPhonePrefix: '+1'
    },
    focusArea: [],
    address: {},
    references: [],
    applicantDocuments: [],
};

export const mockVacancyResponse = {
    data: {
        result: {
            basic_info: {
                number_of_recommendation: {label: '1', value: '1'},
                tenant: {label: 'test tenant', value: '123'},
                vacancy_title: {label: 'Test Vacancy', value: 'Test Vacancy'},
            },
            vacancy_documents: [
                {
                    is_optional: {label: 'false', value: '0'},
                    title: {label: 'Test Document', value: 'Test Document'},
                    vacancy_id: {label: 'Test Vacancy', value: '12345'},
                },
            ],
            focus_area: [
                "Biochemistry/Proteomics/Metabolomics",
                "Biomedical Engineering/Biophysics/Physics",
                "Cancer Biology",
                "Cell Biology",
                "Chemistry/Chemical Biology/Toxicology",
                "Chromosome Biology/Epigenetics/Transcription",
                "Cognitive Neuroscience",
                "Computational Biology/Bioinformatics/Biostatistics/Mathematics",
                "Developmental Biology",
                "Epidemiology/Population Sciences",
                "Genetics/Genomics",
                "Health Disparities",
                "Immunology",
                "Microbiology/Infectious diseases (non-viral)",
                "Molecular and Cellular Neuroscience",
                "Molecular Biology",
                "Molecular Pharmacology/Cell Signaling",
                "Neurodevelopment",
                "RNA Biology",
                "Social and Behavioral Sciences",
                "Stem Cells/Induced Pluripotent Stem Cells",
                "Structural Biology",
                "Synapses and Circuits",
                "Systems Biology/Physiology",
                "Translation from Pre-clinical to Clinical Research/Clinical Informatics",
                "Virology"
            ],
            exists: true
        }
    }
};

export const mockProfileResponse = {
    data: {
        result: {
            response: {
                basic_info: {
                    sys_id: '123',
                    first_name: 'John',
                    middle_name: 'Doe',
                    last_name: 'Smith',
                    email: 'john@example.com',
                    phone: '+1234567890',
                    business_phone: '+1987654321',
                    highest_level_of_education: 'PhD',
                    us_citizen: '1',
                    address: '123 Main St',
                    address_2: 'Apt 4',
                    city: 'Anytown',
                    state_province: 'CA',
                    zip_code: '12345',
                    country: 'USA',
                },
                focus_area: 'area1,area2',
                status: 200,
            },
        },
    },
};

export const mockProfileData = {
    userSysId: '123',
    basicInfo: {
        firstName: 'John',
        middleName: 'Doe',
        lastName: 'Smith',
        email: 'john@example.com',
        phonePrefix: '+1',
        phone: '234567890',
        businessPhonePrefix: '+1',
        businessPhone: '987654321',
        highestLevelEducation: 'PhD',
        isUsCitizen: 1,
        address: {
            address: '123 Main St',
            address2: 'Apt 4',
            city: 'Anytown',
            stateProvince: 'CA',
            zip: '12345',
            country: 'USA',
        },
    },
    focusArea: ['area1', 'area2'],
};

export const mockFormData = {
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
		address: {
			address: '123 Main St',
			address2: 'Apt 4',
			city: 'Anytown',
			zip: '12345',
			stateProvince: 'CA',
			country: 'USA',
		},
	},
	address: {
		address: '123 Main St',
		address2: 'Apt 4',
		city: 'Anytown',
		zip: '12345',
		stateProvince: 'CA',
		country: 'USA',
	},
	references: [
		{
			ref_sys_id: '',
			firstName: '',
			middleName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			contact: '',
			organization: '',
			title: '',
			relationship: '',
		},
	],
	applicantDocuments: [],
	sysId: '123',
};