import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import TimeoutModal from './TimeoutModal';
import useAuth from '../../hooks/useAuth';
import useTimeout from '../../hooks/useTimeout';

jest.mock('axios');
jest.mock('../../hooks/useAuth');
jest.mock('../../hooks/useTimeout');

describe('TimeoutModal', () => {
    let setAuthMock, setModalTimeoutMock;

    beforeEach(() => {
        setAuthMock = jest.fn();
        setModalTimeoutMock = jest.fn();
        jest.useFakeTimers({ legacyFakeTimers: true });
        jest.spyOn(global, 'setTimeout');
        useAuth.mockReturnValue({
            auth: {
                sessionTimeout: 10000,
                isUserLoggedIn: true,
            },
            setAuth: setAuthMock,
        });
        useTimeout.mockReturnValue({
            setModalTimeout: setModalTimeoutMock,
        });
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn(),
        }
    });
    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    test('shows modal after 90% of session time has elapsed', () => {
        render(<TimeoutModal />);
        // Simulate the passage of time to open the modal
        act(() => {
            jest.advanceTimersByTime(9000);
        });
        waitFor(() => expect(screen.getByTestId('timeout-modal')).toBeVisible());
    });

    test('extends session when Extend button is clicked', () => {
        axios.get.mockResolvedValue({
            data: {
                result: {
                    logged_in: true,
                    session_timeout: 10000,
                    user: {
                        first_name: 'John',
                        last_initial: 'D',
                        user_id: '123',
                        has_profile: true,
                        tenant: 'tenant',
                        has_applications: true,
                        roles: ['role1'],
                    },
                    itrust_idp: 'itrust_idp',
                    itrust_url: 'itrust_url',
                    okta_idp: 'okta_idp',
                    okta_login_and_redirect_url: 'okta_login_and_redirect_url',
                    is_chair: false,
                    is_manager: false,
                    is_exec_sec: false,
                },
            },
        });

        render(<TimeoutModal />);
        // Simulate the passage of time to open the modal
        act(() => {
            jest.advanceTimersByTime(9000);
        });
        expect(screen.getByTestId('timeout-modal')).toBeVisible()
        fireEvent.click(screen.getByText('Extend'));
        waitFor(() => expect(setAuthMock).toHaveBeenCalled());
    });

    test('logs out user when Logout button is clicked', () => {
        const mockedFunction = jest.fn(() => location.href = '/logout.do');
        render(<TimeoutModal onClick={mockedFunction()} />);
        // Simulate the passage of time to open the modal
        act(() => {
            jest.advanceTimersByTime(9000);
        });
        waitFor(() => expect(screen.getByTestId('timeout-modal')).toBeVisible());
        fireEvent.click(screen.getByText('Logout'));
        expect(mockedFunction).toHaveBeenCalledTimes(1);
        expect(window.location.href).toBe('/logout.do');
    });

    test('auto closes modal and logs out user after remaining time', async () => {
        render(<TimeoutModal />);

        // Simulate the passage of time to open the modal
        act(() => {
            jest.advanceTimersByTime(9000);
        });

        // Wait for the modal to be visible
        await waitFor(() => expect(screen.getByTestId('timeout-modal')).toBeVisible());

        // Simulate the passage of additional time to close the modal and log out the user
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        // Wait for the URL to change to /logout.do
        waitFor(() => expect(window.location.href).toBe('/logout.do'));
        expect(window.location.href).toBe('/logout.do');
    });
});