import { renderHook, waitFor } from '@testing-library/react-hooks';
import axios from 'axios';
import {
	useVacancyAnalytics,
	useApplicationAnalytics,
	useUserActivityReport,
	useCommitteePerformance,
	useComplianceReport,
	useSystemAuditLog,
} from './useAdminQueries';

jest.mock('axios');

describe('Admin Query Hooks', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('useVacancyAnalytics', () => {
		it('should fetch vacancy analytics on mount', async () => {
			const mockData = { result: [{ id: 1, name: 'Vacancy 1' }] };
			axios.get.mockResolvedValueOnce({ data: mockData });

			const { result } = renderHook(() => useVacancyAnalytics({}));

			expect(result.current.loading).toBe(true);

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.data).toEqual(mockData.result);
			expect(result.current.error).toBe(null);
		});

		it('should handle fetch error', async () => {
			const mockError = new Error('Fetch failed');
			axios.get.mockRejectedValueOnce(mockError);

			const { result } = renderHook(() => useVacancyAnalytics({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe(mockError);
			expect(result.current.data).toBe(null);
		});
	});

	describe('useApplicationAnalytics', () => {
		it('should fetch application analytics on mount', async () => {
			const mockData = { result: [{ id: 1, status: 'approved' }] };
			axios.get.mockResolvedValueOnce({ data: mockData });

			const { result } = renderHook(() => useApplicationAnalytics({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.data).toEqual(mockData.result);
			expect(result.current.error).toBe(null);
		});
	});

	describe('useUserActivityReport', () => {
		it('should fetch user activity data on mount', async () => {
			const mockData = { result: [{ id: 1, userId: 'user123' }] };
			axios.get.mockResolvedValueOnce({ data: mockData });

			const { result } = renderHook(() => useUserActivityReport({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.data).toEqual(mockData.result);
		});
	});

	describe('useCommitteePerformance', () => {
		it('should fetch committee performance data on mount', async () => {
			const mockData = { result: [{ id: 1, score: 85 }] };
			axios.get.mockResolvedValueOnce({ data: mockData });

			const { result } = renderHook(() => useCommitteePerformance({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.data).toEqual(mockData.result);
		});
	});

	describe('useComplianceReport', () => {
		it('should fetch compliance data on mount', async () => {
			const mockData = { result: [{ id: 1, status: 'compliant' }] };
			axios.get.mockResolvedValueOnce({ data: mockData });

			const { result } = renderHook(() => useComplianceReport({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.data).toEqual(mockData.result);
		});
	});

	describe('useSystemAuditLog', () => {
		it('should fetch audit logs on mount', async () => {
			const mockData = { result: [{ id: 1, action: 'login' }] };
			axios.get.mockResolvedValueOnce({ data: mockData });

			const { result } = renderHook(() => useSystemAuditLog({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.data).toEqual(mockData.result);
		});
	});
});
