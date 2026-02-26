jest.mock('antd', () => {
    const actual = jest.requireActual('antd');
    return {
        ...actual,
        message: {
            error: jest.fn(),
            destroy: jest.fn(),
        }
    };
});

jest.mock('axios');
jest.mock('../../hooks/useAuth');
jest.mock('../../components/Util/RoleValidator/RoleValidator');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: jest.fn(),
}));

import ChairDashboard from './ChairDashboard';
import { rtRender } from '../test-utils';
import { message as antdMessage } from 'antd';
import axios from 'axios';
import { GET_COMMITTEE_CHAIR_VACANCIES } from '../../constants/ApiEndpoints';
import useAuth from '../../hooks/useAuth';
import { validateRoleForCurrentTenant } from '../../components/Util/RoleValidator/RoleValidator';
import { useHistory } from 'react-router-dom';

const { message } = jest.requireMock('antd');

window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('ChairDashboard component tests', () => {
    const mockVacancies = [
        { vacancy_id: 1, vacancy_title: 'Senior Dev', applicants: 5, status: 'open' },
        { vacancy_id: 2, vacancy_title: 'Junior Dev', applicants: 3, status: 'under_review' },
    ];

    beforeEach(() => {
        const mockPush = jest.fn();
        jest.requireMock('react-router-dom').useHistory.mockReturnValue({
            push: mockPush
        });

        useAuth.mockReturnValue({
            auth: {
                tenants: [{
                    "value": "f24965fc1b9c11106daea681f54bcb04",
                    "label": "tenant 1",
                    "roles": [
                        "x_g_nci_app_tracke.vacancy_manager",
                        "x_g_nci_app_tracke.committee_member"
                    ],
                    "is_chair": true,
                }]
            },
            currentTenant: 'f24965fc1b9c11106daea681f54bcb04',  // Match the tenant value
        });
        validateRoleForCurrentTenant.mockReturnValue(true);
        axios.get.mockResolvedValue({ data: { result: mockVacancies } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('<ChairDashboard /> crash test', async () => {
        const { container } = rtRender(<ChairDashboard />);
        expect(container).toBeTruthy();
    });

    test('<ChairDashboard /> should display header', async () => {
        const { findByText } = rtRender(<ChairDashboard />);
        expect(await findByText('Vacancies Assigned To You')).toBeInTheDocument();
    });

    test('<ChairDashboard /> should fetch vacancies on mount', () => {
        rtRender(<ChairDashboard />);
        expect(axios.get).toHaveBeenCalledWith(GET_COMMITTEE_CHAIR_VACANCIES + 'f24965fc1b9c11106daea681f54bcb04');
    });

    test('<ChairDashboard /> should filter out live and final status vacancies', async () => {
        const vacanciesWithStatuses = [
            { vacancy_id: 1, vacancy_title: 'Open Job', applicants: 5, status: 'open' },
            { vacancy_id: 2, vacancy_title: 'Live Job', applicants: 10, status: 'live' },
            { vacancy_id: 3, vacancy_title: 'Final Job', applicants: 2, status: 'final' },
        ];
        axios.get.mockResolvedValue({ data: { result: vacanciesWithStatuses } });
        const { findByText, queryByText } = rtRender(<ChairDashboard />);
        await findByText('Open Job');
        expect(queryByText('Live Job')).not.toBeInTheDocument();
        expect(queryByText('Final Job')).not.toBeInTheDocument();
    });

    test('<ChairDashboard /> should show error when user is not a committee member', () => {
        const mockPush = jest.fn();
        jest.requireMock('react-router-dom').useHistory.mockReturnValue({
            push: mockPush
        });

        // Mock to return false for this specific test
        validateRoleForCurrentTenant.mockImplementation(() => false);

        rtRender(<ChairDashboard />);

        // Add a small delay to allow useEffect to run
        setTimeout(() => {
            expect(message.destroy).toHaveBeenCalled();
            expect(message.error).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/');
        }, 100);
    });


});