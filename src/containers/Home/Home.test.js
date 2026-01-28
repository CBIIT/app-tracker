import Home from './Home';
import axios from 'axios';
import * as useAuth from '../../hooks/useAuth';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { mockAuth, mockVacancyList, noVacancyList, } from './MockData';

jest.mock('axios');
jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
	default: jest.fn(),
}));

describe('Home', () => {
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

        useAuth.default.mockReturnValue(mockAuth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render Home page with Vacancies', () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve(mockVacancyList)
        );

        render(
            <MemoryRouter initialEntry={['/']}>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByText(/The National Institutes of Health \(NIH\), a part of the U\.S\. Department of Health and Human Services/i)).toBeInTheDocument();
        expect(screen.getByText(/making important discoveries that improve health and save lives/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'https://www.nih.gov/about-nih' })).toBeInTheDocument();

        expect(screen.getByText(/Open Vacancies/i)).toBeInTheDocument();

        const vacancyStatement = screen.getByText(/The closing time for the application period differs for each vacancy on the final day. Please click on a vacancy below to find the specific closing time./i)
        expect(vacancyStatement).toBeInTheDocument();

        waitFor(() => {
            expect(screen.getByTestId('vacancy-list'));
        });
        
    });

    test('should render Home page with no Vacancies', () => {
        axios.get.mockImplementationOnce(() =>
            Promise.resolve(noVacancyList)
        );

        render(
            <MemoryRouter initialEntry={['/']}>
                <Home />
            </MemoryRouter>
        );

        waitFor(() => {
            expect(screen.getByTestId('vacancy-list'))
        });

        waitFor(() => {
            expect(screen.getByText(/There are currently no open vacancies./i)).toBeInTheDocument();
        });
    });
});