/**
 * Query Builder Utility
 * Provides flexible query building capabilities with support for:
 * - Date ranges (custom periods, quarters, fiscal years)
 * - User roles and departments
 * - Vacancy status and position types
 * - Application stages and outcomes
 * - Committee assignments
 * - Sorting, pagination, and data export
 */

// Predefined date range presets
export const DATE_RANGE_PRESETS = {
	TODAY: 'today',
	YESTERDAY: 'yesterday',
	LAST_7_DAYS: 'last_7_days',
	LAST_30_DAYS: 'last_30_days',
	LAST_QUARTER: 'last_quarter',
	THIS_QUARTER: 'this_quarter',
	LAST_FISCAL_YEAR: 'last_fiscal_year',
	THIS_FISCAL_YEAR: 'this_fiscal_year',
	CUSTOM: 'custom',
};

/**
 * Calculate date range based on preset
 * @param {String} preset - Date range preset
 * @param {Date} customStart - Custom start date (for CUSTOM preset)
 * @param {Date} customEnd - Custom end date (for CUSTOM preset)
 * @returns {Object} Object with startDate and endDate
 */
export const getDateRangeFromPreset = (preset, customStart = null, customEnd = null) => {
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();
	let startDate, endDate;

	switch (preset) {
		case DATE_RANGE_PRESETS.TODAY:
			startDate = new Date(currentYear, currentMonth, now.getDate());
			endDate = new Date(currentYear, currentMonth, now.getDate(), 23, 59, 59);
			break;
		case DATE_RANGE_PRESETS.YESTERDAY:
			startDate = new Date(currentYear, currentMonth, now.getDate() - 1);
			endDate = new Date(currentYear, currentMonth, now.getDate() - 1, 23, 59, 59);
			break;
		case DATE_RANGE_PRESETS.LAST_7_DAYS:
			endDate = new Date();
			startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
			break;
		case DATE_RANGE_PRESETS.LAST_30_DAYS:
			endDate = new Date();
			startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
			break;
		case DATE_RANGE_PRESETS.LAST_QUARTER:
			endDate = new Date(currentYear, currentMonth, 1);
			startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, 1);
			break;
		case DATE_RANGE_PRESETS.THIS_QUARTER:
			const quarterStart = Math.floor(currentMonth / 3) * 3;
			startDate = new Date(currentYear, quarterStart, 1);
			endDate = new Date();
			break;
		case DATE_RANGE_PRESETS.LAST_FISCAL_YEAR:
			const fiscalYearStart = 10; // October
			if (currentMonth >= fiscalYearStart) {
				endDate = new Date(currentYear + 1, fiscalYearStart - 1, 1);
				startDate = new Date(currentYear, fiscalYearStart, 1);
			} else {
				endDate = new Date(currentYear, fiscalYearStart - 1, 1);
				startDate = new Date(currentYear - 1, fiscalYearStart, 1);
			}
			break;
		case DATE_RANGE_PRESETS.THIS_FISCAL_YEAR:
			const thisFiscalStart = 10; // October
			if (currentMonth >= thisFiscalStart) {
				startDate = new Date(currentYear, thisFiscalStart, 1);
				endDate = new Date();
			} else {
				startDate = new Date(currentYear - 1, thisFiscalStart, 1);
				endDate = new Date();
			}
			break;
		case DATE_RANGE_PRESETS.CUSTOM:
			startDate = customStart;
			endDate = customEnd;
			break;
		default:
			endDate = new Date();
			startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
	}

	return { startDate, endDate };
};

/**
 * Filter builder for vacancy queries
 */
export class VacancyFilterBuilder {
	constructor() {
		this.statuses = [];
		this.positions = [];
		this.dateRangePreset = DATE_RANGE_PRESETS.LAST_30_DAYS;
		this.customDateRange = null;
	}

	addStatus(status) {
		this.statuses.push(status);
		return this;
	}

	addPosition(position) {
		this.positions.push(position);
		return this;
	}

	setDateRangePreset(preset) {
		this.dateRangePreset = preset;
		return this;
	}

	setCustomDateRange(startDate, endDate) {
		this.customDateRange = { startDate, endDate };
		return this;
	}

	build() {
		let dateRange;
		if (this.dateRangePreset === DATE_RANGE_PRESETS.CUSTOM && this.customDateRange) {
			dateRange = this.customDateRange;
		} else {
			dateRange = getDateRangeFromPreset(this.dateRangePreset);
		}

		return {
			statuses: this.statuses,
			positions: this.positions,
			dateRange,
		};
	}
}

/**
 * Filter builder for application queries
 */
export class ApplicationFilterBuilder {
	constructor() {
		this.statuses = [];
		this.stages = [];
		this.outcomes = [];
		this.vacancyIds = [];
		this.dateRangePreset = DATE_RANGE_PRESETS.LAST_30_DAYS;
		this.customDateRange = null;
	}

