import React from 'react';
import { render, screen, waitFor, act, findByText, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { Button, message, Tooltip } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../../hooks/useAuth';
import { APPLICANT_DASHBOARD, APPLY, REGISTER_OKTA } from '../../../constants/Routes';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
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

const mockUseAuth = {
    auth: {
        iTrustGlideSsoId: 'testSsoId',
        iTrustUrl: 'https://test.itrust.com',
        isUserLoggedIn: false,
        user: { firstName: 'John', lastInitial: 'D' },
        oktaLoginAndRedirectUrl: 'https://test.okta.com',

    },
}

describe('Header', () => {
    let mockUseAuth;
    let mockedUsedNavigate;
    let mockHistoryPush;

    const myHeader = () => {
        const handleClick = () => {
            APPLY + mockVacancyProps.sysId;
        };

        return <Button data-testid="apply-button" onClick={handleClick}>Apply</Button>;
    };

    const mockVacancyProps = {
        closeDate: '',
        openDate: '2024-09-13',
        sysId: '456',
        title: 'Vacancy Title',
        vacancyPOCType: [],
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
            auth: { isUserLoggedIn: true, user: { hasProfile: true } },
        },

            useAuth.mockReturnValue(mockUseAuth);
        mockHistoryPush = jest.fn();
        useNavigate.mockReturnValue(mockHistoryPush);
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn()
        };

    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders button with Apply text when user is logged in', async () => {
        useParams.mockReturnValue({ sysId: '123' });

        await act(async () => {
            mockUseAuth.auth.isUserLoggedIn = true;
            render(<Header {...mockVacancyProps} />);
        });

        expect(screen.getByText('Apply')).toBeInTheDocument();
    });

    it('handles apply button click when user is logged in and has a profile', async () => {
        const mockApply = jest.fn(() => location.pathname = APPLY + mockVacancyProps.sysId);
        useParams.mockReturnValue({ sysId: '123' });

        await waitFor(async () => {
            mockUseAuth.auth.isUserLoggedIn = true;
            mockUseAuth.auth.user.hasProfile = true;
            render(<Header {...mockVacancyProps} onClick={mockApply()} />);
            const applyButton = screen.getByRole('button', { name: 'Apply' });
            fireEvent.click(applyButton);
        });

        expect(mockApply).toHaveBeenCalled();
        expect(window.location.pathname).toBe(APPLY + mockVacancyProps.sysId);
    });

    it('handles error handling gracefully', async () => {
        const mockApply = jest.fn(() => location.pathname = APPLY + mockVacancyProps.sysId);
        useParams.mockReturnValue({ sysId: '123' });

        await waitFor(async () => {
            mockUseAuth.auth.isUserLoggedIn = true;
            mockUseAuth.auth.user.hasProfile = true;
            render(<Header {...mockVacancyProps} onClick={mockApply()} />);
            const applyButton = screen.getByRole('button', { name: 'Apply' });
            fireEvent.click(applyButton);
        });

        expect(mockApply).toHaveBeenCalled();
        expect(window.location.pathname).toBe(APPLY + mockVacancyProps.sysId);
        axios.get.mockRejectedValue(new Error('Profile not found'));
    });


    it('renders vacancyPOC when vacancyPOCType includes User and vacancyPOC is provided', () => {
        const mockVacancyPOC = {
            label: 'John Doe',
            email: 'john.doe@example.com',
        };

        const mockVacancyPOCType = {
            value: JSON.stringify(['User']),
        };

        render(
            <Header
                title='Test Vacancy'
                openDate='2025-01-15'
                closeDate='2025-02-15'
                vacancyState='open'
                vacancyStatus='open'
                useCloseDate={true}
                sysId='test-sys-id'
                vacancyPOC={mockVacancyPOC}
                vacancyPOCType={mockVacancyPOCType}
                vacancyPOCEmail={{}}
            />
        );

        // Assert vacancyPOC label is rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();

        // Assert Point of Contact label is rendered
        expect(screen.getByText('Point of Contact:')).toBeInTheDocument();

    });

    it('renders vacancyPOCEmail when vacancyPOCType includes Email Distribution List', async () => {
        const mockVacancyPOCEmail = {
            label: 'team-distribution@example.com',
            value: 'team-distribution@example.com'
        };

        const mockVacancyPOCType = {
            value: JSON.stringify(['Email Distribution List']),
        };

        await act(async () => {

            render(
                <Header
                    title='Test Vacancy'
                    openDate='2025-01-15'
                    closeDate='2025-02-15'
                    vacancyState='open'
                    vacancyStatus='open'
                    useCloseDate={true}
                    sysId='test-sys-id'
                    vacancyPOC={{}}
                    vacancyPOCType={mockVacancyPOCType}
                    vacancyPOCEmail={mockVacancyPOCEmail}
                />);
        });


        // Assert email distribution list is rendered
        expect(screen.getByText('team-distribution@example.com')).toBeInTheDocument();

        // Assert Email to: label is rendered
        expect(screen.getByText('Email to:')).toBeInTheDocument();

    });

});