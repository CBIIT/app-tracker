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
        useAuth.default.mockReturnValue(mockUseAuth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render the ApplicantDashboard component', async () => {
        useFetch.mockReturnValue({ data: mockUserApps, isLoading: false, error:  null });

        render(
            <MemoryRouter initialEntries={['/applicant-dashboard']}>
                <ApplicantDashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
        });

        expect(screen.getByText(/Vacancy Title/i)).toBeInTheDocument();
        expect(screen.getByText(/Test Vacancy 1/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Status/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/submitted/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Vacancy Closes/i)).toBeInTheDocument();
        // expect(screen.getByText('12/23/2024')).toBeInTheDocument();
        expect(screen.getByText(/Open Until Filled/i)).toBeInTheDocument();
        expect(screen.getByText(/Application Submitted/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
        expect(screen.getByText(/Edit/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Withdraw/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/Reference Status/i)).toBeInTheDocument();
        expect(screen.getByText(/1 out of 4/i)).toBeInTheDocument();
        expect(screen.getByText(/2 out of 3/i)).toBeInTheDocument();
    });
});