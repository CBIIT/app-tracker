import ApplicantList from './ApplicantList';
import VacancyStatus from '../../../components/UI/VacancyStatus/VacancyStatus';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useParams, HashRouter } from 'react-router-dom';
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
	});
	test('should render PATS reminder text for set close date vacancies in the Voting Complete state', async () => {
		var mockOffset = 1;
		var mockLimit = 10;
		mockApi = GET_APPLICANT_LIST;
		useParams.mockReturnValue({ id: mockNRCVacancy.sysId });

		render(
			<HashRouter>
				<VacancyStatus state={mockNRCVacancy.state}/>
				<ApplicantList
					vacancyTenant={mockNRCVacancy.basicInfo.tenant}
					referenceCollection={true}
					userRoles={mockUser.roles}
					userCommitteeRole={mockUser.roles}
					reloadVacancy={mockLoadLatestVacancyInfo}
				/>
			</HashRouter>
		);

		await axios.get.mockImplementationOnce(() => Promise.resolve(mockGetApplicantList));
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
			const patsReminder = screen.getByText('REMINDER: Once an individual has been marked selected, a New Appointment package will be prompted in the PATS system with the Position Classification, Organizational Code, and PATS Initiator identified in the Basic Vacancy Information section.');
			expect(patsReminder).toBeInTheDocument();
		});
		
	});
});
