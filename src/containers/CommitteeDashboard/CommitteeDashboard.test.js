import CommitteeDashboard from './CommitteeDashboard';
import { rtRender } from '../test-utils';
import { waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import {
	validateRoleForCurrentTenant,
	isExecSec,
} from '../../components/Util/RoleValidator/RoleValidator';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';

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
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useLocation: jest.fn(),
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

describe('CommitteeDashboard component tests', () => {
	const mockTenants = [
		{
			value: 'tenant1',
			label: 'Test Tenant',
			roles: ['x_g_nci_app_tracke.committee_member'],
			is_chair: true,
		},
	];

	const mockData = {
		status: 200,
		list: [
			{
				vacancy_id: 1,
				vacancy_title: 'Senior Dev',
				applicants: 5,
				status: 'open',
				user_role: 'committee_member',
			},
			{
				vacancy_id: 2,
				vacancy_title: 'Junior Dev',
				applicants: 3,
				status: 'under_review',
				user_role: 'committee_member',
			},
		],
	};

	beforeEach(() => {
		const mockPush = jest.fn();
		jest.requireMock('react-router-dom').useHistory.mockReturnValue({
			push: mockPush,
		});

		const antd = jest.requireMock('antd');
		antd.message.error = jest.fn();
		antd.message.destroy = jest.fn();

		useAuth.mockReturnValue({
			auth: {
				tenants: mockTenants,
				user: { isReadOnlyUser: false },
			},
			currentTenant: 'tenant1',
		});

		useLocation.mockReturnValue({
			pathname: '/committee-dashboard',
		});

		validateRoleForCurrentTenant.mockReturnValue(true);
		isExecSec.mockReturnValue(false);
		axios.get.mockResolvedValue({ data: { result: mockData } });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('<CommitteeDashboard /> crash test', () => {
		const { container } = rtRender(<CommitteeDashboard />);
		expect(container).toBeTruthy();
	});

	test('<CommitteeDashboard /> should render successfully with access', async () => {
		const { container } = rtRender(<CommitteeDashboard />);

		await waitFor(
			() => {
				expect(axios.get).toHaveBeenCalled();
			},
			{ timeout: 3000 }
		);

		expect(container).toBeTruthy();
	});

	test('<CommitteeDashboard /> should show error when user lacks access', async () => {
		const mockPush = jest.fn();
		jest.requireMock('react-router-dom').useHistory.mockReturnValue({
			push: mockPush,
		});

		// Mock to return false for this specific test
		validateRoleForCurrentTenant.mockImplementation(() => false);
		isExecSec.mockReturnValue(false);

		rtRender(<CommitteeDashboard />);

		await waitFor(() => {
			expect(
				screen.getByText(
					'Sorry! You do not have committee member access in the selected tenant.'
				)
			).toBeInTheDocument();
			expect(mockPush).toHaveBeenCalledWith('/');
		});
	});

	test('<CommitteeDashboard /> should call validateRoleForCurrentTenant on load', async () => {
		rtRender(<CommitteeDashboard />);

		await waitFor(() => {
			expect(validateRoleForCurrentTenant).toHaveBeenCalled();
		});
	});

	test('<CommitteeDashboard /> should allow access for exec sec', async () => {
		validateRoleForCurrentTenant.mockReturnValue(false);
		isExecSec.mockReturnValue(true);

		const { container } = rtRender(<CommitteeDashboard />);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalled();
		});
	});

	test('<CommitteeDashboard /> should hide scoring columns for read-only users', async () => {
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					status: 200,
					list: [
						{
							vacancy_id: 21,
							vacancy_title: 'Readonly Vacancy',
							applicants: 1,
							status: 'open',
						},
					],
				},
			},
		});

		useAuth.mockReturnValue({
			auth: {
				tenants: mockTenants,
				user: { isReadOnlyUser: true },
			},
			currentTenant: 'tenant1',
		});

		rtRender(<CommitteeDashboard />);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalled();
		});

		expect(screen.getByText('Vacancy Title')).toBeInTheDocument();
		expect(screen.getByText('Applicants')).toBeInTheDocument();
		expect(screen.getByText('Status')).toBeInTheDocument();
		expect(screen.queryByText('Scoring Due By')).not.toBeInTheDocument();
		expect(screen.queryByText('Your Scoring')).not.toBeInTheDocument();
	});

	test('<CommitteeDashboard /> should render applicants/status/scoring values correctly', async () => {
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					status: 200,
					list: [
						{
							vacancy_id: 31,
							vacancy_title: 'Role One',
							applicants: 1,
							status: 'under_review',
							your_scoring: 'Pending',
						},
						{
							vacancy_id: 32,
							vacancy_title: 'Role Two',
							applicants: undefined,
							status: 'open',
							your_scoring: 'Approved',
						},
						{
							vacancy_id: 33,
							vacancy_title: 'Role Three',
							applicants: 2,
							status: 'owm_review',
							your_scoring: 'Pending',
						},
					],
				},
			},
		});

		rtRender(<CommitteeDashboard />);

		await waitFor(() => {
			expect(screen.getByText('Role One')).toBeInTheDocument();
			expect(screen.getByText('Role Two')).toBeInTheDocument();
			expect(screen.getByText('Role Three')).toBeInTheDocument();
		});

		expect(screen.getByText(/1\s*applicant/i)).toBeInTheDocument();
		expect(screen.getByText(/0\s*applicants/i)).toBeInTheDocument();
		expect(screen.getByText(/2\s*applicants/i)).toBeInTheDocument();

		expect(screen.getByText('Under Review')).toBeInTheDocument();
		expect(screen.getByText('Open')).toBeInTheDocument();
		expect(screen.getByText('Owm Review')).toBeInTheDocument();

		expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
		expect(screen.getByText('Approved')).toBeInTheDocument();
	});

	test('<CommitteeDashboard /> should filter vacancies for exec sec dashboard route', async () => {
		const { EXE_SEC_DASHBOARD } = require('../../constants/Routes.js');
		const { COMMITTEE_EXEC_SEC } = require('../../constants/Roles.js');

		useLocation.mockReturnValue({
			pathname: EXE_SEC_DASHBOARD,
		});

		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					status: 200,
					list: [
						{
							vacancy_id: 11,
							vacancy_title: 'Exec Sec Vacancy',
							applicants: 2,
							status: 'open',
							user_role: COMMITTEE_EXEC_SEC,
						},
						{
							vacancy_id: 12,
							vacancy_title: 'Committee Vacancy',
							applicants: 3,
							status: 'under_review',
							user_role: 'committee_member',
						},
					],
				},
			},
		});

		rtRender(<CommitteeDashboard />);

		await waitFor(() => {
			expect(screen.getByText('Exec Sec Vacancy')).toBeInTheDocument();
		});

		expect(screen.queryByText('Committee Vacancy')).not.toBeInTheDocument();
	});
});
