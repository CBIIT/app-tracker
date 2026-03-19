import ViewVacancyDetails from './ViewVacancyDetails';
import { render, screen } from '@testing-library/react';
import { useParams, MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { mockVacancy, mockVacancy2, mockVacancy3 } from './MockData';
import useAuth from '../../hooks/useAuth';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
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

	test('should show an error notification and keep user on page when fetch fails', async () => {
		useParams.mockReturnValue({ sysId: '123' });
		axios.get.mockRejectedValueOnce(new Error('Request failed'));

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(
			await screen.findByText('Sorry! There was an error retrieving the vacancy details.')
		).toBeInTheDocument();
		expect(await screen.findByText('Unable to load vacancy details')).toBeInTheDocument();
	});

	test('should show an error notification and keep user on page when API returns invalid data structure', async () => {
		useParams.mockReturnValue({ sysId: '123' });
		axios.get.mockImplementationOnce(() =>
			Promise.resolve({
				data: {
					result: {
						json: {
							// Missing basic_info - will fail validation
							vacancy_documents: [],
						},
					},
				},
			})
		);

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(
			await screen.findByText('Sorry! There was an error retrieving the vacancy details.')
		).toBeInTheDocument();
		expect(await screen.findByText('Unable to load vacancy details')).toBeInTheDocument();
	});

	test('should render ViewVacancyDetails with a Rolling Close Vacancy', async () => {
		useParams.mockReturnValue({ sysId: '123' });
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

	test('should render ViewVacancyDetails with missing nested value properties', async () => {
		useParams.mockReturnValue({ sysId: '123' });
		axios.get.mockImplementationOnce(() => {
			const mockDataWithMissingValues = { ...mockVacancy };
			// Remove .value from some nested properties to test optional chaining
			mockDataWithMissingValues.data.result.json.basic_info.vacancy_title = {};
			mockDataWithMissingValues.data.result.json.basic_info.close_date = {};
			return Promise.resolve(mockDataWithMissingValues);
		});

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(await screen.findByText('HHS and NIH are Equal Opportunity Employers')).toBeInTheDocument();
	});

	test('should render ViewVacancyDetails with empty documents and no recommendations', async () => {
		useParams.mockReturnValue({ sysId: '456' });
		axios.get.mockImplementationOnce(() => {
			const mockDataEmpty = { ...mockVacancy };
			mockDataEmpty.data.result.json.vacancy_documents = [];
			mockDataEmpty.data.result.json.basic_info.number_of_recommendation.value = '0';
			return Promise.resolve(mockDataEmpty);
		});

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(await screen.findByText('APPLICATION DOCUMENTS')).toBeInTheDocument();
	});

	test('should render ViewVacancyDetails with minimal data structure', async () => {
		useParams.mockReturnValue({ sysId: '789' });
		axios.get.mockImplementationOnce(() => {
			const minimalMock = { ...mockVacancy };
			// Remove nested properties to exercise optional chaining defaults
			minimalMock.data.result.json.basic_info = {
				...minimalMock.data.result.json.basic_info,
				vacancy_title: null,
				vacancy_description: null,
				open_date: null,
				close_date: null,
				use_close_date: null,
				state: null,
				status: null,
				number_of_recommendation: null,
				vacancy_poc: null,
				vacancy_poc_email: null,
			};
			return Promise.resolve(minimalMock);
		});

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(await screen.findByText('HHS and NIH are Equal Opportunity Employers')).toBeInTheDocument();
	});

	test('should render ViewVacancyDetails with partial use_close_date structure', async () => {
		useParams.mockReturnValue({ sysId: '999' });
		axios.get.mockImplementationOnce(() => {
			const partialMock = { ...mockVacancy };
			// Set use_close_date object without .value to test optional chaining
			partialMock.data.result.json.basic_info.use_close_date = {};
			partialMock.data.result.json.basic_info.state = { value: 'live' };
			return Promise.resolve(partialMock);
		});

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(await screen.findByText('APPLICATION DOCUMENTS')).toBeInTheDocument();
	});

	test('should render ViewVacancyDetails with use_close_date value of 1', async () => {
		useParams.mockReturnValue({ sysId: '111' });
		axios.get.mockImplementationOnce(() => {
			const closeDateMock = { ...mockVacancy2 };
			closeDateMock.data.result.json.basic_info.use_close_date = { value: '1' };
			return Promise.resolve(closeDateMock);
		});

		render(
			<MemoryRouter>
				<ViewVacancyDetails />
			</MemoryRouter>
		);

		expect(await screen.findByText('HHS and NIH are Equal Opportunity Employers')).toBeInTheDocument();
	});
});
