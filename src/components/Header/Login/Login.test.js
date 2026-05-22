import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useHistory, useLocation } from 'react-router-dom';
import { PROFILE } from '../../../constants/Routes';
import Login from './Login';
import useAuth from '../../../hooks/useAuth';

jest.mock('antd/lib/select', () => ({
    __esModule: true,
    default: ({ options = [], value, onChange, filterOption, ...rest }) => {
        if (filterOption) {
            filterOption('a', { label: 'Alpha' });
            filterOption('a', {});
        }

        return (
            <select
                data-testid={rest['data-testid']}
                aria-label={rest['aria-label']}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value=''>Select a tenant</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    },
}));

jest.mock('antd/es/select', () => ({
    __esModule: true,
    default: ({ options = [], value, onChange, filterOption, ...rest }) => {
        if (filterOption) {
            filterOption('a', { label: 'Alpha' });
            filterOption('a', {});
        }

        return (
            <select
                data-testid={rest['data-testid']}
                aria-label={rest['aria-label']}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value=''>Select a tenant</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    },
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock('../../../hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('Login Component', () => {
    let mockUseAuth;
    let mockHistoryPush;

    beforeEach(() => {
        mockUseAuth = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: false,
                user: {
                    firstName: 'John',
                    lastInitial: 'D',
                    uid: 'john-user',
                    isManager: false,
                    isCommitteeMember: false,
                },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [],
            },
            currentTenant: undefined,
            setCurrentTenant: jest.fn(),
            previousTenant: { current: '' },
        };
        useAuth.mockReturnValue(mockUseAuth);
        mockHistoryPush = jest.fn();
        useHistory.mockReturnValue({ push: mockHistoryPush });
        useLocation.mockReturnValue({ pathname: '/profile' });
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn(),
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders login button when user is not logged in', () => {
        render(<Login />);
        expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });

    test('renders user dropdown when user is logged in', () => {
        mockUseAuth.auth.isUserLoggedIn = true;
        render(<Login />);
        expect(screen.getByText(/John D./i)).toBeInTheDocument();
    });

    test('renders user dropdown without last initial when lastInitial is missing', () => {
        mockUseAuth.auth.isUserLoggedIn = true;
        mockUseAuth.auth.user.lastInitial = '';
        render(<Login />);
        expect(screen.getByText('John')).toBeInTheDocument();
    });

    test('if not logged in, user should see dropdown menu when Login is hovered over', async () => {
        render(<Login />);
        // Find the login button and click it
        const loginButton = screen.getByRole('button');
        fireEvent.mouseOver(loginButton);
        await waitFor(() => screen.getByText(/NIH Login/i));

        expect(screen.getByTestId('nih-login-item')).toBeInTheDocument();
        expect(screen.getByTestId('nih-already-item')).toBeInTheDocument();
        expect(screen.getByTestId('nih-register-item')).toBeInTheDocument();

    });

    test('logs out user when logout is clicked', async () => {

        const mockedFunction = jest.fn(() => location.href = '/logout.do');
        mockUseAuth.auth.isUserLoggedIn = true;
        render(<Login onClick={mockedFunction()} />);
        fireEvent.mouseOver(screen.getByText(/John D./i));
        await waitFor(() => screen.getByRole('menuitem', { name: /Logout/i }));
        fireEvent.click(screen.getByRole('menuitem', { name: /Logout/i }));
        expect(mockedFunction).toHaveBeenCalled();
        expect(window.location.href).toEqual('/logout.do');
    });

    test('redirects user to their Profile when User Profile is clicked', async () => {
        mockUseAuth.auth.isUserLoggedIn = true;
        render(<Login />);
        fireEvent.mouseOver(screen.getByText(/John D./i));
        await waitFor(() => screen.getByRole('menuitem', { name: /User Profile/i }));
        fireEvent.click(screen.getByRole('menuitem', { name: /User Profile/i }));
        expect(mockHistoryPush).toHaveBeenCalledWith(PROFILE + mockUseAuth.auth.user.uid);
    });

    test('redirects to Okta login when already registered is clicked', async () => {
        render(<Login />);

        mockUseAuth.auth.isUserLoggedIn = false;
        fireEvent.mouseOver(screen.getByText(/Login/i));
        await waitFor(() => screen.getByTestId('nih-already-item'));
        fireEvent.click(screen.getByTestId('nih-already-item'));
        expect(window.location.href).toBe('https://test.okta.com');
    });

    test('redirects to NIH login when NIH Login is clicked', async () => {
        render(<Login />);

        fireEvent.mouseOver(screen.getByText(/Login/i));
        await waitFor(() => screen.getByTestId('nih-login-item'));
        fireEvent.click(screen.getByTestId('nih-login-item'));

        expect(window.location.href).toBe('https://test.itrust.comtestSsoId');
    });

    test('redirects to registration page when not registered is clicked', async () => {
        render(<Login />);
        mockUseAuth.auth.isUserLoggedIn = false;
        fireEvent.mouseOver(screen.getByText(/Login/i));
        await waitFor(() => screen.getByTestId('nih-register-item'));
        fireEvent.click(screen.getByTestId('nih-register-item'));
        expect(mockHistoryPush).toHaveBeenCalledWith('/register-okta');
    });

    test('Tenant dropdown shows for vacancy manager', async () => {
        let mockUseAuthVM = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: true,
                user: { 
                    firstName: 'John', 
                    lastInitial: 'D',
                    isManager: true,
                 },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [],
            },
            currentTenant: undefined,
            setCurrentTenant: jest.fn(),
            previousTenant: undefined,
        };
        useAuth.mockReturnValue(mockUseAuthVM);
        render(<Login />);
        expect(screen.getByTestId('tenant-select-item')).toBeInTheDocument();
    });

    test('Tenant dropdown shows for committee member', async () => {
        let mockUseAuthCommMember = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: true,
                user: { 
                    firstName: 'John', 
                    lastInitial: 'D',
                    isCommitteeMember: true,
                 },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [],
            },
            currentTenant: undefined,
            setCurrentTenant: jest.fn(),
            previousTenant: undefined,
        };
        useAuth.mockReturnValue(mockUseAuthCommMember);
        render(<Login />);
        expect(screen.getByTestId('tenant-select-item')).toBeInTheDocument();
    });

    test('Tenant dropdown shows for committee chair', async () => {
        let mockUseAuthCommMember = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: true,
                user: { 
                    firstName: 'John', 
                    lastInitial: 'D',
                    isCommitteeMember: true,
                 },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [],
            },
            currentTenant: undefined,
            setCurrentTenant: jest.fn(),
            previousTenant: undefined,
        };
        useAuth.mockReturnValue(mockUseAuthCommMember);
        render(<Login />);
        expect(screen.getByTestId('tenant-select-item')).toBeInTheDocument();
    });

    test('tenant display shows when user has exactly one tenant and no selected tenant', async () => {
        const setCurrentTenant = jest.fn();
        const mockUseAuthOneTenant = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: true,
                user: {
                    firstName: 'John',
                    lastInitial: 'D',
                    isManager: true,
                    isCommitteeMember: false,
                },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [{ value: 'tenant-1', label: 'Tenant 1' }],
            },
            currentTenant: '',
            setCurrentTenant,
            previousTenant: { current: '' },
        };

        useAuth.mockReturnValue(mockUseAuthOneTenant);
        render(<Login />);

        expect(screen.getByTestId('tenant-item')).toBeInTheDocument();
        expect(setCurrentTenant).toHaveBeenCalledWith('tenant-1');
    });

    test('tenant display shows when user has exactly one tenant and selected tenant is undefined', async () => {
        const setCurrentTenant = jest.fn();
        const mockUseAuthOneTenant = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: true,
                user: {
                    firstName: 'John',
                    lastInitial: 'D',
                    isManager: true,
                    isCommitteeMember: false,
                },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [{ value: 'tenant-1', label: 'Tenant 1' }],
            },
            currentTenant: undefined,
            setCurrentTenant,
            previousTenant: { current: '' },
        };

        useAuth.mockReturnValue(mockUseAuthOneTenant);
        render(<Login />);

        expect(screen.getByTestId('tenant-item')).toBeInTheDocument();
        expect(setCurrentTenant).toHaveBeenCalledWith('tenant-1');
    });

    test('invalid current tenant is cleared when not found in tenant list', async () => {
        const setCurrentTenant = jest.fn();
        const mockUseAuthInvalidTenant = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: true,
                user: {
                    firstName: 'John',
                    lastInitial: 'D',
                    isManager: true,
                    isCommitteeMember: false,
                },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [
                    { value: 'tenant-1', label: 'Tenant 1' },
                    { value: 'tenant-2', label: 'Tenant 2' },
                ],
            },
            currentTenant: 'tenant-missing',
            setCurrentTenant,
            previousTenant: { current: '' },
        };

        useAuth.mockReturnValue(mockUseAuthInvalidTenant);
        render(<Login />);

        expect(setCurrentTenant).toHaveBeenCalledWith(undefined);
    });

    test('tenant select change stores previous tenant when route is tenant-checked', async () => {
        const setCurrentTenant = jest.fn();
        const previousTenant = { current: '' };
        const mockUseAuthSelect = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: true,
                user: {
                    firstName: 'John',
                    lastInitial: 'D',
                    isManager: true,
                    isCommitteeMember: false,
                },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [
                    { value: 'tenant-1', label: 'Tenant 1' },
                    { value: 'tenant-2', label: 'Tenant 2' },
                ],
            },
            currentTenant: 'tenant-1',
            setCurrentTenant,
            previousTenant,
        };

        useLocation.mockReturnValue({ pathname: '/manage/vacancy/edit/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' });
        useAuth.mockReturnValue(mockUseAuthSelect);
        render(<Login />);

        fireEvent.change(screen.getByTestId('tenant-select-item'), {
            target: { value: 'tenant-2' },
        });

        expect(previousTenant.current).toBe('tenant-1');
        expect(setCurrentTenant).toHaveBeenCalledWith('tenant-2');
    });

    test('tenant select change clears previous tenant when route is not tenant-checked', async () => {
        const setCurrentTenant = jest.fn();
        const previousTenant = { current: 'tenant-1' };
        const mockUseAuthSelect = {
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: true,
                user: {
                    firstName: 'John',
                    lastInitial: 'D',
                    isManager: true,
                    isCommitteeMember: false,
                },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: [
                    { value: 'tenant-1', label: 'Tenant 1' },
                    { value: 'tenant-2', label: 'Tenant 2' },
                ],
            },
            currentTenant: 'tenant-1',
            setCurrentTenant,
            previousTenant,
        };

        useLocation.mockReturnValue({ pathname: '/profile/123' });
        useAuth.mockReturnValue(mockUseAuthSelect);
        render(<Login />);

        fireEvent.change(screen.getByTestId('tenant-select-item'), {
            target: { value: 'tenant-2' },
        });

        expect(previousTenant.current).toBe('');
        expect(setCurrentTenant).toHaveBeenCalledWith('tenant-2');
    });

});


