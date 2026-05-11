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

		// User selects a focus area from focus area filter checkbox, will reset back to page 1
		case QUERY_ACTIONS.FOCUS_AREA_CHANGED:
			return { ...state, focusArea: action.payload, page: 1 };

		// Vacancy changed or switched filter tab, this will reset back to initial state
		case QUERY_ACTIONS.RESET_FOR_NEW_VACANCY:
			return initialQuery;

		default:
			return state;
	}
};

export const useNonSplitApplicants = ({ sysId, vacancyState }) => {
	// single immutable query object
	const [query, dispatch] = useReducer(queryReducer, initialQuery);

	const [applicants, setApplicants] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(false);

	// Stale response prevention
	// If user clicks next and then quickly clicks previous, don't want old response to overwrite
	const requestIdRef = useRef(0);

	const buildApplicantUrl = useCallback(() => {
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

		if (searchText && searchText.trim()) {
			url += `&search=${encodeURIComponent(searchText.toLowerCase())}`;
		}

		const safeFocusArea = Array.isArray(focusArea) ? focusArea : [];
		if (safeFocusArea.length > 0) {
			url += `&focusArea=${safeFocusArea.join(',')}`;
		}

		return url;
	}, [query, sysId, vacancyState]);

	const loadApplicants = useCallback(async () => {
		setLoading(true);

		try {
			const requestId = ++requestIdRef.current;
			const url = buildApplicantUrl();

			const response = await axios.get(url);

			if (requestId === requestIdRef.current) {
				setApplicants(response.data?.result?.applicants || []);
				setTotalCount(response.data?.result?.totalCount || 0);
			}
		} catch (error) {
			console.error('Error loading applicants:', error);
			message.error(
				'Sorry! An error occurred while loading applicants. Try reloading.'
			);
		} finally {
			setLoading(false);
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

	useEffect(() => {
		loadApplicants();
	}, [query, loadApplicants]);

	// clears table and resets query
	const initializeForVacancy = useCallback(() => {
		dispatch({ type: QUERY_ACTIONS.RESET_FOR_NEW_VACANCY });
		setApplicants([]);
		setTotalCount(0);
	}, []);

	// called from modals/actions that change data
	const refresh = useCallback(() => {
		loadApplicants();
	}, [loadApplicants]);

	return {
		// query state for debugging
		query,

		// table data
		applicants,
		totalCount,
		loading,

		// Main event handler (single entry point)
		// Pass this to Table.onChange handlers
		handleTableChange,

		// Life cycle handlers
		initializeForVacancy, // Call when vacancy changes
		refresh, // Call from modals/actions
	};
};
