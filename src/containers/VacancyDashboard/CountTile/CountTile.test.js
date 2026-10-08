import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import CountTile from './CountTile';
import * as RoleValidator from '../../../components/Util/RoleValidator/RoleValidator';
import { OWM_TEAM } from '../../../constants/Roles';

jest.mock('axios');
jest.mock('../../../components/Util/RoleValidator/RoleValidator');

describe('CountTile Component', () => {
	const mockApiUrl = 'http://test-api.com/count';
	const mockTitle = 'Test Count';
	const mockCurrentTenant = 'tenant-1';
	const mockTenants = [
		{
			value: 'tenant-1',
			roles: [OWM_TEAM],
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render the component with title', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 5,
				},
			},
		});

		render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		expect(screen.getByText(mockTitle)).toBeInTheDocument();
	});

	it('should display loading state initially', () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

		const { container } = render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		// Check for loading icon (LoadingOutlined)
		const loadingIcon = container.querySelector('.anticon-loading');
		expect(loadingIcon).toBeInTheDocument();
	});

	it('should display count after successful API call', async () => {
		const mockCount = 42;
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: mockCount,
				},
			},
		});

		render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(screen.getByText(mockCount.toString())).toBeInTheDocument();
		});
	});

	it('should make API call with correct URL', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 10,
				},
			},
		});

		render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledWith(mockApiUrl);
		});
	});

	it('should set count to 0 when role validation fails', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(false);

		render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(screen.getByText('0')).toBeInTheDocument();
		});

		// API should not be called when role validation fails
		expect(axios.get).not.toHaveBeenCalled();
	});

	it('should not call API when role validation fails', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(false);

		render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(screen.getByText('0')).toBeInTheDocument();
		});

		expect(axios.get).not.toHaveBeenCalled();
	});

	it('should call validateRoleForCurrentTenant with correct parameters', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 5,
				},
			},
		});

		render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(
				RoleValidator.validateRoleForCurrentTenant
			).toHaveBeenCalledWith(OWM_TEAM, mockCurrentTenant, mockTenants);
		});
	});

	it('should re-fetch data when data prop changes', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 5,
				},
			},
		});

		const { rerender } = render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{ id: 1 }}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(1);
		});

		// Re-render with different data prop
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 10,
				},
			},
		});

		rerender(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{ id: 2 }}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(2);
		});
	});

	it('should re-fetch data when currentTenant changes', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 5,
				},
			},
		});

		const { rerender } = render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant="tenant-1"
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(1);
		});

		// Re-render with different currentTenant
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 15,
				},
			},
		});

		rerender(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant="tenant-2"
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(2);
		});
	});

	it('should render correctly with zero count', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 0,
				},
			},
		});

		render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(screen.getByText('0')).toBeInTheDocument();
		});
	});

	it('should render with correct CSS classes', async () => {
		RoleValidator.validateRoleForCurrentTenant.mockReturnValue(true);
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					count: 5,
				},
			},
		});

		const { container } = render(
			<CountTile
				apiUrl={mockApiUrl}
				title={mockTitle}
				data={{}}
				currentTenant={mockCurrentTenant}
				tenants={mockTenants}
			/>
		);

		await waitFor(() => {
			expect(container.querySelector('.CountTileContainer')).toBeInTheDocument();
			expect(container.querySelector('.CountTileCount')).toBeInTheDocument();
			expect(container.querySelector('.CountTileTitle')).toBeInTheDocument();
		});
	});
});
