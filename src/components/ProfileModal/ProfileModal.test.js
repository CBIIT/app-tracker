import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileModal from './ProfileModal';
import useAuth from '../../hooks/useAuth';
import { useHistory, useLocation } from 'react-router-dom';

jest.mock('../../hooks/useAuth');
jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
    useLocation: jest.fn(),
}));

describe('ProfileModal', () => {
    let mockUseAuth;
    let mockHistoryPush;
    let mockLocation;
    let mockHandleClose;

    beforeEach(() => {
        mockHandleClose = jest.fn();
        mockHistoryPush = jest.fn();
        useHistory.mockReturnValue({ push: mockHistoryPush });
            delete window.location;
            window.location = {
            href: '',
            assign: jest.fn(),
        }
        mockLocation = jest.fn();
        useLocation.mockReturnValue({ pathname: '/some-vacancy' });
    });

    it('should render the complete profile modal when user is logged in', () => {
        mockUseAuth = {
            auth: {
                isUserLoggedIn: true,
                user: { uid: '123' },
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);

        render(<ProfileModal handleClose={mockHandleClose} />);

        expect(screen.getByText('Please complete your profile.')).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('A completed profile is required to apply for a vacancy.'))).toBeInTheDocument();
        expect(screen.getByText('Finish Profile')).toBeInTheDocument();
        expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    it('should render the login modal when user is not logged in', () => {
        mockUseAuth = {
            auth: {
                isUserLoggedIn: false,
                user: null,
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);

        render(<ProfileModal handleClose={mockHandleClose} />);

        expect(screen.getByText('Please log in.')).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('You must be logged in to apply for a vacancy.'))).toBeInTheDocument();
        expect(screen.getByText('Create an account')).toBeInTheDocument();
        expect(screen.getByText('Log in')).toBeInTheDocument();
        expect(screen.getByText('Go Back')).toBeInTheDocument();
    });

    it('should call handleFinishProfile when Finish Profile button is clicked', () => {
        mockUseAuth = {
            auth: {
                isUserLoggedIn: true,
                user: { uid: '123' },
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);

        render(<ProfileModal handleClose={mockHandleClose} />);

        fireEvent.click(screen.getByText('Finish Profile'));
        expect(mockHistoryPush).toHaveBeenCalledWith('/profile/123');
    });

    it('should call handleLogin when Log in button is clicked', () => {
        mockUseAuth = {
            auth: {
                isUserLoggedIn: false,
                user: null,
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);
        const mockedFunction = jest.fn(() => location.href = '/login');

        render(<ProfileModal handleClose={mockedFunction()} />);

        fireEvent.click(screen.getByText('Log in'));
        expect(mockedFunction).toHaveBeenCalled();
        expect(window.location.href).toBe('/login');
    });

    it('should call handleRegistration when Create an account button is clicked', () => {
        mockUseAuth = {
            auth: {
                isUserLoggedIn: false,
                user: null,
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);

        render(<ProfileModal handleClose={mockHandleClose} />);

        fireEvent.click(screen.getByText('Create an account'));
        expect(mockHistoryPush).toHaveBeenCalledWith('/register-okta', '_blank');
    });

    it('should call handleContinue when Go Back button is clicked', () => {
        mockUseAuth = {
            auth: {
                isUserLoggedIn: true,
                user: { uid: '123' },
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);

        render(<ProfileModal handleClose={mockHandleClose} />);

        fireEvent.click(screen.getByText('Go Back'));
        expect(mockHandleClose).toHaveBeenCalled();
    });
});