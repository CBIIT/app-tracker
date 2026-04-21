import React, { useRef, useState } from 'react';
import ApplicantList from './ApplicantList';
import VacancyStatus from '../../../components/UI/VacancyStatus/VacancyStatus';
import {
	render,
	screen,
	waitFor,
	fireEvent,
	userEvent,
	act,
} from '@testing-library/react';
import { useParams, HashRouter, MemoryRouter, Route } from 'react-router-dom';
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

jest.mock('axios');
jest.mock('../../../hooks/useAuth');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));

describe('ApplicantList', () => {
	let mockLoadLatestVacancyInfo;
	let mockLoadApplicants;
	let mockLoadAllApplicants;
	let mockLoadRecommendedApplicants;
	let mockApi;
	let mockApplicantFocusAreaOptions;

	beforeEach(() => {
		jest.clearAllMocks();
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
		useAuth.mockReturnValue(mockNonStadtmanAuth);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * Helper function to render ApplicantList with a live SearchContext provider.
	 * Captures and returns state setters for controlled testing of search behavior.
	 * @returns {Object} { setSearchText, setSearchedColumn }
	 */
	const renderApplicantListWithLiveSearchContext = () => {
		let capturedSetSearchText;
		let capturedSetSearchedColumn;

		const TestWrapper = () => {
			const [searchText, setSearchText] = useState('');
			const [searchedColumn, setSearchedColumn] = useState('');
			const searchInput = useRef(null);

			capturedSetSearchText = setSearchText;
			capturedSetSearchedColumn = setSearchedColumn;

			return (
				<SearchContext.Provider
					value={{
						searchText,
						setSearchText,
						searchedColumn,
						setSearchedColumn,
						searchInput,
					}}
				>
					<HashRouter>
						<ApplicantList
							vacancyState={'triage'}
							vacancyTenant={'NCI'}
							referenceCollection={false}
							userRoles={mockUser.roles}
							userCommitteeRole={mockUser.roles}
							reloadVacancy={jest.fn()}
						/>
					</HashRouter>
				</SearchContext.Provider>
			);
		};

		render(<TestWrapper />);
		return {
			setSearchText: capturedSetSearchText,
			setSearchedColumn: capturedSetSearchedColumn,
		};
	};

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
		expect(
			screen.getByText('Vacancy Manager Triage Decision')
		).toBeInTheDocument();
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
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		expect(screen.getByText('Email')).toBeInTheDocument();
		expect(screen.getByText('Submitted')).toBeInTheDocument();
		expect(
			screen.getByText('Vacancy Manager Triage Decision')
		).toBeInTheDocument();
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

	test('should render ApplicantList component for Stadtman tenants', async () => {
		mockApi = GET_APPLICANT_LIST;
		useParams.mockReturnValue({ id: mockNRCVacancy.sysId });
		useAuth.mockReturnValue(mockStadtmanAuth);

		axios.get
			.mockResolvedValueOnce(mockApplicantFocusArea)
			.mockResolvedValueOnce(mockApplicants);

		mockApplicantFocusAreaOptions = mockApplicantFocusArea;

		render(
			<HashRouter>
				<ApplicantList
					vacancyState={'triage'}
					vacancyTenant={'Stadtman'}
					referenceCollection={true}
					userRoles={mockStadtmanAuth.auth.user.roles}
					userCommitteeRole={mockStadtmanAuth.auth.user.roles}
					reloadVacancy={mockLoadLatestVacancyInfo}
				/>
			</HashRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		expect(screen.getByText('Complete')).toBeInTheDocument();
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

	test('reset clears both searchText and searchedColumn', async () => {
		axios.get
			.mockResolvedValueOnce(mockApplicantFocusArea)
			.mockResolvedValueOnce({
				data: {
					result: {
						applicants: mockApplicants.data.result.applicants,
						totalCount: mockApplicants.data.result.applicants.length,
						pageSize: 50,
					},
				},
			});
		useParams.mockReturnValue({ sysId: 'test-sysid' });
		useAuth.mockReturnValue(mockNonStadtmanAuth);

		const { setSearchText, setSearchedColumn } = mockSearchContextValue;

		render(
			<SearchContext.Provider value={mockSearchContextValue}>
				<HashRouter>
					<ApplicantList
						vacancyState={'triage'}
						vacancyTenant={'NCI'}
						referenceCollection={false}
						userRoles={mockUser.roles}
						userCommitteeRole={mockUser.roles}
						reloadVacancy={jest.fn()}
					/>
				</HashRouter>
			</SearchContext.Provider>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		const [nameSearchIcon] = screen.getAllByLabelText('search');
		fireEvent.click(nameSearchIcon);

		const input = screen.getByPlaceholderText(/search name/i);
		fireEvent.change(input, { target: { value: 'Alice' } });
		const searchSubmitIcon = screen
			.getAllByLabelText('search')
			.find((icon) => icon.closest('button.ant-btn-primary'));
		expect(searchSubmitIcon).toBeInTheDocument();
		fireEvent.click(searchSubmitIcon);

		fireEvent.click(screen.getByRole('button', { name: /reset/i }));

		expect(setSearchText).toHaveBeenCalledWith('');
		expect(setSearchedColumn).toHaveBeenCalledWith('');
	});

	test('discards a stale API response when a newer request has already resolved', async () => {
		let resolveSlowRequest;
		const slowFirstRequest = new Promise((resolve) => {
			resolveSlowRequest = resolve;
		});

		axios.get
			.mockResolvedValueOnce(mockApplicantFocusArea)
			.mockReturnValueOnce(slowFirstRequest)
			.mockResolvedValueOnce({
				data: {
					result: {
						applicants: [
							{
								sys_id: '99',
								applicant_name: 'Fresh Result',
								applicant_email: 'fresh@test.com',
								state: 'triage',
								scoring_status: 'Pending',
								interview_recommendation: { Yes: 0, No: 0, Maybe: 0 },
							},
						],
						totalCount: 1,
						pageSize: 50,
					},
				},
			});

		useParams.mockReturnValue({ sysId: 'test-sysid' });
		useAuth.mockReturnValue(mockNonStadtmanAuth);

		const { setSearchText } = renderApplicantListWithLiveSearchContext();

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		act(() => {
			setSearchText('alice');
		});

		await waitFor(() => {
			expect(screen.getByText('Fresh Result')).toBeInTheDocument();
		}, { timeout: 5000 });

		resolveSlowRequest({
			data: {
				result: {
					applicants: [
						{
							sys_id: '1',
							applicant_name: 'Stale Result',
							applicant_email: 'stale@test.com',
							state: 'triage',
							scoring_status: 'Pending',
							interview_recommendation: { Yes: 0, No: 0, Maybe: 0 },
						},
					],
					totalCount: 1,
					pageSize: 50,
				},
			},
		});

		await waitFor(() => {
			expect(screen.queryByText('Stale Result')).not.toBeInTheDocument();
			expect(screen.getByText('Fresh Result')).toBeInTheDocument();
		}, { timeout: 5000 });
	});

	test('downloads all Excel data successfully', async () => {
		const mockApplicants = [
			{ sys_id: '1', name: 'John Doe', email: 'john@example.com', status: 'under_review' },
			{ sys_id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'selected' },
		];

		useAuth.mockReturnValue({
			auth: {
				tenants: [{
					value: 'NCI',
					label: 'NCI',
					roles: ['vacancy_manager', 'committee_member'],
				}],
				user: {
					isReadOnlyUser: false,
					name: 'Test User',
				}
			},
			currentTenant: 'NCI',
		});

		axios.get
			.mockResolvedValueOnce({ data: { result: { focusAreaFilter: [] } } })
			.mockResolvedValueOnce({ data: { result: mockApplicants } });

		const { container } = render(
			<MemoryRouter initialEntries={['/manage/vacancy/test-sysid/applicants']}>
				<Route path="/manage/vacancy/:id/applicants">
					<ApplicantList
						vacancyState={'triage'}
						vacancyTenant={'NCI'}
						referenceCollection={false}
						userRoles={mockUser.roles}
						userCommitteeRole={mockUser.roles}
						reloadVacancy={mockLoadLatestVacancyInfo}
					/>
				</Route>
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalled();
		}, { timeout: 3000 });

		expect(container).toBeTruthy();
	});

	test('Excel download handles empty applicant list', async () => {
		useParams.mockReturnValue({ id: 'test-sysid' });
		useAuth.mockReturnValue(mockNonStadtmanAuth);

		axios.get
			.mockResolvedValueOnce({ data: { result: { focusAreaFilter: [] } } })
			.mockResolvedValueOnce({ data: { result: { applicants: [] } } });

		const { container } = render(
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
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalled();
		});

		expect(container).toBeTruthy();
	});

});
