import ApplicantList from './ApplicantList';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useParams, HashRouter } from 'react-router-dom';
import axios from 'axios';
import { GET_ROLLING_APPLICANT_LIST } from '../../../constants/ApiEndpoints';
import { 
	mockVacancy, 
	mockUser, 
	mockGetRollingApplicantList 
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
		useParams.mockReturnValue({ id: mockVacancy.sysId });
		mockLoadLatestVacancyInfo = jest.fn();
		mockLoadApplicants = jest.fn();
		mockLoadAllApplicants = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should render ApplicantList component', async () => {
        var mockOffset = 1;
        var mockLimit = 10;
        var mockApi = GET_ROLLING_APPLICANT_LIST
		render(
			<HashRouter>
				<ApplicantList
					vacancyState={mockVacancy.state}
					vacancyTenant={mockVacancy.basicInfo.tenant}
					referenceCollection={true}
					userRoles={mockUser.roles}
					userCommitteeRole={mockUser.roles}
					reloadVacancy={mockLoadLatestVacancyInfo}
				/>
			</HashRouter>
		);

		waitFor(() => {
			axios.get.mockImplementationOnce(() => Promise.resolve(mockGetRollingApplicantList));
			const rollingApplicantList = axios.get(mockApi, { sysId: mockVacancy.sysId, offset: mockOffset, limit: mockLimit });
			expect(rollingApplicantList).toEqual(mockGetRollingApplicantList);
		})
		
		expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		
	});
});
