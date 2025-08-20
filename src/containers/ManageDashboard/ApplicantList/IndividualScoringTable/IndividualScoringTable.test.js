import IndividualScoringTable from './IndividualScoringTable';
import {
	render,
	screen,
	fireEvent,
	within,
	waitFor,
} from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import {
	mockRecommendedApplicants,
	mockRecommendedApplicantsTablePagination,
	mockApplicantsWithFocusAreas,
	mockApplicantsWithFocusAreasWithRepeat,
	mockApplicants,
} from './IndividualScoringTableMockData';
import { INDIVIDUAL_SCORING_IN_PROGRESS } from '../../../../constants/VacancyStates';
import useAuth from '../../../../hooks/useAuth';
import axios from 'axios';

jest.mock('../../../../hooks/useAuth');
jest.mock('axios');

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
					uid: '123',
				},
				tenants: [
					{
						value: 'f24965fc1b9c11106daea681f54bcb04',
						label: 'tenant 1',
						roles: [
							'x_g_nci_app_tracke.vacancy_manager',
							'x_g_nci_app_tracke.committee_member',
						],
						is_exec_sec: true,
						is_read_only_user: true,
						is_chair: true,
						is_hr: false,
						properties: [
							{
								name: 'enableFocusArea',
								value: 'true',
							},
						],
					},
				],
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
		expect(screen.getByText('Reference Status')).toBeInTheDocument();
	});

	test('displays all Focus Area filter options', async () => {
		useAuth.mockReturnValue({
			auth: {
				tenants: [
					{
						value: 'tenant1',
						properties: [{ name: 'enableFocusArea', value: 'true' }],
					},
				],
			},
			currentTenant: 'tenant1',
		});
		render(
			<HashRouter>
				<IndividualScoringTable
					applicants={mockApplicantsWithFocusAreas}
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

		// Find the Focus Area column header and open the filter dropdown, click the filter button
		const focusAreaHeader = screen.getByText('Focus Area');
		const th = focusAreaHeader.closest('th');
		const filterButton = within(th).getByLabelText('filter');
		fireEvent.click(filterButton);

		const filterDropdown = document.querySelector('.ant-table-filter-dropdown');
		expect(filterDropdown).toBeInTheDocument();

		// Check that all unique focus area options are displayed
		expect(within(filterDropdown).getAllByText(/Biology/i)).toHaveLength(11);
		expect(within(filterDropdown).getAllByText(/Genetics/i)).toHaveLength(2);
		expect(within(filterDropdown).getAllByText(/Chemistry/i)).toHaveLength(2);
		expect(within(filterDropdown).getAllByText(/Physics/i)).toHaveLength(1);
	});

	test('sorts the Applicant column in ascending and descending order', async () => {
		mockReferenceCollection = true;
		mockRecommendedApplicantsTableLoading = false;

		render(
			<HashRouter>
				<IndividualScoringTable
					applicants={mockApplicantsWithFocusAreasWithRepeat}
					pagination={mockRecommendedApplicantsTablePagination}
					loading={mockRecommendedApplicantsTableLoading}
					onTableChange={mockLoadRecommendedApplicants}
					refCollection={mockReferenceCollection}
					isVacancyManager={true}
					reloadVacancy={mockLoadVacancyAndApplicants}
				/>
			</HashRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		waitFor(() => {
			expect(within(rowsDesc[2]).getByText('Alice')).toBeInTheDocument();
			expect(within(rowsDesc[1]).getByText('Bob')).toBeInTheDocument();

			const applicantHeader = screen.getByRole('columnheader', {
				name: /applicant/i,
			});
			fireEvent.click(applicantHeader);
			expect(axios.get).toHaveBeenCalled();

			expect(within(rowsDesc[1]).getByText('Bob')).toBeInTheDocument();
			expect(within(rowsDesc[2]).getByText('Alice')).toBeInTheDocument();
		});
	});

	// This test may not be needed as we are not using applicants focus area. We are using the Focus Area set in the enableFocusArea file.
	// test('displays all Focus Area filter options remove duplicates', async () => {
	// 	useAuth.mockReturnValue({
	// 		auth: {
	// 			tenants: [
	// 				{
	// 					value: 'tenant1',
	// 					properties: [{ name: 'enableFocusArea', value: 'true' }],
	// 				},
	// 			],
	// 		},
	// 		currentTenant: 'tenant1',
	// 	});
	// 	render(
	// 		<HashRouter>
	// 			<IndividualScoringTable
	// 				applicants={mockApplicantsWithFocusAreasWithRepeat}
	// 				pagination={mockRecommendedApplicantsTablePagination}
	// 				loading={mockRecommendedApplicantsTableLoading} // Goes from true to false
	// 				onTableChange={mockLoadRecommendedApplicants}
	// 				refCollection={mockReferenceCollection}
	// 				isVacancyManager={true}
	// 				reloadVacancy={mockLoadVacancyAndApplicants}
	// 				vacancyState={INDIVIDUAL_SCORING_IN_PROGRESS}
	// 			/>
	// 		</HashRouter>
	// 	);

	// 	// Find the Focus Area column header and open the filter dropdown, click the filter button
	// 	const focusAreaHeader = screen.getByText('Focus Area');
	// 	const th = focusAreaHeader.closest('th');
	// 	const filterButton = within(th).getByLabelText('filter');
	// 	fireEvent.click(filterButton);

	// 	const filterDropdown = document.querySelector('.ant-table-filter-dropdown');
	// 	expect(filterDropdown).toBeInTheDocument();

	// 	// Check that all unique focus area options are displayed
	// 	expect(within(filterDropdown).getByText('Biology')).toBeInTheDocument();
	// 	expect(within(filterDropdown).getByText('Genetics')).toBeInTheDocument();
	// 	expect(within(filterDropdown).getByText('Chemistry')).toBeInTheDocument();

	// 	expect(within(filterDropdown).queryAllByText('Biology').length).toBe(1);
	// });
});
