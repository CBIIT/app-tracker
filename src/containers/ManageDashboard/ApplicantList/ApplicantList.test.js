import ApplicantList from './ApplicantList';
import { render, screen } from '@testing-library/react';
import { mockVacancy, mockUser } from './ApplicantListMockData';
import { useParams } from 'react-router-dom';

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
        render (
            <ApplicantList
                vacancyState={mockVacancy.state}
                vacancyTenant={mockVacancy.basicInfo.tenant}
                referenceCollection={mockVacancy.basicInfo.referenceCollection}
                userRoles={mockUser.roles}
                userCommitteeRole={'Executive Secretary (non-voting)'}
                reloadVacancy={mockLoadLatestVacancyInfo}
            />
        );
    });
})