import { useReducer, useRef, useState, useCallback, useEffect } from 'react';
import {
	getFocusAreaOptions,
	buildApplicantListUrl,
	fetchApplicantList,
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

		// User selects a focus area from focus area filter checkbox, will reset back to page 1
		case QUERY_ACTIONS.FOCUS_AREA_CHANGED:
			return { ...state, focusArea: action.payload, page: 1 };

		// Vacancy changed or switched filter tab, this will reset back to initial state
		case QUERY_ACTIONS.RESET_FOR_NEW_VACANCY:
			return { ...initialQuery };

		default:
			return state;
	}
};

export const useNonSplitApplicants = ({ sysId, vacancyState, enabled = true }) => {
	// Single immutable query object for one-table flows (triage/chair/committee).
	const [query, dispatch] = useReducer(queryReducer, initialQuery);

	const [applicants, setApplicants] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [focusAreaOptions, setFocusAreaOptions] = useState([]);

	// Stale response prevention for fast pagination/filter changes.
	const requestIdRef = useRef(0);

	const buildApplicantUrl = useCallback(() => {
		// Build URL from a single query snapshot so API requests are predictable.
		// Delegates URL construction to service for consistency with split hook.
		const { page, pageSize, orderBy, orderColumn, searchText, focusArea } =
			query;

		return buildApplicantListUrl({
			vacancySysId: sysId,
			vacancyState,
			page,
			pageSize,
			orderBy,
			orderColumn,
			searchText,
			focusArea,
		});
	}, [query, sysId, vacancyState]);

	const loadApplicants = useCallback(async () => {
		if (!enabled) {
			return;
		}

		setLoading(true);

		try {
			const requestId = ++requestIdRef.current;
			const url = buildApplicantUrl();

			// Delegate to service for fetching single applicant list.
			const response = await fetchApplicantList(url);

			if (requestId === requestIdRef.current) {
				setApplicants(response.applicants);
				setTotalCount(response.totalCount);
			}
		} catch (error) {
			// Error handling done by service; just ensure loading state is cleared.
			console.error('Error loading applicants:', error);
		} finally {
			setLoading(false);
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

		// Payload supports partial updates so table/search/filter handlers can
		// update just what changed.

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
		// When this hook is not active for the current workflow, clear local state
		// so stale data is not accidentally rendered.
		if (!enabled) {
			setApplicants([]);
			setTotalCount(0);
			setFocusAreaOptions([]);
			setLoading(false);
			return;
		}

		loadApplicants();
	}, [query, loadApplicants, enabled]);

	useEffect(() => {
		// Focus-area filter options are loaded independently of applicant rows.
		if (!enabled) {
			return;
		}

		loadFocusAreaOptions();
	}, [loadFocusAreaOptions, enabled]);

	// Clears table/query state when vacancy/slice context changes.
	const initializeForVacancy = useCallback(() => {
		dispatch({ type: QUERY_ACTIONS.RESET_FOR_NEW_VACANCY });
		setApplicants([]);
		setTotalCount(0);
	}, []);

	// Called after mutating actions to re-fetch current query results.
	const refresh = useCallback(() => {
		if (!enabled) {
			return;
		}

		loadApplicants();
	}, [enabled, loadApplicants]);

	return {
		// query state for debugging
		query,
		// table data
		applicants,
		totalCount,
		loading,
		focusAreaOptions,
		// Main event handler (single entry point)
		// Pass this to Table.onChange handlers
		handleTableChange,
		// Life cycle handlers
		initializeForVacancy, // Call when vacancy changes
		refresh, // Call from modals/actions
	};
};
