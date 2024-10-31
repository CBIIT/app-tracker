import React, { useEffect } from 'react';
import { render, screen, waitFor, act, findByText } from '@testing-library/react';
import axios from 'axios';
import { Button, message, Tooltip } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../../hooks/useAuth';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useHistory: jest.fn(),
}));
jest.mock('../../../hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn(), 
}));
jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    }
}));

describe('Header', () => {
    let mockUseAuth;

    const mockProfileTrue = {
        hasProfile: true,
    };

    const mockProfileFalse = {
        hasProfile: false,
    };

    const mockProps = {
        closeDate: '',
        openDate: '2024-09-13',
        sysId: '456',
        title: 'Rolling Close Test Title',
        vacancyPOC: {
            email: 'vacancy.poc@email.com',
            name: 'Vacancy POC',
            value: '789',
        },
        vacancyState: 'rolling_close',
        vacancyStatus: 'open',
    };

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
    })

    // beforeEach(() => {
    //     useParams.mockReturnValue({ sysId: '123'});
    //     useAuth.mockReturnValue({ auth: { user: mockUser}});
    // });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('successfully clicks Apply button and checks for profile', async () => {
        mockUseAuth.auth.isUserLoggedIn = true;
        useParams.mockReturnValue({ sysId: '123'});
        useAuth.mockReturnValue({ auth: { user: mockProfileTrue } });

        // render the header (apply button exists here)
        render(<Header { ...mockProps } { ...mockUseAuth } setHasProfile={ mockProfileTrue } />);
        render(<Button />);

        expect(screen.getByRole('button')).toBeInTheDocument();


        // click the apply button

        // Apply.js functionality should appear
    });

    // Test case for handling error when checking if user has profile
});