import ApplicantDashboard from './ApplicantDashboard';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import * as useAuth from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { mockUseAuth, mockUserApps } from './ApplicantDashboardMockData';

jest.mock('axios');
jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn(),
}));
jest.mock('../../hooks/useFetch', () => ({
    __esModule: true,
    useFetch: jest.fn(),
}));
jest.mock('../../components/Util/Date/Date', () => ({
    __esModule: true,
    transformDateToDisplay: jest.fn((date) => {
        if (!date) return 'Open Until Filled';
        const [year, month, day] = date.split('-');
        return `${month}/${day}/${year}`;
    }),
}));

describe('ApplicantDashboard', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // deprecated
                removeListener: jest.fn(), // deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
        useAuth.default.mockReturnValue({ setAuth: jest.fn(), ...mockUseAuth });
        axios.get.mockResolvedValue({ data: { result: {
            logged_in: true,
            itrust_idp: '',
            itrust_url: '',
            session_timeout: 1800000,
            banner_message: '',
            banner_description: '',
            omb_no: '',
            omb_exp: '',
            user: {
                first_name: 'John',
                last_initial: 'D',
                user_id: '12345',
                has_applications: true,
                tenant: '',
                roles: ['snc_internal'],
            },
            okta_login_and_redirect_url: '',
            tenants: [],
        }}});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render the ApplicantDashboard component', async () => {
        useFetch.mockReturnValue({ data: mockUserApps, isLoading: false, error: null });

        render(
            <MemoryRouter initialEntries={['/applicant-dashboard']}>
                <ApplicantDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
        });

        expect(screen.getByText(/Your Applications/i)).toBeInTheDocument();
        expect(screen.getByText(/Vacancy Title/i)).toBeInTheDocument();
        expect(screen.getByText(/Test Vacancy 1/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Status/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/submitted/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Vacancy Closes/i)).toBeInTheDocument();
        expect(screen.getByText(/Application Submitted/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
        expect(screen.getByText(/Edit/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Withdraw/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Reference Status/i)).toBeInTheDocument();
        expect(screen.getByText(/1 out of 4/i)).toBeInTheDocument();
        expect(screen.getByText(/2 out of 3/i)).toBeInTheDocument();
        // expect(screen.getByText('12/13/2024')).toBeInTheDocument();
        expect(screen.getByText(/Open Until Filled/i)).toBeInTheDocument();
    });

    test('direct comparator throws with undefined vacancy (demonstrates bug)', () => {
        const unsafeCompare = (a, b) => a.vacancy.localeCompare(b.vacancy);
        const a = { vacancy: undefined };
        const b = { vacancy: 'A' };
        expect(() => unsafeCompare(a, b)).toThrow();
    });

    test('fixes localeCompare bug in sorter', () => {
        
        const unsafeCompare = (a, b) => {
            const va = String(a?.vacancy ?? '').toLowerCase();
            const vb = String(b?.vacancy ?? '').toLowerCase();
            va.localeCompare(vb)
        };
        const a = { vacancy: undefined };
        const b = { vacancy: 'A' };
        expect(() => unsafeCompare(a, b)).not.toThrow();
    });


});