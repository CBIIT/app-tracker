import individualScoringTable from './IndividualScoringTable';
import { render, screen } from '@testing-library/react';
import {
	mockRecommendedApplicants,
	mockRecommendedApplicantsTablePagination,
    mockUserRoles
} from './IndividualScoringTableMockData';
import { OWM_TEAM } from '../../../../constants/Roles';

describe('individualScoringTable', () => {
	let mockRecommendedApplicantsTableLoading;
	let mockReferenceCollection; // Mocks the props.referenceCollection
	let mockLoadRecommendedApplicants;
	let mockLoadVacancyAndApplicants;

	beforeEach(() => {
		mockLoadRecommendedApplicants = jest.fn();
		mockLoadVacancyAndApplicants = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders individualScoringTable component', () => {
        mockReferenceCollection = true;
        mockRecommendedApplicantsTableLoading = 'true';

		render(
			<individualScoringTable
				applicants={mockRecommendedApplicants}
				pagination={mockRecommendedApplicantsTablePagination}
				loading={mockRecommendedApplicantsTableLoading}
				onTableChange={mockLoadRecommendedApplicants}
				refCollection={mockReferenceCollection}
				isVacancyManager={true}
				reloadVacancy={mockLoadVacancyAndApplicants}
			/>
		);

        expect(screen.getByTestId('collect-references-button')).toBeInTheDocument();

	});
});
