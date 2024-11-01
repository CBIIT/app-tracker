import React, { useEffect } from 'react';
import { render, screen, waitFor, act, findByText } from '@testing-library/react';
import axios from 'axios';
import { Button, message, Tooltip } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../../hooks/useAuth';
import e from 'express';

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
    let mockProfileFalse;

    const mockProfileTrue = {
        hasProfile: true,
    };

    const mockVacancyProps = {
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

        useAuth.mockReturnValue(mockUseAuth);
        mockHistoryPush = jest.fn();
        useHistory.mockReturnValue({ push: mockHistoryPush });
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn() 
        };

    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render button with Apply text when user is logged in', async () => {
        mockUseAuth.auth.isUserLoggedIn = true;
        useParams.mockReturnValue({ sysId: '123' });
        useAuth.mockReturnValue({ auth: { user: mockProfileTrue}});

        await act(async () => {
            mockUseAuth.auth.isUserLoggedIn = true;
            render(<Header {...mockVacancyProps} />);
        });

        expect(screen.getByText('Apply')).toBeInTheDocument();
    });

});