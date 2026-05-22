import Home from './Home';
import axios from 'axios';
import * as useAuth from '../../hooks/useAuth';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { 
    mockAuth, 
    mockVacancyList, 
    noVacancyList, 
    mockVacancyListForSorting
} from './MockData';

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

    test('should sort titles by length when clicking Vacancy Title', async () => {
        axios.get.mockImplementationOnce(() => 
            Promise.resolve(mockVacancyListForSorting)
        );

        render(
            <MemoryRouter initialEntry={['/']}>
                <Home />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Short Title')).toBeInTheDocument();
        });

        const vacancyTitleHeader = screen.getByText('Vacancy Title');

        waitFor(() => {
            fireEvent.click(vacancyTitleHeader);

            const rows = screen.getAllByRole('row');
            expect(rows[1]).toHaveTextContent('Short Title');
            expect(rows[2]).toHaveTextContext('Medium Length Title');
            expect(rows[3]).toHaveTextContext('Very Long Vacancy Title Here');
        });
    });

    test('should sort Vacancies by Institue length when clicking Institute column', async () => {
        axios.get.mockImplementationOnce(() => 
            Promise.resolve(mockVacancyListForSorting)
        );

        render(
            <MemoryRouter initialEntry={['/']}>
                <Home />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('NCI')).toBeInTheDocument();
        });

        const instituteHeader = screen.getByText('Institute');

        waitFor(() => {
            fireEvent.click(instituteHeader);

            const cells = screen.getAllByRole('cell');
            const instituteCells = Array.from(cells).filter(cell =>
                cell.textContent === 'NCI' ||
                cell.textContent === 'NIAID' ||
                cell.textContent === 'Stadtman'
            );

            expect(instituteCells[0]).toHaveTextContent('NCI');
            expect(instituteCells[1]).toHaveTextContent('NIAID');
            expect(instituteCells[2]).toHaveTextContent('Stadtman');
        });
    });
});