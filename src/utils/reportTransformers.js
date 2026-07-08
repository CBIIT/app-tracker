/**
 * Report Data Transformers
 * Provides utility functions to transform raw data into reportable format
 * - Calculating aggregations (counts, averages, percentages)
 * - Time-series data preparation for charts
 * - Data export formats (CSV, Excel, PDF)
 * - Performance indicators and KPIs
 */

/**
 * Calculate aggregations from an array of data
 * @param {Array} data - Array of data objects
 * @param {String} field - Field name to aggregate
 * @returns {Object} Aggregation results
 */
export const calculateAggregations = (data = [], field) => {
	if (!data || data.length === 0) {
		return {
			count: 0,
			sum: 0,
			average: 0,
			min: 0,
			max: 0,
		};
	}

	const values = data
		.map((item) => item[field])
		.filter((val) => typeof val === 'number' && !isNaN(val));

	if (values.length === 0) {
		return {
			count: 0,
			sum: 0,
			average: 0,
			min: 0,
			max: 0,
		};
	}

	const sum = values.reduce((acc, val) => acc + val, 0);
	const average = sum / values.length;
	const min = Math.min(...values);
	const max = Math.max(...values);

	return {
		count: values.length,
		sum,
		average: Math.round(average * 100) / 100,
		min,
		max,
	};
};

/**
 * Group data by a field and calculate counts
 * @param {Array} data - Array of data objects
 * @param {String} field - Field to group by
 * @returns {Object} Grouped data with counts
 */
export const groupByField = (data = [], field) => {
	const grouped = {};

	data.forEach((item) => {
		const key = item[field] || 'Unknown';
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(item);
	});

	const result = {};
	Object.keys(grouped).forEach((key) => {
		result[key] = {
			count: grouped[key].length,
			data: grouped[key],
			percentage: 0,
		};
	});

	const totalCount = data.length;
	Object.keys(result).forEach((key) => {
		result[key].percentage = totalCount > 0
			? Math.round((result[key].count / totalCount) * 100 * 100) / 100
			: 0;
	});

	return result;
};

/**
 * Calculate percentage change between two values
 * @param {Number} oldValue - Previous value
 * @param {Number} newValue - Current value
 * @returns {Number} Percentage change
 */
export const calculatePercentageChange = (oldValue, newValue) => {
	if (oldValue === 0) {
		return newValue > 0 ? 100 : 0;
	}
	return Math.round(((newValue - oldValue) / oldValue) * 100 * 100) / 100;
};

/**
 * Convert data to CSV format
 * @param {Array} data - Array of data objects
 * @param {Array} headers - Column headers (optional, uses object keys if not provided)
 * @returns {String} CSV formatted string
 */
export const convertToCSV = (data = [], headers = null) => {
	if (!data || data.length === 0) {
		return '';
	}

	const csvHeaders = headers || Object.keys(data[0]);
	const csvRows = [
		csvHeaders.join(','),
		...data.map((row) =>
			csvHeaders
				.map((header) => {
					const value = row[header];
					// Escape quotes and wrap in quotes if contains comma
					if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
						return `"${value.replace(/"/g, '""')}"`;
					}
					return value;
				})
				.join(',')
		),
	];

	return csvRows.join('\n');
};

/**
 * Prepare time-series data for charting
 * @param {Array} data - Array of data objects with timestamp
 * @param {String} timeField - Field name containing timestamp
 * @param {String} valueField - Field name containing value to chart
 * @param {String} groupBy - Group by 'day', 'week', 'month', 'quarter', or 'year'
 * @returns {Array} Time-series formatted data
 */
export const prepareTimeSeriesData = (
	data = [],
	timeField = 'created_at',
	valueField = 'count',
	groupBy = 'day'
) => {
	const grouped = {};

	data.forEach((item) => {
		const date = new Date(item[timeField]);
		let key;

		if (groupBy === 'week') {
			const weekStartDate = new Date(date);
			weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
			key = weekStartDate.toISOString().split('T')[0];
		} else if (groupBy === 'month') {
			key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
		} else if (groupBy === 'quarter') {
			const quarterNum = Math.floor(date.getMonth() / 3) + 1;
			key = `${date.getFullYear()}-Q${quarterNum}`;
		} else if (groupBy === 'year') {
			key = `${date.getFullYear()}`;
		} else {
			// Default to day
			key = date.toISOString().split('T')[0];
		}

		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(item[valueField] || 0);
	});

	return Object.keys(grouped)
		.sort()
		.map((key) => ({
			date: key,
			value: grouped[key].reduce((a, b) => a + b, 0),
			count: grouped[key].length,
		}));
};

/**
 * Calculate KPIs (Key Performance Indicators)
 * @param {Object} data - Data object with various metrics
 * @returns {Object} KPI results
 */
