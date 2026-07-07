import axios from 'axios';
import {
	GET_ADMIN_VACANCY_STATS,
	GET_ADMIN_APPLICATION_STATS,
	GET_ADMIN_USER_ACTIVITY,
	GET_ADMIN_COMMITTEE_PERFORMANCE,
	GET_ADMIN_COMPLIANCE_REPORT,
	GET_ADMIN_SYSTEM_AUDIT,
} from '../constants/ApiEndpoints';

/**
 * Admin Query Service
 * Provides reusable query builders and fetchers for admin analytics and reporting
 */

/**
 * Fetch vacancy statistics including total vacancies by status, 
 * vacancy timeline, and positions filled vs open
 * @param {Object} filters - Query filters (dateRange, status, etc.)
 * @returns {Promise} Vacancy statistics data
 */
export const fetchVacancyStats = async (filters = {}) => {
	try {
		const response = await axios.get(GET_ADMIN_VACANCY_STATS, { params: filters });
		return response.data.result;
	} catch (error) {
		console.error('Error fetching vacancy stats:', error);
		throw error;
	}
};

/**
 * Fetch application analytics including applications by status,
 * approval rates, and time-to-hire metrics
 * @param {Object} filters - Query filters (dateRange, status, vacancyId, etc.)
 * @returns {Promise} Application analytics data
 */
export const fetchApplicationStats = async (filters = {}) => {
	try {
		const response = await axios.get(GET_ADMIN_APPLICATION_STATS, { params: filters });
		return response.data.result;
	} catch (error) {
		console.error('Error fetching application stats:', error);
		throw error;
	}
};

/**
 * Fetch user activity metrics including active users, 
 * user role distribution, and login frequency
 * @param {Object} filters - Query filters (dateRange, role, department, etc.)
 * @returns {Promise} User activity data
 */
export const fetchUserActivity = async (filters = {}) => {
	try {
		const response = await axios.get(GET_ADMIN_USER_ACTIVITY, { params: filters });
		return response.data.result;
	} catch (error) {
		console.error('Error fetching user activity:', error);
		throw error;
	}
};

/**
 * Fetch committee performance metrics including participation rates,
 * scoring patterns, and decision statistics
 * @param {Object} filters - Query filters (dateRange, vacancyId, committeeId, etc.)
 * @returns {Promise} Committee performance data
 */
export const fetchCommitteePerformance = async (filters = {}) => {
	try {
		const response = await axios.get(GET_ADMIN_COMMITTEE_PERFORMANCE, { params: filters });
		return response.data.result;
	} catch (error) {
		console.error('Error fetching committee performance:', error);
		throw error;
	}
};

/**
 * Fetch compliance metrics including required documents submission rates,
 * reference collection rates, and deadline adherence
 * @param {Object} filters - Query filters (dateRange, vacancyId, compliance type, etc.)
 * @returns {Promise} Compliance metrics data
 */
export const fetchComplianceReport = async (filters = {}) => {
	try {
		const response = await axios.get(GET_ADMIN_COMPLIANCE_REPORT, { params: filters });
		return response.data.result;
	} catch (error) {
		console.error('Error fetching compliance report:', error);
		throw error;
	}
};

/**
 * Fetch system audit logs for admin oversight including who accessed 
 * what data and when
 * @param {Object} filters - Query filters (dateRange, userId, action, etc.)
 * @returns {Promise} Audit log data
 */
export const fetchSystemAudit = async (filters = {}) => {
	try {
		const response = await axios.get(GET_ADMIN_SYSTEM_AUDIT, { params: filters });
		return response.data.result;
	} catch (error) {
		console.error('Error fetching system audit logs:', error);
		throw error;
	}
};

/**
 * Generic query builder for constructing complex admin queries
 * Allows filtering, sorting, pagination, and data export options
 */
export class AdminQueryBuilder {
	constructor() {
		this.filters = {};
		this.sortBy = null;
		this.sortOrder = 'asc';
		this.pageNumber = 1;
		this.pageSize = 50;
		this.exportFormat = null;
	}

	/**
	 * Add a date range filter
	 * @param {String} fieldName - Field to filter by date
	 * @param {Date} startDate - Start date
	 * @param {Date} endDate - End date
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	addDateRangeFilter(fieldName, startDate, endDate) {
		this.filters[fieldName] = {
			type: 'dateRange',
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
		};
		return this;
	}

	/**
	 * Add a status filter
	 * @param {String} status - Status value to filter by
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	addStatusFilter(status) {
		this.filters.status = status;
		return this;
	}

	/**
	 * Add a role filter
	 * @param {String} role - User role to filter by
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	addRoleFilter(role) {
		this.filters.role = role;
		return this;
	}

	/**
	 * Add a vacancy filter
	 * @param {String} vacancyId - Vacancy ID to filter by
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	addVacancyFilter(vacancyId) {
		this.filters.vacancy_id = vacancyId;
		return this;
	}

	/**
	 * Add a committee filter
	 * @param {String} committeeId - Committee ID to filter by
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	addCommitteeFilter(committeeId) {
		this.filters.committee_id = committeeId;
		return this;
	}

	/**
	 * Add a department filter
	 * @param {String} department - Department to filter by
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	addDepartmentFilter(department) {
		this.filters.department = department;
		return this;
	}

	/**
	 * Add a custom filter
	 * @param {String} fieldName - Field name
	 * @param {*} value - Filter value
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	addFilter(fieldName, value) {
		this.filters[fieldName] = value;
		return this;
	}

	/**
	 * Set sorting parameters
	 * @param {String} fieldName - Field to sort by
	 * @param {String} order - Sort order ('asc' or 'desc')
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	setSorting(fieldName, order = 'asc') {
		this.sortBy = fieldName;
		this.sortOrder = order;
		return this;
	}

	/**
	 * Set pagination parameters
	 * @param {Number} pageNumber - Page number (1-indexed)
	 * @param {Number} pageSize - Number of records per page
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	setPagination(pageNumber, pageSize) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		return this;
	}

	/**
	 * Set export format
	 * @param {String} format - Export format ('csv', 'excel', 'pdf', or null for raw)
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	setExportFormat(format) {
		this.exportFormat = format;
		return this;
	}

	/**
	 * Build the query parameters object
	 * @returns {Object} Query parameters
	 */
	build() {
		const params = {
			...this.filters,
			sort_by: this.sortBy,
			sort_order: this.sortOrder,
			page: this.pageNumber,
			page_size: this.pageSize,
		};

		if (this.exportFormat) {
			params.export_format = this.exportFormat;
		}

		return params;
	}

	/**
	 * Clear all filters and reset to default state
	 * @returns {AdminQueryBuilder} - Returns this for chaining
	 */
	reset() {
		this.filters = {};
		this.sortBy = null;
		this.sortOrder = 'asc';
		this.pageNumber = 1;
		this.pageSize = 50;
		this.exportFormat = null;
		return this;
	}
}

export default {
	fetchVacancyStats,
	fetchApplicationStats,
	fetchUserActivity,
	fetchCommitteePerformance,
	fetchComplianceReport,
	fetchSystemAudit,
	AdminQueryBuilder,
};
