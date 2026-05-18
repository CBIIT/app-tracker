import axios from 'axios';
import { message } from 'antd';
import {
	GET_APPLICANT_LIST,
	GET_APPLICANT_FOCUS_AREA,
	GET_ROLLING_APPLICANT_LIST,
} from '../../../../constants/ApiEndpoints';

// Fetches focus-area filter options for a vacancy.
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
	} catch (error) {
		console.error('❌ Error loading focus areas: ', error);
		message.error(
			'Sorry! An error occured while loading focus areas. Try reloading.'
		);
		return [];
	}
};

// Builds applicant list API URLs for both rolling-close and regular vacancies.
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

// Fetches one applicant list for non-split table flows.
export const fetchApplicantList = async (url) => {
	try {
		const response = await axios.get(url);
		return {
			applicants: response.data?.result?.applicants || [],
			totalCount: response.data?.result?.totalCount || 0,
		};
	} catch (error) {
		console.error('❌ Error loading applicants:', error);
		message.error(
			'Sorry! An error occurred while loading applicants. Try reloading.'
		);
		throw error;
	}
};

// Fetches recommended and non-recommended applicant lists in parallel.
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

// Fetches all applicants for Excel in one-table mode.
export const fetchAllApplicantsForExcel = async (url) => {
	try {
		const response = await axios.get(url);
		return response?.data?.result?.applicants || [];
	} catch (error) {
		console.error('❌ Error loading all applicants for excel export: ', error);
		message.error(
			'Sorry! An error occurred while loading all applicants for excel export. Try reloading.'
		);
		throw error;
	}
};

// Fetches both split datasets for Excel in parallel
export const fetchSplitApplicantsForExcel = async (
	recommendedUrl,
	nonRecommendedUrl
) => {
	try {
		const [recommendedResponse, nonRecommendedResponse] = await Promise.all([
			axios.get(recommendedUrl),
			axios.get(nonRecommendedUrl),
		]);

		const recommendedApplicants =
			recommendedResponse?.data?.result?.applicants || [];
		const nonRecommendedApplicants =
			nonRecommendedResponse?.data?.result?.applicants || [];

		return {
			recommendedApplicants,
			nonRecommendedApplicants: [
				...recommendedApplicants,
				...nonRecommendedApplicants,
			],
		};
	} catch (error) {
		console.error('❌ Error loading all applicants for excel export: ', error);
		message.error(
			'Sorry! An error occurred while loading all applicants for excel export. Try reloading.'
		);
		throw error;
	}
};
