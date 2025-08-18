import ApplicantList from './ApplicantList';
import VacancyStatus from '../../../components/UI/VacancyStatus/VacancyStatus';
import {
	render,
	screen,
	act,
	waitFor,
	fireEvent,
	userEvent,
} from '@testing-library/react';
import { useParams, HashRouter } from 'react-router-dom';
import SearchContext from '../Util/SearchContext';
import axios from 'axios';
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
} from './ApplicantListMockData';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));
jest.mock('axios');

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

	test('should render ApplicantList component', async () => {
		var mockOffset = 1;
		var mockLimit = 10;
		mockApi = GET_ROLLING_APPLICANT_LIST;
		useParams.mockReturnValue({ id: mockRCVacancy.sysId });
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

		await axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockGetRollingApplicantList)
		);
		const rollingApplicantList = await axios.get(mockApi, {
			sysId: mockRCVacancy.sysId,
			offset: mockOffset,
			limit: mockLimit,
		});

		expect(rollingApplicantList).toEqual(mockGetRollingApplicantList);
		expect(screen.getByTestId('applicant-table')).toBeInTheDocument();

		expect(screen.getByText('Applicant')).toBeInTheDocument();
		expect(screen.getByText('Email')).toBeInTheDocument();
		const vmTriage = screen.getByText('Vacancy Manager Triage Decision');
		expect(vmTriage).toBeInTheDocument();
		const chairTriage = screen.getByText('Chair Triage Decision');
		expect(chairTriage).toBeInTheDocument();
		const referenceStatus = screen.getByText('Reference Status');
		expect(referenceStatus).toBeInTheDocument();

		waitFor(() => {
			const applicantName = screen.getByText(/Doe, John/i);
			expect(applicantName).toBeInTheDocument();
			const email = screen.getByText(/user@mail.com/i);
			expect(email).toBeInTheDocument();
			const collectReferences = screen.getByText(/Collect References/i);
			expect(collectReferences).toBeInTheDocument();
			const sendRegretEmail = screen.getByText(/Send Regret Email/i);
			expect(sendRegretEmail).toBeInTheDocument();
			expect(screen.getByText(/2 out of 3/i)).toBeInTheDocument();
		});
	});

	test('should render PATS reminder text for set close date vacancies in the Voting Complete state', async () => {
		var mockOffset = 1;
		var mockLimit = 10;
		mockApi = GET_APPLICANT_LIST;
		useParams.mockReturnValue({ id: mockNRCVacancy.sysId });

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

		await axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockGetApplicantList)
		);
		const applicantList = await axios.get(mockApi, {
			sysId: mockNRCVacancy.sysId,
			offset: mockOffset,
			limit: mockLimit,
		});
		expect(applicantList).toEqual(mockGetApplicantList);

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
		// Arrange: 50 applicants, pageSize 10
		const applicants = Array.from({ length: 50 }, (_, i) => ({
			sys_id: `${i + 1}`,
			applicant_name: `Applicant ${i + 1}`,
			applicant_email: `applicant${i + 1}@test.com`,
		}));
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					applicants,
					totalCount: 50,
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

		await waitFor(() =>
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument()
		);

		waitFor(() => {
			expect(screen.getByText(/1/i)).toBeInTheDocument();
			expect(screen.getByText(/5/i)).toBeInTheDocument();
			fireEvent.click(screen.getByText(/2/i));
			expect(axios.get).toHaveBeenCalled();
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

		await waitFor(() =>
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument()
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
});
