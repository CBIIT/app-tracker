import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useHistory } from 'react-router-dom';
import Login from './Login';
import useAuth from '../../../hooks/useAuth';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
    useLocation: jest.fn(),
}));
// const mockedUsedNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockedUsedNavigate,
//     useLocation: () => mockedUsedLocation,
// }));

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
                user: { firstName: 'John', lastInitial: 'D' },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);
        mockHistoryPush = jest.fn();
        useHistory.mockReturnValue({ push: mockHistoryPush });
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
    test('redirects to Okta login when already registered is clicked', async () => {
        render(<Login />);

        mockUseAuth.auth.isUserLoggedIn = false;
        fireEvent.mouseOver(screen.getByText(/Login/i));
        await waitFor(() => screen.getByTestId('nih-already-item'));
        fireEvent.click(screen.getByTestId('nih-already-item'));
        expect(window.location.href).toBe('https://test.okta.com');
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
            },
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
            },
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
                    isChair: true,
                 },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',            
            },
        };
        useAuth.mockReturnValue(mockUseAuthCommMember);
        render(<Login />);
        expect(screen.getByTestId('tenant-select-item')).toBeInTheDocument();
    });


});


