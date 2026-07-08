import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';
import * as adminQueries from '../../hooks/useAdminQueries';

jest.mock('../../hooks/useAdminQueries');
jest.mock('antd');

describe('AdminDashboard', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Mock all hooks
		adminQueries.useVacancyAnalytics.mockReturnValue({
			data: {
				totalVacancies: 10,
				vacanciesFilled: 5,
				totalTimeToHire: 100,
				statusBreakdown: { open: 5, closed: 5 },
			},
			loading: false,
			error: null,
			refetch: jest.fn(),
		});

		adminQueries.useApplicationAnalytics.mockReturnValue({
			data: {
				totalApplications: 100,
				applicationsApproved: 50,
				applicationsWithdrawn: 10,
				pipelineStages: { submitted: 40, reviewed: 30, approved: 30 },
				applicationTimeline: [
					{ month: 'Jan', submitted: 15, approved: 5, rejected: 2 },
					{ month: 'Feb', submitted: 18, approved: 7, rejected: 3 },
					{ month: 'Mar', submitted: 16, approved: 6, rejected: 2 },
					{ month: 'Apr', submitted: 20, approved: 8, rejected: 4 },
					{ month: 'May', submitted: 18, approved: 7, rejected: 3 },
					{ month: 'Jun', submitted: 19, approved: 8, rejected: 3 },
				],
			},
			loading: false,
			error: null,
			refetch: jest.fn(),
		});

		adminQueries.useUserActivityReport.mockReturnValue({
			data: {
				activeUsers: 25,
				totalUsers: 50,
				roleDistribution: { admin: 5, reviewer: 20, user: 25 },
			},
			loading: false,
			error: null,
			refetch: jest.fn(),
		});

		adminQueries.useCommitteePerformance.mockReturnValue({
			data: {
				committeeParticipating: 8,
				totalCommittee: 10,
				totalReviewTime: 80,
				reviewsCompleted: 20,
				memberScores: [
					{ id: 1, name: 'John Doe', avgScore: 85 },
					{ id: 2, name: 'Jane Smith', avgScore: 90 },
				],
			},
			loading: false,
			error: null,
			refetch: jest.fn(),
		});

		adminQueries.useComplianceReport.mockReturnValue({
			data: {
				documentsSubmitted: 45,
				documentsRequired: 50,
				referencesSubmitted: 48,
				referencesRequested: 50,
				onTimeCompletions: 95,
				totalCompletions: 100,
				complianceStatus: { compliant: 95, noncompliant: 5 },
			},
			loading: false,
			error: null,
			refetch: jest.fn(),
		});

		adminQueries.useSystemAuditLog.mockReturnValue({
			data: [
				{
					id: 1,
					user_id: 'user123',
					action: 'login',
					timestamp: new Date().toISOString(),
				},
				{
					id: 2,
					user_id: 'user456',
					action: 'logout',
					timestamp: new Date().toISOString(),
				},
			],
			loading: false,
			error: null,
			refetch: jest.fn(),
		});
	});

	it('should render the admin dashboard', () => {
		render(<AdminDashboard />);
		expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
	});

	it('should render all tabs', () => {
		render(<AdminDashboard />);
		expect(screen.getByText('Vacancy Analytics')).toBeInTheDocument();
		expect(screen.getByText('Application Analytics')).toBeInTheDocument();
		expect(screen.getByText('User Activity')).toBeInTheDocument();
		expect(screen.getByText('Committee Performance')).toBeInTheDocument();
		expect(screen.getByText('Compliance')).toBeInTheDocument();
		expect(screen.getByText('System Audit')).toBeInTheDocument();
	});

	it('should handle loading state', () => {
		adminQueries.useVacancyAnalytics.mockReturnValue({
			data: null,
			loading: true,
			error: null,
			refetch: jest.fn(),
		});

		render(<AdminDashboard />);
		expect(screen.queryByText('Total Vacancies')).not.toBeInTheDocument();
	});

	it('should handle error state', () => {
		adminQueries.useVacancyAnalytics.mockReturnValue({
			data: null,
			loading: false,
			error: new Error('Failed to fetch'),
			refetch: jest.fn(),
		});

		render(<AdminDashboard />);
		expect(screen.getByText(/Error loading data/)).toBeInTheDocument();
	});

	it('should call refetch when refresh button is clicked', async () => {
		const mockRefetch = jest.fn();
		adminQueries.useVacancyAnalytics.mockReturnValue({
			data: { totalVacancies: 10 },
			loading: false,
			error: null,
			refetch: mockRefetch,
		});

		render(<AdminDashboard />);
		const refreshButton = screen.getByText('Refresh');
		fireEvent.click(refreshButton);

		await waitFor(() => {
			expect(mockRefetch).toHaveBeenCalled();
		});
	});
});
