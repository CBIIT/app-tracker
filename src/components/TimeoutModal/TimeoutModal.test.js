import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
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
        jest.useFakeTimers();
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
    })
    // Testing that Advance Timers Work without rendering
    test('setTimeout should work', () => {
        const callback = jest.fn();

        setTimeout(callback, 10000);

        // Advance the timer by 1000ms (1 second)
        jest.advanceTimersByTime(10000);

        expect(callback).toHaveBeenCalled();
    });
    test('renders TimeoutModal component', async () => {
        jest.useFakeTimers();

        render(<TimeoutModal />);
        jest.advanceTimersByTime(9000); // throws callback.apply is not a function error
        await waitFor(() => expect(screen.getByTestId('timeout-modal')).toBeVisible());
        expect(screen.getByTestId('timeout-modal')).toBeInTheDocument();
    });

    test('shows modal after 90% of session time has elapsed', async () => {
        render(<TimeoutModal />);
        // jest.advanceTimersByTime(9000);
        act(() => {
            jest.runOnlyPendingTimers(); // throws callback.apply is not a function error
        });
        await waitFor(() => expect(screen.getByTestId('timeout-modal')).toBeVisible());
        // jest.useRealTimers();
    });

    test('extends session when Extend button is clicked', async () => {
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
        // jest.advanceTimersByTime(9500); // throws callback.apply is not a function error
        await waitFor(() => expect(screen.getByTestId('timeout-modal')).toBeVisible());
        fireEvent.click(screen.getByText('Extend'));
        await waitFor(() => expect(setAuthMock).toHaveBeenCalled());
        jest.useRealTimers();
    });

    test('logs out user when Logout button is clicked', async () => {
        const mockedFunction = jest.fn(() => location.href = '/logout.do');
        render(<TimeoutModal onClick={mockedFunction()} />);
        // jest.advanceTimersByTime(9000);
        await waitFor(() => expect(screen.getByTestId('timeout-modal')).toBeVisible());
        fireEvent.click(screen.getByText('Logout'));
        expect(mockedFunction).toHaveBeenCalledTimes(1);
        expect(window.location.href).toBe('/logout.do');
        // jest.useRealTimers();
    });


    test('auto closes modal and logs out user after remaining time', async () => {
        render(<TimeoutModal />);

        // Simulate the passage of time to open the modal
        act(() => {
            jest.advanceTimersByTime(9000); // throws callback.apply is not a function error
        });

        // Wait for the modal to be visible
        await waitFor(() => expect(screen.getByTestId('timeout-modal')).toBeVisible());

        // Simulate the passage of additional time to close the modal and log out the user
        act(() => {
            jest.advanceTimersByTime(1000); // throws callback.apply is not a function error
        });

        // Wait for the URL to change to /logout.do
        await waitFor(() => expect(window.location.href).toBe('/logout.do'));
        expect(window.location.href).toBe('/logout.do');

        jest.useRealTimers();
    });


});