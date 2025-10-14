import ApplicantList from './ApplicantList';
import VacancyStatus from '../../../components/UI/VacancyStatus/VacancyStatus';
import {
	render,
	screen,
	waitFor,
	fireEvent,
	userEvent,
} from '@testing-library/react';
import { useParams, HashRouter } from 'react-router-dom';
import SearchContext from '../Util/SearchContext';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import {
	GET_APPLICANT_LIST,
	GET_ROLLING_APPLICANT_LIST,
} from '../../../constants/ApiEndpoints';
import {
	mockRCVacancy,
	mockNRCVacancy,
	mockUser,
	mockGetRollingApplicantList,
	mockGetApplicantList,
	mockApplicants,
	mockSearchContextValue,
	mockApplicantFocusArea,
	mockStadtmanAuth,
	mockNonStadtmanAuth,
} from './ApplicantListMockData';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));
jest.mock('axios');
jest.mock('../../../hooks/useAuth');

describe('ApplicantList', () => {
	let mockLoadLatestVacancyInfo;
	let mockLoadApplicants;
	let mockLoadAllApplicants;
	let mockLoadRecommendedApplicants;
	let mockApi;

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
		mockLoadLatestVacancyInfo = jest.fn();
		mockLoadApplicants = jest.fn();
		mockLoadAllApplicants = jest.fn();
		mockLoadRecommendedApplicants = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should render ApplicantList component for Rolling Close Vacancy', async () => {
		mockApi = GET_ROLLING_APPLICANT_LIST;
		useParams.mockReturnValue({ id: mockRCVacancy.sysId });
		useAuth.mockReturnValue(mockNonStadtmanAuth);

		axios.get.mockResolvedValueOnce(mockGetRollingApplicantList);

		render(
			<HashRouter>
				<ApplicantList
					vacancyState={mockRCVacancy.state}
					vacancyTenant={mockRCVacancy.basicInfo.tenant}
					referenceCollection={true}
					userRoles={mockUser.roles}
					userCommitteeRole={mockUser.roles}
					reloadVacancy={mockLoadLatestVacancyInfo}
				/>
			</HashRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		expect(screen.getByText(/Filter Applications:/i)).toBeInTheDocument();
		expect(screen.getByText('Triage')).toBeInTheDocument();
		expect(screen.getByText('Individual Scoring')).toBeInTheDocument();
		expect(screen.getByText('Committee Review')).toBeInTheDocument();
		expect(screen.getByText('Selected')).toBeInTheDocument();

		expect(screen.getByText('Applicant')).toBeInTheDocument();
		expect(screen.getByText('Email')).toBeInTheDocument();
		expect(screen.getByText('Submitted')).toBeInTheDocument();
		expect(screen.getByText('Vacancy Manager Triage Decision')).toBeInTheDocument();
		expect(screen.getByText('Chair Triage Decision')).toBeInTheDocument();
		expect(screen.getByText('Reference Status')).toBeInTheDocument();

		waitFor(() => {
			expect(screen.getByText(/Doe, John/i)).toBeInTheDocument();
			expect(screen.getByText(/user@mail.com/i)).toBeInTheDocument();
			expect(screen.getByText(/Collect References/i)).toBeInTheDocument();
			expect(screen.getByText(/Send Regret Email/i)).toBeInTheDocument();
			expect(screen.getByText(/2 out of 3/i)).toBeInTheDocument();
		});
	});

	test('should render ApplicantList component for Non-Rolling Close Vacancy', async () => {
		mockApi = GET_APPLICANT_LIST;
		useParams.mockReturnValue({ id: mockNRCVacancy.sysId });
		useAuth.mockReturnValue(mockNonStadtmanAuth);

		axios.get.mockResolvedValueOnce(mockGetApplicantList);

		render(
			<HashRouter>
				<ApplicantList
					vacancyState={mockNRCVacancy.state}
					vacancyTenant={mockNRCVacancy.basicInfo.tenant}
					referenceCollection={true}
					userRoles={mockUser.roles}
					userCommitteeRole={mockUser.roles}
					reloadVacancy={mockLoadLatestVacancyInfo}
				/>
			</HashRouter>
		)

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		expect(screen.getByText('Email')).toBeInTheDocument();
		expect(screen.getByText('Submitted')).toBeInTheDocument();
		expect(screen.getByText('Vacancy Manager Triage Decision')).toBeInTheDocument();
		expect(screen.getByText('Chair Triage Decision')).toBeInTheDocument();
		expect(screen.getByText('Reference Status')).toBeInTheDocument();
		
		waitFor(() => {
			expect(screen.getByText(/Doe, John/i)).toBeInTheDocument();
			expect(screen.getByText(/user@mail.com/i)).toBeInTheDocument();
			expect(screen.getByText(/Collect References/i)).toBeInTheDocument();
			expect(screen.getByText(/Send Regret Email/i)).toBeInTheDocument();
			expect(screen.getByText(/1 out of 3/i)).toBeInTheDocument();
		});
	});

	test('should render PATS reminder text for set close date vacancies in the Voting Complete state', async () => {
		mockApi = GET_APPLICANT_LIST;
		useParams.mockReturnValue({ id: mockNRCVacancy.sysId });

		axios.get
			.mockResolvedValueOnce(mockApplicantFocusArea)
			.mockResolvedValueOnce(mockGetApplicantList);

		render(
			<HashRouter>
				<VacancyStatus state={mockNRCVacancy.state} />
				<ApplicantList
					vacancyTenant={mockNRCVacancy.basicInfo.tenant}
					referenceCollection={true}
					userRoles={mockUser.roles}
					userCommitteeRole={mockUser.roles}
					reloadVacancy={mockLoadLatestVacancyInfo}
				/>
			</HashRouter>
		);

		waitFor(() => {
			const selectedTab = screen.getByText('SELECTED');
			expect(selectedTab).toBeInTheDocument();
			fireEvent.click(screen.getByText('SELECTED'));
			const patsReminder = screen.getByText(
				'REMINDER: Once an individual has been marked selected, a New Appointment package will be prompted in the PATS system with the Position Classification, Organizational Code, and PATS Initiator identified in the Basic Vacancy Information section.'
			);
			expect(patsReminder).toBeInTheDocument();
		});
	});

	test('pagination displays correct number of pages and responds to page change', async () => {
		axios.get
			.mockResolvedValueOnce(mockApplicantFocusArea)
			.mockResolvedValueOnce(mockGetApplicantList);

		useParams.mockReturnValue({ id: 'test-sysid' });

		render(
			<SearchContext.Provider value={mockSearchContextValue}>
				<HashRouter>
					<ApplicantList
						vacancyState={'triage'}
						vacancyTenant={'NCI'}
						referenceCollection={false}
						userRoles={mockUser.roles}
						userCommitteeRole={mockUser.roles}
						reloadVacancy={mockLoadLatestVacancyInfo}
					/>
				</HashRouter>
			</SearchContext.Provider>
		);

		waitFor(() => {
			expect(screen.getByText(/1/i)).toBeInTheDocument();
			expect(screen.getByText(/5/i)).toBeInTheDocument();
			fireEvent.click(screen.getByText(/2/i));
			expect(axios.get).toHaveBeenCalled();
		});
	});

	test('shows the 10, 25, 50 page size options', async () => {
		axios.get
			.mockResolvedValueOnce(mockApplicantFocusArea)
			.mockResolvedValueOnce(mockGetApplicantList);
		useParams.mockReturnValue({ id: 'test-sysid' });

		render(
			<SearchContext.Provider value={mockSearchContextValue}>
				<HashRouter>
					<ApplicantList
						vacancyState={'triage'}
						vacancyTenant={'NCI'}
						referenceCollection={false}
						userRoles={mockUser.roles}
						userCommitteeRole={mockUser.roles}
						reloadVacancy={mockLoadLatestVacancyInfo}
					/>
				</HashRouter>
			</SearchContext.Provider>
		);

		waitFor(() => {
			expect(screen.getByText('10 / page')).toBeInTheDocument();
			fireEvent.click(screen.getByText('10 / page'));
			expect(screen.getByText('25 / page')).toBeInTheDocument();
			expect(screen.getByTestId('50 / page')).toBeInTheDocument();
		});
	});

	test('search filters applicants', async () => {
		// Arrange: mock applicants and axios
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					applicants: mockApplicants,
					totalCount: mockApplicants.length,
					pageSize: 25,
				},
			},
		});
		useParams.mockReturnValue({ id: 'test-sysid' });

		render(
			<SearchContext.Provider value={mockSearchContextValue}>
				<HashRouter>
					<ApplicantList
						vacancyState={'triage'}
						vacancyTenant={'NCI'}
						referenceCollection={false}
						userRoles={mockUser.roles}
						userCommitteeRole={mockUser.roles}
						reloadVacancy={mockLoadLatestVacancyInfo}
					/>
				</HashRouter>
			</SearchContext.Provider>
		);

		waitFor(() => {
			const searchIcons = screen.getAllByLabelText('search');
			fireEvent.click(searchIcons[0]);

			const searchInput = screen.getByPlaceholderText(/search/i);
			userEvent.type(searchInput, 'Alice');
			userEvent.keyboard('{enter}');

			// Assert axios.get called with search param
			expect(axios.get).toHaveBeenCalledWith(
				expect.stringContaining('search=alice')
			);
		});
	});

	test('sorts applicants by name when clicking the Applicant column header', async () => {
		// Arrange: mock applicants in reverse order, so default sort will show Alice first
		const applicants = [
			{ sys_id: '2', applicant_name: 'Zoe', applicant_email: 'zoe@test.com' },
			{
				sys_id: '1',
				applicant_name: 'Alice',
				applicant_email: 'alice@test.com',
			},
		];
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					applicants,
					totalCount: applicants.length,
					pageSize: 10,
				},
			},
		});
		useParams.mockReturnValue({ id: 'test-sysid' });

		render(
			<SearchContext.Provider value={mockSearchContextValue}>
				<HashRouter>
					<ApplicantList
						vacancyState={'triage'}
						vacancyTenant={'NCI'}
						referenceCollection={false}
						userRoles={mockUser.roles}
						userCommitteeRole={mockUser.roles}
						reloadVacancy={mockLoadLatestVacancyInfo}
					/>
				</HashRouter>
			</SearchContext.Provider>
		);

		waitFor(() => {
			const rows = screen.getAllByRole('row');
			expect(rows[1]).toHaveTextContent(/Alice/i);

			const applicantHeader = screen.getByRole('columnheader', {
				name: /applicant/i,
			});
			fireEvent.click(applicantHeader);

			const rowsDesc = screen.getAllByRole('row');
			expect(rowsDesc[1]).toHaveTextContent(/Zoe/i);
		});
	});
});
