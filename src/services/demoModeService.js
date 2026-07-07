/**
 * Demo Mode Service
 * Provides axios interceptor to stub API calls with mock data when demo mode is enabled
 */

import axios from 'axios';
import {
	mockVacancyStats,
	mockApplicationStats,
	mockUserActivity,
	mockCommitteePerformance,
	mockComplianceReport,
	mockSystemAudit,
} from './mockAdminData';
import {
	GET_ADMIN_VACANCY_STATS,
	GET_ADMIN_APPLICATION_STATS,
	GET_ADMIN_USER_ACTIVITY,
	GET_ADMIN_COMMITTEE_PERFORMANCE,
	GET_ADMIN_COMPLIANCE_REPORT,
	GET_ADMIN_SYSTEM_AUDIT,
} from '../constants/ApiEndpoints';

// Check if demo mode is enabled via environment variable or localStorage
export const isDemoMode = () => {
	// Check environment variable first
	if (process.env.REACT_APP_DEMO_MODE === 'true') {
		return true;
	}
	// Check localStorage for runtime toggle
	try {
		return localStorage.getItem('appTrackerDemoMode') === 'true';
	} catch (e) {
		return false;
	}
};

// Enable or disable demo mode at runtime
export const setDemoMode = (enabled) => {
	try {
		if (enabled) {
			localStorage.setItem('appTrackerDemoMode', 'true');
		} else {
			localStorage.removeItem('appTrackerDemoMode');
		}
	} catch (e) {
		console.warn('Could not persist demo mode setting:', e);
	}
};

/**
 * Setup axios interceptor for demo mode
 * Intercepts admin API calls and returns mock data
 */
export const setupDemoModeInterceptor = () => {
	if (!isDemoMode()) {
		return;
	}

	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			// If error is due to network or API not available, try to provide mock data
			const config = error.config;

			if (!config || !isDemoMode()) {
				return Promise.reject(error);
			}

			// Map API endpoints to mock data
			const mockDataMap = {
				[GET_ADMIN_VACANCY_STATS]: mockVacancyStats,
				[GET_ADMIN_APPLICATION_STATS]: mockApplicationStats,
				[GET_ADMIN_USER_ACTIVITY]: mockUserActivity,
				[GET_ADMIN_COMMITTEE_PERFORMANCE]: mockCommitteePerformance,
				[GET_ADMIN_COMPLIANCE_REPORT]: mockComplianceReport,
				[GET_ADMIN_SYSTEM_AUDIT]: mockSystemAudit,
			};

			// Check if this is an admin API call
			for (const [endpoint, mockData] of Object.entries(mockDataMap)) {
				if (config.url.includes(endpoint)) {
					// Return mock data as successful response
					return Promise.resolve({
						...error.response,
						data: { result: mockData },
						status: 200,
						statusText: 'OK (DEMO MODE)',
					});
				}
			}

			return Promise.reject(error);
		}
	);
};

/**
 * Alternative interceptor that always returns mock data for admin endpoints when demo mode is enabled
 * This ensures mock data is returned regardless of network status
 */
export const setupDemoModeInterceptorForce = () => {
	if (!isDemoMode()) {
		return;
	}

	// Intercept requests to inject mock data
	axios.interceptors.request.use((config) => {
		if (!isDemoMode()) {
			return config;
		}

		const mockDataMap = {
			[GET_ADMIN_VACANCY_STATS]: mockVacancyStats,
			[GET_ADMIN_APPLICATION_STATS]: mockApplicationStats,
			[GET_ADMIN_USER_ACTIVITY]: mockUserActivity,
			[GET_ADMIN_COMMITTEE_PERFORMANCE]: mockCommitteePerformance,
			[GET_ADMIN_COMPLIANCE_REPORT]: mockComplianceReport,
			[GET_ADMIN_SYSTEM_AUDIT]: mockSystemAudit,
		};

		// Check if this is an admin API call
		for (const [endpoint] of Object.entries(mockDataMap)) {
			if (config.url.includes(endpoint)) {
				// Mark config to handle in response interceptor
				config.isDemoMode = true;
				break;
			}
		}

		return config;
	});

	// Return mock data in response interceptor
	axios.interceptors.response.use(
		(response) => {
			if (!isDemoMode() || !response.config.isDemoMode) {
				return response;
			}

			const mockDataMap = {
				[GET_ADMIN_VACANCY_STATS]: mockVacancyStats,
				[GET_ADMIN_APPLICATION_STATS]: mockApplicationStats,
				[GET_ADMIN_USER_ACTIVITY]: mockUserActivity,
				[GET_ADMIN_COMMITTEE_PERFORMANCE]: mockCommitteePerformance,
				[GET_ADMIN_COMPLIANCE_REPORT]: mockComplianceReport,
				[GET_ADMIN_SYSTEM_AUDIT]: mockSystemAudit,
			};

			// Get matching mock data
			for (const [endpoint, mockData] of Object.entries(mockDataMap)) {
				if (response.config.url.includes(endpoint)) {
					response.data = { result: mockData };
					response.statusText = 'OK (DEMO MODE)';
					break;
				}
			}

			return response;
		},
		(error) => {
			// Error handler: return mock data for failed admin API calls in demo mode
			if (!isDemoMode() || !error.config?.isDemoMode) {
				return Promise.reject(error);
			}

			const mockDataMap = {
				[GET_ADMIN_VACANCY_STATS]: mockVacancyStats,
				[GET_ADMIN_APPLICATION_STATS]: mockApplicationStats,
				[GET_ADMIN_USER_ACTIVITY]: mockUserActivity,
				[GET_ADMIN_COMMITTEE_PERFORMANCE]: mockCommitteePerformance,
				[GET_ADMIN_COMPLIANCE_REPORT]: mockComplianceReport,
				[GET_ADMIN_SYSTEM_AUDIT]: mockSystemAudit,
			};

			// Find matching endpoint and return mock data instead of error
			for (const [endpoint, mockData] of Object.entries(mockDataMap)) {
				if (error.config.url.includes(endpoint)) {
					return Promise.resolve({
						data: { result: mockData },
						status: 200,
						statusText: 'OK (DEMO MODE)',
						config: error.config,
					});
				}
			}

			return Promise.reject(error);
		}
	);
};

export default {
	isDemoMode,
	setDemoMode,
	setupDemoModeInterceptor,
	setupDemoModeInterceptorForce,
};
