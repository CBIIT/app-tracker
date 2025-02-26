import individualScoringTable from './IndividualScoringTable';
import { render, screen } from '@testing-library/react';
import {
	mockRecommendedApplicants,
	mockRecommendedApplicantsTablePagination,
} from './IndividualScoringTableMockData';

describe('individualScoringTable', () => {
	let mockRecommendedApplicantsTableLoading;
	let mockReferenceCollection; // Mocks the props.referenceCollection
	let mockLoadRecommendedApplicants;
	let mockLoadVacancyAndApplicants;

	beforeEach(() => {
		mockRecommendedApplicantsTableLoading = false;
		mockLoadRecommendedApplicants = jest.fn();
		mockLoadVacancyAndApplicants = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders individualScoringTable component', () => {
        mockReferenceCollection = true;
        mockRecommendedApplicantsTableLoading = true;

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

        expect(screen.getByText('Collect References')).toBeInTheDocument();

	});
});
