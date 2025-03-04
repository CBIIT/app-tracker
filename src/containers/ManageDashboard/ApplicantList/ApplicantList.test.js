import ApplicantList from './ApplicantList';
import { render, screen } from '@testing-library/react';
import { mockVacancy, mockUser } from './ApplicantListMockData';
import { useParams, HashRouter } from 'react-router-dom';
import { GET_ROLLING_APPLICANT_LIST } from '../../../constants/ApiEndpoints';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));

describe('ApplicantList', () => {
	let mockLoadLatestVacancyInfo;

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
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should render ApplicantList component', () => {
        var mockOffset = 1;
        var mockLimit = 10;
        mockApi = GET_ROLLING_APPLICANT_LIST
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


        // mock the loadApplicants function in ApplicantList.js
            // mock 
	});
});
