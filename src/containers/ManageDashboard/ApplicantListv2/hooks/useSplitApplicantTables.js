import { useReducer, useRef, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import {
	GET_APPLICANT_LIST,
	GET_ROLLING_APPLICANT_LIST,
} from '../../../../constants/ApiEndpoints';

// Defines what query changes are possible
const QUERY_ACTIONS = {
	PAGE_CHANGED: 'PAGE_CHANGED',
	PAGE_SIZE_CHANGED: 'PAGE_SIZE_CHANGED',
	SEARCH_CHANGED: 'SEARCH_CHANGED',
	SORT_CHANGED: 'SORT_CHANGED',
	FOCUS_AREA_CHANGED: 'FOCUS_AREA_CHANGED',
	RESET_FOR_NEW_VACANCY: 'RESET_FOR_NEW_VACANCY',
};

// Initial state
const initialQuery = {
	page: 1, // Current page number
	pageSize: 50, // Items per page
	orderBy: undefined, // Sort order (ascending/descending)
	orderColumn: undefined, // Column name to sort by
	searchText: '', // Search filter text
	focusArea: [], // Array of selected focus area (Stadtman)
};

const queryReducer = (state, action) => {
	switch (action.type) {
		// User enters page number or clicks next/previous
		case QUERY_ACTIONS.PAGE_CHANGED:
			return { ...state, page: action.payload };

		// User changes page size (10, 25, 50) and resets back to page 1
		case QUERY_ACTIONS.PAGE_SIZE_CHANGED:
			return { ...state, pageSize: action.payload, page: 1 };

		// User typed in search box or clicked column search filter, will reset back to page 1
		case QUERY_ACTIONS.SEARCH_CHANGED:
			return { ...state, searchText: action.payload, page: 1 };

		// User clicked column header to sort, will reset back to page 1
		case QUERY_ACTIONS.SORT_CHANGED:
			return {
				...state,
				orderBy: action.payload.orderBy,
				orderColumn: action.payload.orderColumn,
				page: 1,
			};

		// User selects a focus area from focus area filter chekbox, will reset back to page 1
		case QUERY_ACTIONS.FOCUS_AREA_CHANGED:
			return { ...state, focusArea: action.payload, page: 1 };

		// Vacancy changed or switched filter tab, this will reset back to initial state
		case QUERY_ACTIONS.RESET_FOR_NEW_VACANCY:
			return initialQuery;

		default:
			return state;
	}
};

export const useSplitApplicantTables = ({ sysId, vacancyState }) => {
	// single immutable query object
	const [query, dispatch] = useReducer(queryReducer, initialQuery);

	const [recommendedApplicants, setRecommendedApplicants] = useState([]);
	const [nonRecommendedApplicants, setNonRecommendedApplicants] = useState([]);

	const [recommendedTotalCount, setRecommendedTotalCount] = useState(0);
	const [nonRecommendedTotalCount, setNonRecommendedTotalCount] = useState(0);

	const [recommendedLoading, setRecommendedLoading] = usestate(false);
	const [nonRecommendedLoading, setNonRecommendedLoading] = useState(false);

	// Stale response prevention
	// If user clicks next and then quickly clicks previous, don't want old "next page" response to overwrite
	const recommendedRequestIdRef = useRef(0);
	const nonRecommendedRequestIdRef = useRef(0);

	const buildApplicantUrl = useCallback(
		(recommended) => {
			const { page, pageSize, orderBy, orderColumn, searchText, focusArea } =
				query;

			const offset = page;
			const limit = pageSize;

			const api =
				vacancyState === 'rolling_close'
					? GET_ROLLING_APPLICANT_LIST
					: GET_APPLICANT_LIST;

			let url = `${api}${sysId}?offset=${offset}&limit=${limit}`;

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
		},
		[query, sysId, vacancyState]
	);

	// fires exactly 2 coordinated api calls for recommended and non-recommended
	const loadSplitApplicants = useCallback(async () => {
		setRecommendedLoading(true);
		setNonRecommendedLoading(true);

		try {
			const recRequestId = ++recommendedRequestIdRef.current;
			const nonRecRequestId = ++nonRecommendedRequestIdRef.current;

			// build URLs from same query state for consistency
			const recUrl = buildApplicantUrl('yes');
			const nonRecUrl = buildApplicantUrl('no');

			console.debug('🔵 Split table fetch started:', {
				recUrl,
				nonRecUrl,
				query,
			});

			// fires both requests in parallel (not sequential)
			const [recResponse, nonRecResponse] = await Promise.all([
				axios.get(recUrl),
				axios.get(nonRecUrl),
			]);

			if (recRequestId === recommendedRequestIdRef.current) {
				setRecommendedApplicants(recResponse.data.result.applicants || []);
				setRecommendedTotalCount(recResponse.data.result.totalCount || 0);
				console.debug(
					'✅ Recommended applicants updated:',
					recResponse.data.result.totalCount
				);
			} else {
				console.debug(
					'⏭️ Stale recommended response ignored (newer request in progress)'
				);
			}

			if (nonRecRequestId === nonRecommendedRequestIdRef.current) {
				setNonRecommendedApplicants(
					nonRecResponse.data.result.applicants || []
				);
				setNonRecommendedTotalCount(nonRecResponse.data.result.totalCount || 0);
				console.debug(
					'✅ non-Recommended applicants updated:',
					nonRecResponse.data.result.totalCount
				);
			} else {
				console.debug(
					'⏭️ Stale non-Recommended response ignored (newer request in progress)'
				);
			}
		} catch (error) {
			console.error('❌ Error loading split applicants:', error);
			message.error(
				'Sorry! An error occured while loading applicants. Try reloading.'
			);
		} finally {
			setRecommendedLoading(false);
			setNonRecommendedLoading(false);
		}
	}, [buildApplicantUrl]);

	const handleTableChange = useCallback((payload) => {
		if (payload.page !== undefined) {
			dispatch({
				type: QUERY_ACTIONS.PAGE_CHANGED,
				payload: payload.page,
			});
		}
		if (payload.pageSize !== undefined) {
			dispatch({
				type: QUERY_ACTIONS.PAGE_SIZE_CHANGED,
				payload: payload.pageSize,
			});
		}
		if (payload.searchText !== undefined) {
			dispatch({
				type: QUERY_ACTIONS.SEARCH_CHANGED,
				payload: payload.searchText,
			});
		}
		if (
			payload.orderBy !== undefined ||
			payload.orderColumn !== undefined
		) {
			dispatch({
				type: QUERY_ACTIONS.SORT_CHANGED,
				payload: {
					orderBy: payload.orderBy,
					orderColumn: payload.orderColumn,
				},
			});
		}
		if (payload.focusArea !== undefined) {
			dispatch({
				type: QUERY_ACTIONS.FOCUS_AREA_CHANGED,
				payload: payload.focusArea,
			});
		}
	}, []);

	useeffect(() => {
		loadSplitApplicants();
	}, [query, loadSplitApplicants]);

	// clears all tables and resets queries
	const initializeForVacancy = useCallback(() => {
		dispatch({ type: QUERY_ACTIONS.RESET_FOR_NEW_VACANCY });
		setRecommendedApplicants([]);
		setNonRecommendedApplicants([]);
		setRecommendedTotalCount(0);
		setNonRecommendedTotalCount(0);
	}, []);

	// called from modals/actions that change data
	const refresh = useCallback(() => {
		loadSplitApplicants();
	}, [loadSplitApplicants]);

	return {
		// query state for debugging
		query,

		// Split table data
		recommendedApplicants,
		nonRecommendedApplicants,
		recommendedTotalCount,
		nonRecommendedTotalCount,

		// Loading flags for spinners
		recommendedLoading,
		nonRecommendedLoading,

		// Main event handler (single entry point)
		// Pass this to Table.onChange handlers
		handleTableChange,

		// Life cycle handlers
		initializeForVacancy, // Call when vacancy changes
		refresh, // Call from modals/actions
	};
};
