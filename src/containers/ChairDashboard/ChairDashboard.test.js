import ChairDashboard from './ChairDashboard';
import { rtRender } from '../test-utils';
import { message as antdMessage } from 'antd';
import axios from 'axios';
import { GET_COMMITTEE_CHAIR_VACANCIES } from '../../constants/ApiEndpoints';
import useAuth from '../../hooks/useAuth';
import { validateRoleForCurrentTenant } from '../../components/Util/RoleValidator/RoleValidator';
import { useHistory } from 'react-router-dom';
import { waitFor, screen, fireEvent } from '@testing-library/react';

const { message } = jest.requireMock('antd');
jest.mock('antd', () => {
	const actual = jest.requireActual('antd');
	return {
		...actual,
		message: {
			error: jest.fn(),
			destroy: jest.fn(),
		},
	};
});

jest.mock('axios');
jest.mock('../../hooks/useAuth');
jest.mock('../../components/Util/RoleValidator/RoleValidator');
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useHistory: jest.fn(),
}));

window.matchMedia =
	window.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {},
		};
	};

describe('ChairDashboard component tests', () => {
	const mockVacancies = {
		status: 200,
		list: [
			{
				vacancy_id: 1,
				vacancy_title: 'Senior Dev',
				applicants: 5,
				status: 'open',
			},
			{
				vacancy_id: 2,
				vacancy_title: 'Junior Dev',
				applicants: 3,
				status: 'under_review',
			},
		],
	};

	beforeEach(() => {
		const mockPush = jest.fn();
		jest.requireMock('react-router-dom').useHistory.mockReturnValue({
			push: mockPush,
		});

		useAuth.mockReturnValue({
			auth: {
				tenants: [
					{
						value: 'f24965fc1b9c11106daea681f54bcb04',
						label: 'tenant 1',
						roles: [
							'x_g_nci_app_tracke.vacancy_manager',
							'x_g_nci_app_tracke.committee_member',
						],
						is_chair: true,
					},
				],
			},
			currentTenant: 'f24965fc1b9c11106daea681f54bcb04', // Match the tenant value
		});
		validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValue({ data: { result: mockVacancies } });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('<ChairDashboard /> crash test', async () => {
		const { container } = rtRender(<ChairDashboard />);
		expect(container).toBeTruthy();
	});

	test('<ChairDashboard /> should display header', async () => {
		rtRender(<ChairDashboard />);
		expect(await screen.findByText('Vacancies Assigned To You')).toBeInTheDocument();
	});

	test('<ChairDashboard /> should fetch vacancies on mount', () => {
		rtRender(<ChairDashboard />);
		expect(axios.get).toHaveBeenCalledWith(
			GET_COMMITTEE_CHAIR_VACANCIES + 'f24965fc1b9c11106daea681f54bcb04'
		);
	});

	test('<ChairDashboard /> should filter out live and final status vacancies', async () => {
		const vacanciesWithStatuses = {
			status: 200,
			list: [
				{
					vacancy_id: 1,
					vacancy_title: 'Open Job',
					applicants: 5,
					status: 'open',
				},
				{
					vacancy_id: 2,
					vacancy_title: 'Live Job',
					applicants: 10,
					status: 'live',
				},
				{
					vacancy_id: 3,
					vacancy_title: 'Final Job',
					applicants: 2,
					status: 'final',
				},
			],
		};
		axios.get.mockResolvedValue({ data: { result: vacanciesWithStatuses } });
		rtRender(<ChairDashboard />);
		await screen.findByText('Open Job');
		expect(screen.queryByText('Live Job')).not.toBeInTheDocument();
		expect(screen.queryByText('Final Job')).not.toBeInTheDocument();
	});

	test('<ChairDashboard /> should show error when user is not a committee member', async () => {
		const mockPush = jest.fn();
		jest.requireMock('react-router-dom').useHistory.mockReturnValue({
			push: mockPush,
		});

		validateRoleForCurrentTenant.mockReturnValueOnce(false);

		rtRender(<ChairDashboard />);

		await waitFor(
			() => {
				expect(
					screen.getByText(
						'Sorry! You do not have committee member access in the selected tenant.'
					)
				).toBeInTheDocument();
			},
			{ timeout: 2000 }
		);
		expect(mockPush).toHaveBeenCalledWith('/');
	});

	test('<ChairDashboard /> should display error message when API fails', async () => {
		axios.get.mockRejectedValue(new Error('API Error'));
		rtRender(<ChairDashboard />);
		await waitFor(
			() => {
				expect(
					screen.getByText(/Sorry! There was an error retrieving the vacancies/)
				).toBeInTheDocument();
			},
			{ timeout: 3000 }
		);
	});

	test('<ChairDashboard /> should display help desk email in error message', async () => {
		axios.get.mockRejectedValue(new Error('API Error'));
		rtRender(<ChairDashboard />);
		await waitFor(
			() => {
				const emailLink = screen.getByRole('link', {
					name: /NCIAppSupport@mail.nih.gov/i,
				});
				expect(emailLink).toHaveAttribute(
					'href',
					'mailto:NCIAppSupport@mail.nih.gov'
				);
			},
			{ timeout: 3000 }
		);
	});

	test('<ChairDashboard /> should render table with vacancies', async () => {
		rtRender(<ChairDashboard />);
		expect(await screen.findByText('Senior Dev')).toBeInTheDocument();
		expect(await screen.findByText('Junior Dev')).toBeInTheDocument();
	});

	test('<ChairDashboard /> should render table headers', async () => {
		rtRender(<ChairDashboard />);
		expect(await screen.findByText('Vacancy Title')).toBeInTheDocument();
		expect(await screen.findByText('Applicants')).toBeInTheDocument();
		expect(await screen.findByText('Status')).toBeInTheDocument();
	});

	test('<ChairDashboard /> should render vacancy title as link', async () => {
		rtRender(<ChairDashboard />);
		const vacancyTitle = await screen.findByText('Senior Dev');
		const vacancyLink = vacancyTitle.closest('a');
		expect(vacancyLink).toHaveAttribute('href', '#/manage/vacancy/1');
	});

	test('<ChairDashboard /> should render applicants count with correct singular/plural text', async () => {
		rtRender(<ChairDashboard />);
		expect(await screen.findByText('5 applicants')).toBeInTheDocument();
		expect(await screen.findByText('3 applicants')).toBeInTheDocument();
	});

	test('<ChairDashboard /> should render single applicant with singular text', async () => {
		const vacanciesWithSingleApplicant = {
			status: 200,
			list: [
				{
					vacancy_id: 1,
					vacancy_title: 'Senior Dev',
					applicants: 1,
					status: 'open',
				},
			],
		};
		axios.get.mockResolvedValue({ data: { result: vacanciesWithSingleApplicant } });
		rtRender(<ChairDashboard />);
		expect(await screen.findByText('1 applicant')).toBeInTheDocument();
	});

	test('<ChairDashboard /> should render applicants link with correct href', async () => {
		rtRender(<ChairDashboard />);
		const applicantsText = await screen.findByText('5 applicants');
		const applicantsLink = applicantsText.closest('a');
		expect(applicantsLink).toHaveAttribute('href', '#/manage/vacancy/1/applicants');
	});

	test('<ChairDashboard /> should render empty state when no vacancies', async () => {
		const emptyVacancies = {
			status: 200,
			list: [],
		};
		axios.get.mockResolvedValue({ data: { result: emptyVacancies } });
		rtRender(<ChairDashboard />);
		expect(await screen.findByText('Vacancies Assigned To You')).toBeInTheDocument();
	});

	test('<ChairDashboard /> should display all vacancies when no filter matches', async () => {
		const allOpenVacancies = {
			status: 200,
			list: [
				{
					vacancy_id: 1,
					vacancy_title: 'Job 1',
					applicants: 5,
					status: 'open',
				},
				{
					vacancy_id: 2,
					vacancy_title: 'Job 2',
					applicants: 3,
					status: 'under_review',
				},
				{
					vacancy_id: 3,
					vacancy_title: 'Job 3',
					applicants: 8,
					status: 'review_complete',
				},
			],
		};
		axios.get.mockResolvedValue({ data: { result: allOpenVacancies } });
		rtRender(<ChairDashboard />);
		expect(await screen.findByText('Job 1')).toBeInTheDocument();
		expect(await screen.findByText('Job 2')).toBeInTheDocument();
		expect(await screen.findByText('Job 3')).toBeInTheDocument();
	});

	test('<ChairDashboard /> should display error UI when list payload is invalid', async () => {
		axios.get.mockResolvedValue({
			data: {
				result: {
					status: 200,
					list: 'invalid-list-value',
				},
			},
		});

		rtRender(<ChairDashboard />);

		expect(await screen.findByText('Unable to load vacancies')).toBeInTheDocument();
	});

	test('<ChairDashboard /> should sort vacancies by title when title header is clicked', async () => {
		const unsortedVacancies = {
			status: 200,
			list: [
				{
					vacancy_id: 10,
					vacancy_title: 'Zulu Role',
					applicants: 2,
					status: 'open',
				},
				{
					vacancy_id: 11,
					vacancy_title: 'Alpha Role',
					applicants: 4,
					status: 'open',
				},
			],
		};

		axios.get.mockResolvedValue({ data: { result: unsortedVacancies } });
		const localeCompareSpy = jest.spyOn(String.prototype, 'localeCompare');
		rtRender(<ChairDashboard />);

		await screen.findByText('Zulu Role');
		await screen.findByText('Alpha Role');
		const titleHeader = screen.getByText('Vacancy Title');
		fireEvent.click(titleHeader);

		await waitFor(() => {
			expect(localeCompareSpy).toHaveBeenCalled();
		});

		localeCompareSpy.mockRestore();
	});
});
