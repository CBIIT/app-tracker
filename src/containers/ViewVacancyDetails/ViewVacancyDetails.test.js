import ViewVacancyDetails from './ViewVacancyDetails';
import { render, screen } from '@testing-library/react';
import { useParams, useHistory, MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { mockVacancy, mockVacancy2, mockVacancy3 } from './MockData';
import useAuth from '../../hooks/useAuth';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
	useHistory: jest.fn(),
}));
jest.mock('react-quill', () => () => <div data-testid='quill' />);
jest.mock('../../hooks/useAuth', () => ({
	__esModule: true,
	default: jest.fn(),
}));

describe('ViewVacancyDetails', () => {
	beforeAll(() => {
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
		useAuth.mockReturnValue({
			auth: {
				isUserLoggedIn: false,
				user: { hasProfile: true },
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should show an error notification and redirect to home when fetch fails', async () => {
		const pushMock = jest.fn();
		useParams.mockReturnValue({ sysId: '123' });
		useHistory.mockReturnValue({ push: pushMock });
		axios.get.mockRejectedValueOnce(new Error('Request failed'));

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(
			await screen.findByText('Sorry! There was an error retrieving the vacancy details.')
		).toBeInTheDocument();
		expect(pushMock).toHaveBeenCalledWith('/');
		expect(pushMock).toHaveBeenCalledTimes(1);
	});

	test('should render ViewVacancyDetails with a Rolling Close Vacancy', async () => {
		useParams.mockReturnValue({ sysId: '123' });
		useHistory.mockReturnValue({ push: jest.fn() });
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancy)
		);

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(await screen.findByText('APPLICATION DOCUMENTS')).toBeInTheDocument();
	});

	test('should render ViewVacancyDetails page with a vacancy that uses a close date', async () => {
		useParams.mockReturnValue({ sysId: '123' });
		useHistory.mockReturnValue({ push: jest.fn() });
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancy2)
		);

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(await screen.findByText('HHS and NIH are Equal Opportunity Employers')).toBeInTheDocument();
	});

	test('Should render ViewVacancyDetails page with more than 1 recommendation', async () => {
		useParams.mockReturnValue({ sysId: '123' });
		useHistory.mockReturnValue({ push: jest.fn() });
		axios.get.mockImplementationOnce(() =>
			Promise.resolve(mockVacancy3)
		);

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(await screen.findByText('Test Vacancy')).toBeInTheDocument();
	});
});
