import axios from 'axios';
import { message } from 'antd';
import {
	GET_APPLICANT_LIST,
	GET_APPLICANT_FOCUS_AREA,
	GET_ROLLING_APPLICANT_LIST,
} from '../../../../constants/ApiEndpoints';

/**
 * Fetches focus area filter options for a vacancy.
 * Used by both split and non-split applicant tables to populate focus-area dropdown.
 *
 * @param {string} vacancySysId - The vacancy system ID
 * @returns {Promise<Array>} Array of focus area options with { text, value } shape
 */
export const getFocusAreaOptions = async (vacancySysId) => {
	try {
		const response = await axios.get(
			`${GET_APPLICANT_FOCUS_AREA}${vacancySysId}`
		);
		const rawFocusAreas = response?.data?.result?.focusAreaFilter;
		const safeFocusAreas = Array.isArray(rawFocusAreas) ? rawFocusAreas : [];

		return safeFocusAreas.map((focusArea) => ({
			text: focusArea,
			value: focusArea,
		}));
	} catch (_error) {
		return [];
	}
};

/**
 * Constructs the applicant list API URL based on query parameters.
 * Handles both regular and rolling close vacancy states.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.vacancySysId - The vacancy system ID
 * @param {string} params.vacancyState - The vacancy state (e.g., 'rolling_close')
 * @param {number} params.page - Current page number
 * @param {number} params.pageSize - Items per page
 * @param {string} [params.orderBy] - Sort order (ascending/descending)
 * @param {string} [params.orderColumn] - Column name to sort by
 * @param {string} [params.searchText] - Search filter text
 * @param {Array} [params.focusArea] - Array of selected focus areas
 * @param {string} [params.recommended] - Filter by recommendation (yes/no)
 * @returns {string} The constructed API URL
 */
export const buildApplicantListUrl = ({
	vacancySysId,
	vacancyState,
	page,
	pageSize,
	orderBy,
	orderColumn,
	searchText,
	focusArea,
	recommended,
}) => {
	const offset = page;
	const limit = pageSize;

	const api =
		vacancyState === 'rolling_close'
			? GET_ROLLING_APPLICANT_LIST
			: GET_APPLICANT_LIST;

	let url = `${api}${vacancySysId}?offset=${offset}&limit=${limit}`;

	if (orderBy && orderColumn) {
		url += `&orderBy=${orderBy}&orderColumn=${orderColumn}`;
	}

	if (recommended) {
		url += `&recommended=${recommended}`;
	}

	if (searchText && searchText.trim()) {
		url += `&search=${encodeURIComponent(searchText.toLowerCase())}`;
	}

	const safeFocusArea = Array.isArray(focusArea) ? focusArea : [];
	if (safeFocusArea.length > 0) {
		url += `&focusArea=${safeFocusArea.join(',')}`;
	}

	return url;
};

/**
 * Fetches a single applicant list (non-split view).
 * Used by committee, chair, and other non-manager roles.
 *
 * @param {string} url - The full API URL to fetch
 * @returns {Promise<Object>} Response data with applicants and totalCount
 * @throws {Error} On network/API error
 */
export const fetchApplicantList = async (url) => {
	try {
		const response = await axios.get(url);
		return {
			applicants: response.data?.result?.applicants || [],
			totalCount: response.data?.result?.totalCount || 0,
		};
	} catch (error) {
		console.error('Error loading applicants:', error);
		message.error(
			'Sorry! An error occurred while loading applicants. Try reloading.'
		);
		throw error;
	}
};

/**
 * Fetches split applicant lists (recommended and non-recommended) in parallel.
 * Used by vacancy managers to show side-by-side applicant tables.
 *
 * @param {string} recUrl - The URL for recommended applicants
 * @param {string} nonRecUrl - The URL for non-recommended applicants
 * @returns {Promise<Object>} Object with recommended and nonRecommended applicant data
 * @throws {Error} On network/API error
 */
export const fetchSplitApplicantLists = async (recUrl, nonRecUrl) => {
	try {
		console.debug('🔵 Split table fetch started:', {
			recUrl,
			nonRecUrl,
		});

		// Fetch both lists in parallel for faster table updates.
		const [recResponse, nonRecResponse] = await Promise.all([
			axios.get(recUrl),
			axios.get(nonRecUrl),
		]);

		return {
			recommended: {
				applicants: recResponse.data?.result?.applicants || [],
				totalCount: recResponse.data?.result?.totalCount || 0,
			},
			nonRecommended: {
				applicants: nonRecResponse.data?.result?.applicants || [],
				totalCount: nonRecResponse.data?.result?.totalCount || 0,
			},
		};
	} catch (error) {
		console.error('❌ Error loading split applicants:', error);
		message.error(
			'Sorry! An error occured while loading applicants. Try reloading.'
		);
		throw error;
	}
};
