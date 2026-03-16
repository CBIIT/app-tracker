import ApplicantList from './ApplicantList';
import VacancyStatus from '../../../components/UI/VacancyStatus/VacancyStatus';
import {
	render,
	screen,
	waitFor,
	fireEvent,
	userEvent,
	within,
} from '@testing-library/react';
import {
	GET_APPLICANT_LIST,
	GET_ROLLING_APPLICANT_LIST,
	GET_APPLICANT_FOCUS_AREA,
} from '../../../constants/ApiEndpoints';
import { HashRouter } from 'react-router-dom';
import {
	mockApplicants,
	mockTablePagination,
	mockFocusArea,
} from './ApplicantListMockData';
import { INDIVIDUAL_SCORING_IN_PROGRESS } from '../../../constants/VacancyStates';
import useAuth from '../../../hooks/useAuth';

jest.mock('../../../hooks/useAuth');

describe('ApplicantList', () => {
	var mockLoadApplicants;
	var mockTableLoading;
	var mockFilter;

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

		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: true,
				user: {
					isManager: true,
					isCommitteeMember: true,
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

		mockLoadApplicants = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders the ApplicantList component', () => {
		mockTableLoading = false;
		mockFilter = null;
		render(
			<HashRouter>
				<ApplicantList
					applicants={mockApplicants}
					pagination={mockTablePagination}
					onTableChange={mockLoadApplicants}
					loading={mockTableLoading}
					filter={mockFilter}
					VacancyStatus={INDIVIDUAL_SCORING_IN_PROGRESS}
					focusArea={mockFocusArea}
				/>
			</HashRouter>
		);

		waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
			expect(screen.getByText('Applicant')).toBeInTheDocument();
			expect(screen.getByText('Email')).toBeInTheDocument();
			expect(screen.getByText('Raw Score')).toBeInTheDocument();
			expect(screen.getByText('Average Score')).toBeInTheDocument();
			expect(screen.getByText('Recommend Interview?')).toBeInTheDocument();
			expect(screen.getByText(/Focus Area/i)).toBeInTheDocument();
		});

		waitFor(() => {
			expect(within(rowsDesc[1]).getByText('Alice Smith')).toBeInTheDocument();
			expect(within(rowsDesc[2]).getByText('Bob Johnson')).toBeInTheDocument();
		});
	});

	test('displays all Focus Area filter options', () => {
		mockTableLoading = false;
		mockFilter = null;
		render(
			<HashRouter>
				<ApplicantList
					applicants={mockApplicants}
					pagination={mockTablePagination}
					onTableChange={mockLoadApplicants}
					loading={mockTableLoading}
					filter={mockFilter}
					VacancyStatus={INDIVIDUAL_SCORING_IN_PROGRESS}
					focusArea={mockFocusArea}
				/>
			</HashRouter>
		);

		waitFor(() => {
			expect(screen.getByText(/Focus Area/i)).toBeInTheDocument();

			const focusAreaHeader = screen.getByText('Focus Area');
			const th = focusAreaHeader.closest('th');
			const filterButton = within(th).getByLabelText('filter');
			fireEvent.click(filterButton);

			const filterDropdown = document.querySelector(
				'.ant-table-filter-dropdown'
			);
			expect(filterDropdown).toBeInTheDocument();

			expect(within(filterDropdown).getAllByText(/Genomics/i)).toHaveLength(1);
			expect(within(filterDropdown).getAllByText(/Cancer Biology/i)).toHaveLength(1);
			expect(within(filterDropdown).getAllByText(/Immunology/i)).toHaveLength(1);
			expect(within(filterDropdown).getAllByText(/Bioinformatics/i)).toHaveLength(1);
			expect(within(filterDropdown).getAllByText(/Molecular Biology/i)).toHaveLength(1);
			expect(within(filterDropdown).getAllByText(/Molecular Biology/i)).toHaveLength(1);
			expect(within(filterDropdown).getAllByText(/Virology/i)).toHaveLength(1);
			expect(within(filterDropdown).getAllByText(/RNA Biology/i)).toHaveLength(1);
		});
	});
});