	addStatus(status) {
		this.statuses.push(status);
		return this;
	}

	addStage(stage) {
		this.stages.push(stage);
		return this;
	}

	addOutcome(outcome) {
		this.outcomes.push(outcome);
		return this;
	}

	addVacancy(vacancyId) {
		this.vacancyIds.push(vacancyId);
		return this;
	}

	setDateRangePreset(preset) {
		this.dateRangePreset = preset;
		return this;
	}

	setCustomDateRange(startDate, endDate) {
		this.customDateRange = { startDate, endDate };
		return this;
	}

	build() {
		let dateRange;
		if (this.dateRangePreset === DATE_RANGE_PRESETS.CUSTOM && this.customDateRange) {
			dateRange = this.customDateRange;
		} else {
			dateRange = getDateRangeFromPreset(this.dateRangePreset);
		}

		return {
			statuses: this.statuses,
			stages: this.stages,
			outcomes: this.outcomes,
			vacancyIds: this.vacancyIds,
			dateRange,
		};
	}
}

/**
 * Filter builder for user activity queries
 */
export class UserActivityFilterBuilder {
	constructor() {
		this.roles = [];
		this.departments = [];
		this.dateRangePreset = DATE_RANGE_PRESETS.LAST_30_DAYS;
		this.customDateRange = null;
	}

	addRole(role) {
		this.roles.push(role);
		return this;
	}

	addDepartment(department) {
		this.departments.push(department);
		return this;
	}

	setDateRangePreset(preset) {
		this.dateRangePreset = preset;
		return this;
	}

	setCustomDateRange(startDate, endDate) {
		this.customDateRange = { startDate, endDate };
		return this;
	}

	build() {
		let dateRange;
		if (this.dateRangePreset === DATE_RANGE_PRESETS.CUSTOM && this.customDateRange) {
			dateRange = this.customDateRange;
		} else {
			dateRange = getDateRangeFromPreset(this.dateRangePreset);
		}

		return {
			roles: this.roles,
			departments: this.departments,
			dateRange,
		};
	}
}

/**
 * Filter builder for committee performance queries
 */
export class CommitteeFilterBuilder {
	constructor() {
		this.committeeIds = [];
		this.vacancyIds = [];
		this.dateRangePreset = DATE_RANGE_PRESETS.LAST_30_DAYS;
		this.customDateRange = null;
	}

	addCommittee(committeeId) {
		this.committeeIds.push(committeeId);
		return this;
	}

	addVacancy(vacancyId) {
		this.vacancyIds.push(vacancyId);
		return this;
	}

	setDateRangePreset(preset) {
		this.dateRangePreset = preset;
		return this;
	}

	setCustomDateRange(startDate, endDate) {
		this.customDateRange = { startDate, endDate };
		return this;
	}

	build() {
		let dateRange;
		if (this.dateRangePreset === DATE_RANGE_PRESETS.CUSTOM && this.customDateRange) {
			dateRange = this.customDateRange;
		} else {
			dateRange = getDateRangeFromPreset(this.dateRangePreset);
		}

		return {
			committeeIds: this.committeeIds,
			vacancyIds: this.vacancyIds,
			dateRange,
		};
	}
}

/**
 * Pagination helper
 */
export class Pagination {
	constructor(pageNumber = 1, pageSize = 50) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
	}

	nextPage() {
		this.pageNumber += 1;
		return this;
	}

	previousPage() {
		if (this.pageNumber > 1) {
			this.pageNumber -= 1;
		}
		return this;
	}

	setPageNumber(pageNumber) {
		this.pageNumber = Math.max(1, pageNumber);
		return this;
	}

	setPageSize(pageSize) {
		this.pageSize = Math.max(1, Math.min(pageSize, 500)); // Max 500 per page
		return this;
	}

	getOffset() {
		return (this.pageNumber - 1) * this.pageSize;
	}

	build() {
		return {
			page: this.pageNumber,
			page_size: this.pageSize,
			offset: this.getOffset(),
		};
	}
}

/**
 * Sorting helper
 */
export class Sorting {
	constructor(fieldName = 'created_at', order = 'desc') {
		this.fieldName = fieldName;
		this.order = ['asc', 'desc'].includes(order) ? order : 'desc';
	}

	setField(fieldName) {
		this.fieldName = fieldName;
		return this;
	}

	setOrder(order) {
		this.order = ['asc', 'desc'].includes(order) ? order : 'desc';
		return this;
	}

	toggle() {
		this.order = this.order === 'asc' ? 'desc' : 'asc';
		return this;
	}

	build() {
		return {
			sort_by: this.fieldName,
			sort_order: this.order,
		};
	}
}

export default {
	DATE_RANGE_PRESETS,
	getDateRangeFromPreset,
	VacancyFilterBuilder,
	ApplicationFilterBuilder,
	UserActivityFilterBuilder,
	CommitteeFilterBuilder,
	Pagination,
	Sorting,
};
