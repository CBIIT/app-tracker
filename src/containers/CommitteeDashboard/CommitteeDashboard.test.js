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
    useLocation: jest.fn(),
}));

import CommitteeDashboard from './CommitteeDashboard';
import { rtRender } from '../test-utils';
import { waitFor, screen } from '@testing-library/react';
import { message as antdMessage } from 'antd';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { validateRoleForCurrentTenant, isExecSec } from '../../components/Util/RoleValidator/RoleValidator';
import { useHistory, useLocation } from 'react-router-dom';

const { message } = jest.requireMock('antd');

window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('CommitteeDashboard component tests', () => {
    const mockTenants = [{
        value: "tenant1",
        label: "Test Tenant",
        roles: ["x_g_nci_app_tracke.committee_member"],
        is_chair: true,
    }];

    const mockData = [
        { vacancy_id: 1, vacancy_title: 'Senior Dev', applicants: 5, status: 'open', user_role: 'committee_member' },
        { vacancy_id: 2, vacancy_title: 'Junior Dev', applicants: 3, status: 'under_review', user_role: 'committee_member' },
    ];

    beforeEach(() => {
        const mockPush = jest.fn();
        jest.requireMock('react-router-dom').useHistory.mockReturnValue({
            push: mockPush
        });

        useAuth.mockReturnValue({
            auth: { 
                tenants: mockTenants,
                user: { isReadOnlyUser: false }
            },
            currentTenant: 'tenant1',
        });
        
        useLocation.mockReturnValue({
            pathname: '/committee-dashboard'
        });
        
        validateRoleForCurrentTenant.mockReturnValue(true);
        isExecSec.mockReturnValue(false);
        axios.get.mockResolvedValue({ data: { result: mockData } });
        
        // jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('<CommitteeDashboard /> crash test', () => {
        const { container } = rtRender(<CommitteeDashboard />);
        expect(container).toBeTruthy();
    });

    test('<CommitteeDashboard /> should render successfully with access', async () => {
        const { container } = rtRender(<CommitteeDashboard />);
        
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        }, { timeout: 3000 });
        
        expect(container).toBeTruthy();
    });

    test('<CommitteeDashboard /> should show error when user lacks access', async () => {
        const mockPush = jest.fn();
        jest.requireMock('react-router-dom').useHistory.mockReturnValue({
            push: mockPush
        });

        // Mock to return false for this specific test
        validateRoleForCurrentTenant.mockImplementation(() => false);
        isExecSec.mockReturnValue(false);
        
        rtRender(<CommitteeDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Sorry! You do not have committee member access in the selected tenant.')).toBeInTheDocument();
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });

    test('<CommitteeDashboard /> should call validateRoleForCurrentTenant on load', async () => {
        rtRender(<CommitteeDashboard />);
        
        await waitFor(() => {
            expect(validateRoleForCurrentTenant).toHaveBeenCalled();
        });
    });

    test('<CommitteeDashboard /> should allow access for exec sec', async () => {
        validateRoleForCurrentTenant.mockReturnValue(false);
        isExecSec.mockReturnValue(true);
        
        const { container } = rtRender(<CommitteeDashboard />);
        
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });
    });

});