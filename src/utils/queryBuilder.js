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
			// Calculate the previous quarter
			const currentQuarter = Math.floor(currentMonth / 3);
			const lastQuarterMonth = (currentQuarter - 1) * 3;
			if (currentQuarter === 0) {
				// If in Q1, last quarter is Q4 of previous year
				startDate = new Date(currentYear - 1, 9, 1); // October of last year
				endDate = new Date(currentYear, 0, 0); // End of September (month 8)
			} else {
				startDate = new Date(currentYear, lastQuarterMonth, 1);
				endDate = new Date(currentYear, lastQuarterMonth + 3, 0); // Last day of quarter
			}
			break;
		case DATE_RANGE_PRESETS.THIS_QUARTER:
			const quarterStart = Math.floor(currentMonth / 3) * 3;
			startDate = new Date(currentYear, quarterStart, 1);
			endDate = new Date();
			break;
		case DATE_RANGE_PRESETS.LAST_FISCAL_YEAR:
			// Fiscal year runs Oct-Sep (months 9-8 in 0-indexed)
			const lastFiscalStart = 9; // October (0-indexed)
			if (currentMonth >= lastFiscalStart) {
				// We're in current fiscal year, so last fiscal year was last Oct-Sep
				startDate = new Date(currentYear - 1, lastFiscalStart, 1);
				endDate = new Date(currentYear, lastFiscalStart, 0); // End of September
			} else {
				// We're in Jan-Sep, so last fiscal year was 2 years ago Oct-last year Sep
				startDate = new Date(currentYear - 2, lastFiscalStart, 1);
				endDate = new Date(currentYear - 1, lastFiscalStart, 0); // End of September
			}
			break;
		case DATE_RANGE_PRESETS.THIS_FISCAL_YEAR:
			const thisFiscalStart = 9; // October (0-indexed)
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
