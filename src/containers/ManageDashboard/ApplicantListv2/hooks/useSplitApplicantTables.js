import { useReducer, useRef, useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import {
	getFocusAreaOptions,
	buildApplicantListUrl,
	fetchSplitApplicantLists,
} from '../services/applicantListService';

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
			return { ...initialQuery };

		default:
			return state;
	}
};

export const useSplitApplicantTables = ({ sysId, vacancyState, enabled = true }) => {
	// Single immutable query object for both split tables.
	const [query, dispatch] = useReducer(queryReducer, initialQuery);

	const [recommendedApplicants, setRecommendedApplicants] = useState([]);
	const [nonRecommendedApplicants, setNonRecommendedApplicants] = useState([]);

	const [recommendedTotalCount, setRecommendedTotalCount] = useState(0);
	const [nonRecommendedTotalCount, setNonRecommendedTotalCount] = useState(0);

	const [recommendedLoading, setRecommendedLoading] = useState(false);
	const [nonRecommendedLoading, setNonRecommendedLoading] = useState(false);
	const [focusAreaOptions, setFocusAreaOptions] = useState([]);

	// Stale response prevention: if users change paging/filter quickly, older
	// responses should not overwrite newer state.
	const recommendedRequestIdRef = useRef(0);
	const nonRecommendedRequestIdRef = useRef(0);
	// Gate used so we can load focus-area options first, then the applicant lists.
	const hasBootstrappedRef = useRef(false);

	// URL building delegated to service for consistency and testability.
	const buildApplicantUrl = useCallback(
		(recommended, queryState) => {
			return buildApplicantListUrl({
				vacancySysId: sysId,
				vacancyState,
				page: queryState.page,
				pageSize: queryState.pageSize,
				orderBy: queryState.orderBy,
				orderColumn: queryState.orderColumn,
				searchText: queryState.searchText,
				focusArea: queryState.focusArea,
				recommended,
			});
		},
		[sysId, vacancyState]
	);

	// Fires exactly 2 coordinated API calls for recommended and non-recommended.
	const loadSplitApplicants = useCallback(async (queryState) => {
		if (!enabled) {
			return;
		}

		setRecommendedLoading(true);
		setNonRecommendedLoading(true);

		try {
			const recRequestId = ++recommendedRequestIdRef.current;
			const nonRecRequestId = ++nonRecommendedRequestIdRef.current;

			// Build URLs from the same query snapshot so both tables stay in sync.
			const recUrl = buildApplicantUrl('yes', queryState);
			const nonRecUrl = buildApplicantUrl('no', queryState);

			console.debug('🔵 Split table fetch started:', {
				recUrl,
				nonRecUrl,
				query: queryState,
			});

			// Delegate to service for fetching both lists in parallel.
			const response = await fetchSplitApplicantLists(recUrl, nonRecUrl);

			if (recRequestId === recommendedRequestIdRef.current) {
				setRecommendedApplicants(response.recommended.applicants);
				setRecommendedTotalCount(response.recommended.totalCount);
				console.debug(
					'✅ Recommended applicants updated:',
					response.recommended.totalCount
				);
			} else {
				console.debug(
					'⏭️ Stale recommended response ignored (newer request in progress)'
				);
			}

			if (nonRecRequestId === nonRecommendedRequestIdRef.current) {
				setNonRecommendedApplicants(response.nonRecommended.applicants);
				setNonRecommendedTotalCount(response.nonRecommended.totalCount);
				console.debug(
					'✅ non-Recommended applicants updated:',
					response.nonRecommended.totalCount
				);
			} else {
				console.debug(
					'⏭️ Stale non-Recommended response ignored (newer request in progress)'
				);
			}
		} catch (error) {
			// Error handling done by service; just ensure loading states are cleared.
			console.error('❌ Error loading split applicants:', error);
		} finally {
			setRecommendedLoading(false);
			setNonRecommendedLoading(false);
		}
	}, [buildApplicantUrl, enabled]);

	const loadFocusAreaOptions = useCallback(async () => {
		if (!enabled) {
			setFocusAreaOptions([]);
			return;
		}

		// Delegate to service for fetching focus area options.
		const options = await getFocusAreaOptions(sysId);
		setFocusAreaOptions(options);
	}, [enabled, sysId]);

	const handleTableChange = useCallback((payload) => {
		if (!enabled) {
			return;
		}

		// Apply only the fields included in the payload so callers can make
		// partial updates (e.g. just page, just search, etc.).

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
	}, [enabled]);

	useEffect(() => {
		// Avoid fetching applicants until bootstrap loads focus-area options first.
		if (!enabled || !hasBootstrappedRef.current) {
			return;
		}

		loadSplitApplicants(query);
	}, [query, loadSplitApplicants, enabled]);

	useEffect(() => {
		// Bootstrap sequence per vacancy context:
		// 1) load focus area options for filter dropdowns
		// 2) load recommended/non-recommended tables
		if (!enabled) {
			hasBootstrappedRef.current = false;
			setFocusAreaOptions([]);
			return;
		}

		let isCancelled = false;

		const bootstrapSplitTable = async () => {
			hasBootstrappedRef.current = false;
			await loadFocusAreaOptions();
			if (isCancelled) {
				return;
			}

			hasBootstrappedRef.current = true;
			await loadSplitApplicants(initialQuery);
		};

		bootstrapSplitTable();

		return () => {
			isCancelled = true;
		};
	}, [enabled, loadFocusAreaOptions, loadSplitApplicants, sysId, vacancyState]);

	// Clears all table data and query state when vacancy/slice changes.
	const initializeForVacancy = useCallback(() => {
		hasBootstrappedRef.current = false;
		dispatch({ type: QUERY_ACTIONS.RESET_FOR_NEW_VACANCY });
		setRecommendedApplicants([]);
		setNonRecommendedApplicants([]);
		setRecommendedTotalCount(0);
		setNonRecommendedTotalCount(0);
	}, []);

	// Called after mutating actions (e.g. top-25 toggle, reference/regret actions).
	const refresh = useCallback(() => {
		if (!enabled) {
			return;
		}

		loadSplitApplicants(query);
	}, [enabled, loadSplitApplicants, query]);

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
		focusAreaOptions,

		// Main event handler (single entry point)
		// Pass this to Table.onChange handlers
		handleTableChange,

		// Life cycle handlers
		initializeForVacancy, // Call when vacancy changes
		refresh, // Call from modals/actions
	};
};
