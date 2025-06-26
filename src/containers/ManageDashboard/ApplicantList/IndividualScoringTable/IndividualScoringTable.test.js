import IndividualScoringTable from './IndividualScoringTable';
import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import {
	mockRecommendedApplicants,
	mockRecommendedApplicantsTablePagination,
	mockUserRoles,
} from './IndividualScoringTableMockData';
import {
	INDIVIDUAL_SCORING_IN_PROGRESS,
} from '../../../../constants/VacancyStates';
import useAuth from '../../../../hooks/useAuth';

jest.mock('../../../../hooks/useAuth');

describe('individualScoringTable', () => {
	let mockRecommendedApplicantsTableLoading;
	let mockReferenceCollection; // Mocks the props.referenceCollection
	let mockLoadRecommendedApplicants;
	let mockLoadVacancyAndApplicants;

	beforeEach(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(), // deprecated
				removeListener: jest.fn(), // deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
		mockLoadRecommendedApplicants = jest.fn();
		mockLoadVacancyAndApplicants = jest.fn();

				useAuth.mockReturnValue({
            auth: {
                isUserLoggedIn: true,
                user: {
                    isManager: true,
                    roles: [],
                    hasApplications: false,
                    uid: '123'
                },
                tenants: [
                    {
                        "value": "f24965fc1b9c11106daea681f54bcb04",
                        "label": "tenant 1",
                        "roles": [
                            "x_g_nci_app_tracke.vacancy_manager",
                            "x_g_nci_app_tracke.committee_member"
                        ],
                        "is_exec_sec": true,
                        "is_read_only_user": true,
                        "is_chair": true,
                        "is_hr": false,
						"properties": [{
							"name": "enableFocusArea",
							"value": "true",
						}]

						}]
                ,
            },
            currentTenant: 'f24965fc1b9c11106daea681f54bcb04',
        });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders individualScoringTable component ', () => {
		mockReferenceCollection = true;
		mockRecommendedApplicantsTableLoading = true;

		render(
			<HashRouter>
				<IndividualScoringTable
					applicants={mockRecommendedApplicants}
					pagination={mockRecommendedApplicantsTablePagination}
					loading={mockRecommendedApplicantsTableLoading} // Goes from true to false
					onTableChange={mockLoadRecommendedApplicants}
					refCollection={mockReferenceCollection}
					isVacancyManager={true}
					reloadVacancy={mockLoadVacancyAndApplicants}
				/>
			</HashRouter>
		);

		expect(screen.getByText('Applicant')).toBeInTheDocument();
		expect(screen.getByText('Email')).toBeInTheDocument();
		expect(screen.getByText('Average Score')).toBeInTheDocument();
		expect(screen.getByText('Scoring Status')).toBeInTheDocument();
		expect(screen.getByTestId('collect-references-button')).toBeInTheDocument();
		expect(screen.getByTestId('send-regret-email-button')).toBeInTheDocument();
	});

	test('renders individualScoringTable component scoring phase with focus area column', () => {
		mockReferenceCollection = true;
		mockRecommendedApplicantsTableLoading = true;

		render(
			<HashRouter>
				<IndividualScoringTable
					applicants={mockRecommendedApplicants}
					pagination={mockRecommendedApplicantsTablePagination}
					loading={mockRecommendedApplicantsTableLoading} // Goes from true to false
					onTableChange={mockLoadRecommendedApplicants}
					refCollection={mockReferenceCollection}
					isVacancyManager={true}
					reloadVacancy={mockLoadVacancyAndApplicants}
					vacancyState={INDIVIDUAL_SCORING_IN_PROGRESS}
				/>
			</HashRouter>
		);

		expect(screen.getByText('Applicant')).toBeInTheDocument();
		expect(screen.getByText('Email')).toBeInTheDocument();
		expect(screen.getByText('Focus Area')).toBeInTheDocument();
		expect(screen.getByText('Average Score')).toBeInTheDocument();
		expect(screen.getByText('Scoring Status')).toBeInTheDocument();
		expect(screen.getByTestId('collect-references-button')).toBeInTheDocument();
		expect(screen.getByTestId('send-regret-email-button')).toBeInTheDocument();
	});
});
