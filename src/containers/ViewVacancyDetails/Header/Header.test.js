import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import axios from 'axios';
import { message } from 'antd';
import { useParams, useHistory } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../../hooks/useAuth';
import { APPLICANT_DASHBOARD, APPLY, REGISTER_OKTA } from '../../../constants/Routes';

jest.mock('axios');
jest.mock('react-router-dom', () => ({

    useParams: jest.fn(),
    useHistory: jest.fn(),

}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));
jest.mock('../../../hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
        info: jest.fn(),
    }
}));
jest.mock('../../../components/ProfileModal/ProfileModal', () => (props) => (
    <div data-testid='profile-modal'>
        <button onClick={props.handleClose}>Close</button>
    </div>
));

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
        useHistory.mockReturnValue({ push: mockHistoryPush });
        axios.get.mockResolvedValue({ data: { result: { exists: false } } });
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

    it('does not crash when vacancyPOCType value is literal undefined', () => {
        const mockVacancyPOC = {
            label: 'John Doe',
            email: 'john.doe@example.com',
        };

        expect(() => {
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
                    vacancyPOCType={{ value: 'undefined' }}
                    vacancyPOCEmail={{}}
                />
            );
        }).not.toThrow();

        expect(screen.queryByText('Point of Contact:')).not.toBeInTheDocument();
    });

    it('does not crash when vacancyPOCType value is empty or malformed JSON', () => {
        const mockVacancyPOC = {
            label: 'John Doe',
            email: 'john.doe@example.com',
        };

        expect(() => {
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
                    vacancyPOCType={{ value: '   ' }}
                    vacancyPOCEmail={{}}
                />
            );
        }).not.toThrow();

        expect(screen.queryByText('Point of Contact:')).not.toBeInTheDocument();

        expect(() => {
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
                    vacancyPOCType={{ value: '{bad-json' }}
                    vacancyPOCEmail={{}}
                />
            );
        }).not.toThrow();
    });

    it('does not render POC when vacancyPOCType parses to non-array JSON', () => {
        const mockVacancyPOC = {
            label: 'John Doe',
            email: 'john.doe@example.com',
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
                vacancyPOCType={{ value: '{"type":"User"}' }}
                vacancyPOCEmail={{}}
            />
        );

        expect(screen.queryByText('Point of Contact:')).not.toBeInTheDocument();
    });

    it('navigates to applicant dashboard and shows info message when user already applied', async () => {
        useParams.mockReturnValue({ sysId: '123' });
        const messageInfoSpy = jest
            .spyOn(message, 'info')
            .mockImplementation(jest.fn());
        axios.get.mockResolvedValueOnce({ data: { result: { exists: true } } });

        await act(async () => {
            mockUseAuth.auth.isUserLoggedIn = true;
            mockUseAuth.auth.user.hasProfile = true;
            render(<Header {...mockVacancyProps} />);
        });

        const applyButton = await screen.findByRole('button', { name: 'Apply' });
        fireEvent.click(applyButton);

        expect(mockHistoryPush).toHaveBeenCalledWith(APPLICANT_DASHBOARD);
        expect(messageInfoSpy).toHaveBeenCalledWith('You have already applied for this position.');

        messageInfoSpy.mockRestore();
    });

    it('shows error message when checkUserAlreadyApplied call fails', async () => {
        useParams.mockReturnValue({ sysId: '123' });
        const messageErrorSpy = jest
            .spyOn(message, 'error')
            .mockImplementation(jest.fn());
        axios.get.mockRejectedValueOnce(new Error('network error'));

        await act(async () => {
            mockUseAuth.auth.isUserLoggedIn = true;
            mockUseAuth.auth.user.hasProfile = true;
            render(<Header {...mockVacancyProps} />);
        });

        await waitFor(() => {
            expect(messageErrorSpy).toHaveBeenCalledWith('Sorry!  An error occurred while loading.');
        });

        messageErrorSpy.mockRestore();
    });

    it('shows profile modal when user has no profile and closes it', async () => {
        useParams.mockReturnValue({ sysId: '123' });
        axios.get
            .mockResolvedValueOnce({ data: { result: { exists: false } } })
            .mockResolvedValueOnce({ data: { result: { exists: false } } });

        await act(async () => {
            mockUseAuth.auth.isUserLoggedIn = true;
            mockUseAuth.auth.user.hasProfile = false;
            render(<Header {...mockVacancyProps} />);
        });

        const applyButton = await screen.findByRole('button', { name: 'Apply' });
        fireEvent.click(applyButton);

        expect(screen.getByTestId('profile-modal')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Close'));

        await waitFor(() => {
            expect(screen.queryByTestId('profile-modal')).not.toBeInTheDocument();
        });
    });

    it('logs message when checkHasProfile call fails', async () => {
        useParams.mockReturnValue({ sysId: '123' });
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        axios.get
            .mockResolvedValueOnce({ data: { result: { exists: false } } })
            .mockRejectedValueOnce(new Error('Profile not found'));

        await act(async () => {
            mockUseAuth.auth.isUserLoggedIn = true;
            mockUseAuth.auth.user.hasProfile = false;
            render(<Header {...mockVacancyProps} />);
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to find user profile.');
        });

        consoleSpy.mockRestore();
    });

    it('renders sign in and apply button for logged out user and navigates to okta link', async () => {
        useParams.mockReturnValue({ sysId: '123' });

        await act(async () => {
            mockUseAuth.auth.isUserLoggedIn = false;
            mockUseAuth.auth.user.hasProfile = true;
            render(<Header {...mockVacancyProps} />);
        });

        const signInButton = await screen.findByRole('button', { name: 'Sign In and Apply' });
        fireEvent.click(signInButton);

        expect(mockHistoryPush).toHaveBeenCalledWith(REGISTER_OKTA);
    });

    it('does not render action button when vacancy is closed and useCloseDate is true', async () => {
        await act(async () => {
            render(
                <Header
                    {...mockVacancyProps}
                    useCloseDate={true}
                    vacancyStatus='closed'
                    vacancyState='closed'
                    closeDate='2025-12-15'
                />
            );
        });

        expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Sign In and Apply' })).not.toBeInTheDocument();
    });

    it('does not render action button when vacancy is rolling close and useCloseDate is false', async () => {
        await act(async () => {
            render(
                <Header
                    {...mockVacancyProps}
                    useCloseDate={false}
                    vacancyStatus='closed'
                    vacancyState='rolling_close'
                    closeDate='2025-12-15'
                />
            );
        });

        expect(screen.queryByRole('button', { name: 'Apply' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Sign In and Apply' })).not.toBeInTheDocument();
    });

    it('renders open until filled when close date is not provided', async () => {
        await act(async () => {
            render(
                <Header
                    {...mockVacancyProps}
                    closeDate=''
                    vacancyPOC={{}}
                    vacancyPOCEmail={{}}
                />
            );
        });

        expect(screen.getByText('Open Until Filled')).toBeInTheDocument();
    });

});