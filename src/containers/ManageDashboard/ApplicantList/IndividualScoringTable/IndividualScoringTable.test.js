import IndividualScoringTable from './IndividualScoringTable';
import { render, screen } from '@testing-library/react';
import {
	mockRecommendedApplicants,
	mockRecommendedApplicantsTablePagination,
	mockUserRoles,
} from './IndividualScoringTableMockData';

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
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders individualScoringTable component', () => {
		mockReferenceCollection = undefined;
		mockRecommendedApplicantsTableLoading = true;

		render(
			<IndividualScoringTable
				applicants={mockRecommendedApplicants}
				pagination={mockRecommendedApplicantsTablePagination}
				loading={mockRecommendedApplicantsTableLoading} // Goes from true to false
				onTableChange={mockLoadRecommendedApplicants}
				refCollection={mockReferenceCollection}
				isVacancyManager={true}
				reloadVacancy={mockLoadVacancyAndApplicants}
			/>
		);

		// expect(screen.getByTestId('collect-references-button')).toBeInTheDocument();
	});
});