export const calculateKPIs = (data = {}) => {
	return {
		// Vacancy KPIs
		vacancyFillRate: data.vacanciesFilled && data.totalVacancies
			? (data.vacanciesFilled / data.totalVacancies) * 100
			: 0,
		averageTimeToHire: data.totalTimeToHire && data.vacanciesFilled
			? data.totalTimeToHire / data.vacanciesFilled
			: 0,
		averageApplicationsPerVacancy: data.totalApplications && data.totalVacancies
			? data.totalApplications / data.totalVacancies
			: 0,

		// Application KPIs
		applicationApprovalRate: data.applicationsApproved && data.totalApplications
			? (data.applicationsApproved / data.totalApplications) * 100
			: 0,
		applicationWithdrawalRate: data.applicationsWithdrawn && data.totalApplications
			? (data.applicationsWithdrawn / data.totalApplications) * 100
			: 0,

		// Committee KPIs
		committeeParticipationRate: data.committeeParticipating && data.totalCommittee
			? (data.committeeParticipating / data.totalCommittee) * 100
			: 0,
		averageReviewTime: data.totalReviewTime && data.reviewsCompleted
			? data.totalReviewTime / data.reviewsCompleted
			: 0,

		// Compliance KPIs
		documentSubmissionRate: data.documentsSubmitted && data.documentsRequired
			? (data.documentsSubmitted / data.documentsRequired) * 100
			: 0,
		referenceSubmissionRate: data.referencesSubmitted && data.referencesRequested
			? (data.referencesSubmitted / data.referencesRequested) * 100
			: 0,
		onTimeCompletionRate: data.onTimeCompletions && data.totalCompletions
			? (data.onTimeCompletions / data.totalCompletions) * 100
			: 0,
	};
};

/**
 * Format data for table display
 * @param {Array} data - Array of data objects
 * @param {Object} columnConfig - Configuration for column transformation
 * @returns {Array} Formatted data for table
 */
export const formatTableData = (data = [], columnConfig = {}) => {
	return data.map((row) => {
		const formattedRow = { ...row };

		Object.keys(columnConfig).forEach((field) => {
			const config = columnConfig[field];

			if (config.type === 'date') {
				const date = new Date(row[field]);
				formattedRow[field] = date.toLocaleDateString();
			} else if (config.type === 'percentage') {
				formattedRow[field] = `${Math.round(row[field] * 100) / 100}%`;
			} else if (config.type === 'currency') {
				formattedRow[field] = `$${parseFloat(row[field]).toFixed(2)}`;
			} else if (config.type === 'number') {
				formattedRow[field] = parseInt(row[field], 10);
			} else if (config.formatter && typeof config.formatter === 'function') {
				formattedRow[field] = config.formatter(row[field]);
			}
		});

		return formattedRow;
	});
};

/**
 * Calculate trend indicators (up, down, neutral)
 * @param {Number} current - Current value
 * @param {Number} previous - Previous value
 * @param {Number} threshold - Minimum change threshold percentage (default 0)
 * @returns {String} Trend indicator ('up', 'down', 'neutral')
 */
export const calculateTrend = (current, previous, threshold = 0) => {
	if (previous === 0) {
		return current > 0 ? 'up' : 'neutral';
	}

	const changePercent = Math.abs(((current - previous) / previous) * 100);
	if (changePercent < threshold) {
		return 'neutral';
	}

	return current > previous ? 'up' : 'down';
};

/**
 * Prepare data for PDF export with formatting
 * @param {Object} config - Configuration object
 * @returns {Object} PDF-ready data
 */
export const preparePDFExport = (config = {}) => {
	const {
		title = 'Report',
		data = [],
		generatedDate = new Date(),
		generatedBy = 'Admin',
		columns = [],
	} = config;

	return {
		title,
		generatedDate: generatedDate.toLocaleDateString(),
		generatedBy,
		data: formatTableData(data, columns),
		columns,
		pageSize: 'A4',
		pageOrientation: 'landscape',
	};
};

/**
 * Calculate summary statistics for a dataset
 * @param {Array} data - Array of data objects
 * @param {Object} fields - Object mapping field names to field paths for aggregation
 * @returns {Object} Summary statistics
 */
export const calculateSummaryStatistics = (data = [], fields = {}) => {
	const summary = {};

	Object.keys(fields).forEach((fieldName) => {
		const fieldPath = fields[fieldName];
		const aggregation = calculateAggregations(data, fieldPath);
		summary[fieldName] = aggregation;
	});

	return summary;
};

export default {
	calculateAggregations,
	groupByField,
	calculatePercentageChange,
	convertToCSV,
	prepareTimeSeriesData,
	calculateKPIs,
	formatTableData,
	calculateTrend,
	preparePDFExport,
	calculateSummaryStatistics,
};
