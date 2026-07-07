import { useEffect, useState } from 'react';
import {
	fetchVacancyStats,
	fetchApplicationStats,
	fetchUserActivity,
	fetchCommitteePerformance,
	fetchComplianceReport,
	fetchSystemAudit,
} from '../services/adminQueries';

/**
 * Custom React hook for fetching vacancy analytics
 * @param {Object} filters - Query filters
 * @returns {Object} Hook state and methods
 */
export const useVacancyAnalytics = (filters = {}) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const filterString = JSON.stringify(filters);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const result = await fetchVacancyStats(filters);
				setData(result);
				setError(null);
			} catch (err) {
				setError(err);
				setData(null);
			} finally {
				setLoading(false);
			}
		})();
	}, [filterString]);

	const refetch = async (newFilters = {}) => {
		try {
			setLoading(true);
			const result = await fetchVacancyStats(newFilters);
			setData(result);
			setError(null);
		} catch (err) {
			setError(err);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, refetch };
};

/**
 * Custom React hook for fetching application analytics
 * @param {Object} filters - Query filters
 * @returns {Object} Hook state and methods
 */
export const useApplicationAnalytics = (filters = {}) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const filterString = JSON.stringify(filters);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const result = await fetchApplicationStats(filters);
				setData(result);
				setError(null);
			} catch (err) {
				setError(err);
				setData(null);
			} finally {
				setLoading(false);
			}
		})();
	}, [filterString]);

	const refetch = async (newFilters = {}) => {
		try {
			setLoading(true);
			const result = await fetchApplicationStats(newFilters);
			setData(result);
			setError(null);
		} catch (err) {
			setError(err);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, refetch };
};

/**
 * Custom React hook for fetching user activity metrics
 * @param {Object} filters - Query filters
 * @returns {Object} Hook state and methods
 */
export const useUserActivityReport = (filters = {}) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const filterString = JSON.stringify(filters);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const result = await fetchUserActivity(filters);
				setData(result);
				setError(null);
			} catch (err) {
				setError(err);
				setData(null);
			} finally {
				setLoading(false);
			}
		})();
	}, [filterString]);

	const refetch = async (newFilters = {}) => {
		try {
			setLoading(true);
			const result = await fetchUserActivity(newFilters);
			setData(result);
			setError(null);
		} catch (err) {
			setError(err);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, refetch };
};

/**
 * Custom React hook for fetching committee performance metrics
 * @param {Object} filters - Query filters
 * @returns {Object} Hook state and methods
 */
export const useCommitteePerformance = (filters = {}) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const filterString = JSON.stringify(filters);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const result = await fetchCommitteePerformance(filters);
				setData(result);
				setError(null);
			} catch (err) {
				setError(err);
				setData(null);
			} finally {
				setLoading(false);
			}
		})();
	}, [filterString]);

	const refetch = async (newFilters = {}) => {
		try {
			setLoading(true);
			const result = await fetchCommitteePerformance(newFilters);
			setData(result);
			setError(null);
		} catch (err) {
			setError(err);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, refetch };
};

/**
 * Custom React hook for fetching compliance metrics
 * @param {Object} filters - Query filters
 * @returns {Object} Hook state and methods
 */
export const useComplianceReport = (filters = {}) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const filterString = JSON.stringify(filters);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const result = await fetchComplianceReport(filters);
				setData(result);
				setError(null);
			} catch (err) {
				setError(err);
				setData(null);
			} finally {
				setLoading(false);
			}
		})();
	}, [filterString]);

	const refetch = async (newFilters = {}) => {
		try {
			setLoading(true);
			const result = await fetchComplianceReport(newFilters);
			setData(result);
			setError(null);
		} catch (err) {
			setError(err);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, refetch };
};

/**
 * Custom React hook for fetching system audit logs
 * @param {Object} filters - Query filters
 * @returns {Object} Hook state and methods
 */
export const useSystemAuditLog = (filters = {}) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const filterString = JSON.stringify(filters);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				const result = await fetchSystemAudit(filters);
				setData(result);
				setError(null);
			} catch (err) {
				setError(err);
				setData(null);
			} finally {
				setLoading(false);
			}
		})();
	}, [filterString]);

	const refetch = async (newFilters = {}) => {
		try {
			setLoading(true);
			const result = await fetchSystemAudit(newFilters);
			setData(result);
			setError(null);
		} catch (err) {
			setError(err);
			setData(null);
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, refetch };
};

export default {
	useVacancyAnalytics,
	useApplicationAnalytics,
	useUserActivityReport,
	useCommitteePerformance,
	useComplianceReport,
	useSystemAuditLog,
};
