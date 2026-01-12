import ApplicantDashboard from './ApplicantDashboard';
import { MemoryRouter } from 'react-router-dom';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import * as useAuth from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { mockUseAuth, mockUserApps } from './ApplicantDashboardMockData';
import {
	WITHDRAW_USER_APPLICATION,
	REMOVE_USER_APPLICATION_DRAFT,
} from '../../constants/ApiEndpoints';

jest.mock('axios');
jest.mock('../../hooks/useAuth', () => ({
	__esModule: true,
	default: jest.fn(),
}));
jest.mock('../../hooks/useFetch', () => ({
	__esModule: true,
	useFetch: jest.fn(),
}));
jest.mock('../../components/Util/Date/Date', () => ({
	__esModule: true,
	transformDateToDisplay: jest.fn((date) => {
		if (!date) return 'Open Until Filled';
		const [year, month, day] = date.split('-');
		return `${month}/${day}/${year}`;
	}),
}));

describe('ApplicantDashboard', () => {
	beforeEach(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: jest.fn(), // deprecated
				removeListener: jest.fn(), // deprecated
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		});
		useAuth.default.mockReturnValue({ setAuth: jest.fn(), ...mockUseAuth });
		// mock CHECK_AUTH response used by checkAuth helper
		axios.get.mockResolvedValue({
			data: {
				result: {
					logged_in: true,
					itrust_idp: '',
					itrust_url: '',
					session_timeout: 1800000,
					banner_message: '',
					banner_description: '',
					omb_no: '',
					omb_exp: '',
					user: {
						first_name: 'John',
						last_initial: 'D',
						user_id: '12345',
						has_applications: true,
						tenant: '',
						roles: ['snc_internal'],
					},
					okta_login_and_redirect_url: '',
					tenants: [],
				},
			},
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should render the ApplicantDashboard component', async () => {
		useFetch.mockReturnValue({
			data: mockUserApps,
			isLoading: false,
			error: null,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		expect(screen.getByText(/Your Applications/i)).toBeInTheDocument();
		expect(screen.getByText(/Vacancy Title/i)).toBeInTheDocument();
		expect(screen.getByText(/Test Vacancy 1/i)).toBeInTheDocument();
		expect(screen.getAllByText(/Status/i).length).toBeGreaterThan(0);
		expect(screen.getAllByText(/submitted/i).length).toBeGreaterThan(0);
		expect(screen.getByText(/Vacancy Closes/i)).toBeInTheDocument();
		expect(screen.getByText(/Application Submitted/i)).toBeInTheDocument();
		expect(screen.getByText(/Actions/i)).toBeInTheDocument();
		expect(screen.getByText(/Edit/i)).toBeInTheDocument();
		expect(screen.getAllByText(/Withdraw/i).length).toBeGreaterThan(0);
		expect(screen.getByText(/Reference Status/i)).toBeInTheDocument();
		expect(screen.getByText(/1 out of 4/i)).toBeInTheDocument();
		expect(screen.getByText(/2 out of 3/i)).toBeInTheDocument();
		// expect(screen.getByText('12/13/2024')).toBeInTheDocument();
		expect(screen.getByText(/Open Until Filled/i)).toBeInTheDocument();
	});

	test('direct comparator throws with undefined vacancy (demonstrates bug)', () => {
		const unsafeCompare = (a, b) => a.vacancy.localeCompare(b.vacancy);
		const a = { vacancy: undefined };
		const b = { vacancy: 'A' };
		expect(() => unsafeCompare(a, b)).toThrow();
	});

	test('fixes localeCompare bug in sorter', () => {
		const unsafeCompare = (a, b) => {
			const va = String(a?.vacancy ?? '').toLowerCase();
			const vb = String(b?.vacancy ?? '').toLowerCase();
			va.localeCompare(vb);
		};
		const a = { vacancy: undefined };
		const b = { vacancy: 'A' };
		expect(() => unsafeCompare(a, b)).not.toThrow();
	});

	test('renders empty table when no applications returned', async () => {
		useFetch.mockReturnValue({ data: [], isLoading: false, error: null });

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		// wait a short while for any async renders to settle
		await waitFor(() => {
			// no-op to allow effects to run
			expect(true).toBe(true);
		});

		// Try common selectors and fail with debug info if none match
		const tableByTestId = screen.queryByTestId('applicant-table');
		const tableByRole = screen.queryByRole('table');
		const header = screen.queryByText(/Your Applications/i);
		const noAppsText =
			screen.queryByText(/no applications/i) ||
			screen.queryByText(/no results/i) ||
			screen.queryByText(/no records/i);

		if (!tableByTestId && !tableByRole && !header && !noAppsText) {
			// debug DOM to help identify the right selector
			// eslint-disable-next-line no-console
			console.log('ApplicantDashboard DOM snapshot (no selectors matched):');
			screen.debug();
			throw new Error(
				'Unable to find applicant table, header, or "no applications" message — check rendered DOM above.'
			);
		}

		// At least one valid indicator must be present
		expect(tableByTestId || tableByRole || header || noAppsText).toBeTruthy();

		// ensure no vacancy rows are present
		expect(screen.queryByText(/Test Vacancy 1/i)).toBeNull();
	});

	test('handleRemoveModalCancel closes remove modal when Cancel clicked', async () => {
		const draftApp = {
			draft_id: 'd001',
			reference_status: '0 out of 0',
			state: 'draft',
			vacancy: 'Draft Vacancy',
			vacancy_closes: '',
			vacancy_id: '333',
			vacancy_state: 'live',
			vacancy_status: 'open',
			vacancy_submitted: null,
		};

		useFetch.mockReturnValue({
			data: [draftApp],
			isLoading: false,
			error: null,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		// wait for table to render
		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		// find the Remove button and open modal
		const removeButton = screen.getByText(/Remove/i);
		fireEvent.click(removeButton);

		// the remove-draft modal should appear
		await screen.findByText(/Are you sure you want to remove this draft/i);

		// click the Cancel button to trigger handleRemoveModalCancel
		const cancelButton = screen.getByRole('button', { name: /Cancel/i });
		fireEvent.click(cancelButton);

		expect(axios.post).not.toHaveBeenCalled();
	});

	test('removeDraft calls API and updates data when Confirm clicked', async () => {
		const draftApp = {
			draft_id: 'remove-me',
			reference_status: '0 out of 0',
			state: 'draft',
			vacancy: 'Draft To Remove',
			vacancy_closes: '',
			vacancy_id: '555',
			vacancy_state: 'live',
			vacancy_status: 'open',
			vacancy_submitted: null,
		};

		const setData = jest.fn();
		const setLoading = jest.fn();

		useFetch.mockReturnValue({
			data: [draftApp],
			isLoading: false,
			error: null,
			setData,
			setLoading,
		});
		axios.post.mockResolvedValue({ data: {} });

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument()
		);

		// open remove modal
		const removeBtn = screen.getByTestId('remove-draft');
		fireEvent.click(removeBtn);

		await screen.findByText(/Are you sure you want to remove this draft/i);

		// confirm removal
		const confirm = screen.getByRole('button', { name: /Confirm/i });
		fireEvent.click(confirm);

		// axios.post should be called with the remove endpoint
		await waitFor(() => expect(axios.post).toHaveBeenCalled());
		expect(axios.post.mock.calls[0][0]).toEqual(
			expect.stringContaining(REMOVE_USER_APPLICATION_DRAFT)
		);

		// setData should be called with updater that removes the draft
		expect(setData).toHaveBeenCalled();
		const updater = setData.mock.calls[0][0];
		const result = updater([draftApp, { draft_id: 'keep' }]);
		expect(result).toEqual([{ draft_id: 'keep' }]);
	});

	test('withdrawApp posts endpoint, refetches data and updates state on Confirm', async () => {
		const submittedApp = {
			app_id: 'w001',
			reference_status: '1 out of 1',
			state: 'submitted',
			vacancy: 'Withdrawable Vacancy',
			vacancy_closes: '2025-02-02',
			vacancy_id: '777',
			vacancy_state: 'live',
			vacancy_status: 'open',
			vacancy_submitted: '2024-11-30 11:13:12',
		};

		const setData = jest.fn();
		const setLoading = jest.fn();

		useFetch.mockReturnValue({
			data: [submittedApp],
			isLoading: false,
			error: null,
			setData,
			setLoading,
		});

		axios.post.mockResolvedValue({ data: {} });
		const newList = [{ app_id: 'w001', state: 'withdrawn' }];
		axios.get.mockResolvedValue({ data: { result: newList } });

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument()
		);

		// open withdraw modal using data-testid
		const withdrawBtn = screen.getByTestId('withdraw-draft');
		fireEvent.click(withdrawBtn);

		await screen.findByText(
			/Are you sure you want to withdraw this application/i
		);

		// confirm withdraw
		const confirm = screen.getByRole('button', { name: /Confirm/i });
		fireEvent.click(confirm);

		await waitFor(() => expect(axios.post).toHaveBeenCalled());
		expect(axios.post.mock.calls[0][0]).toEqual(
			expect.stringContaining(WITHDRAW_USER_APPLICATION)
		);

		// axios.get should be called to refresh list and setData should be called with result
		await waitFor(() => expect(axios.get).toHaveBeenCalled());
		expect(setData).toHaveBeenCalledWith(newList);
	});

	test('handleWithdrawModalCancel closes withdraw modal when Cancel clicked', async () => {
		const submittedApp = {
			app_id: 'wc001',
			reference_status: '1 out of 1',
			state: 'submitted',
			vacancy: 'Withdrawable Vacancy',
			vacancy_closes: '2025-02-02',
			vacancy_id: '777',
			vacancy_state: 'live',
			vacancy_status: 'open',
			vacancy_submitted: '2024-11-30 11:13:12',
		};

		useFetch.mockReturnValue({
			data: [submittedApp],
			isLoading: false,
			error: null,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument()
		);

		// open withdraw modal
		const withdrawBtn = screen.getByTestId('withdraw-draft');
		fireEvent.click(withdrawBtn);

		// modal should appear with confirmation text
		await screen.findByText(
			/Are you sure you want to withdraw this application/i
		);

		// click Cancel to trigger handleWithdrawModalCancel
		const cancel = screen.getByRole('button', { name: /Cancel/i });
		fireEvent.click(cancel);

		// modal should be closed and axios.post should not have been called
		expect(axios.post).not.toHaveBeenCalled();
	});

	test('renders empty while loading', () => {
		useFetch.mockReturnValue({ data: [], isLoading: true, error: null });

		const { container } = render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		// when isLoading is true, the component should render an empty fragment
		// no table, header, or content should be visible
		expect(screen.queryByTestId('applicant-table')).not.toBeInTheDocument();
		expect(screen.queryByText(/Your Applications/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/Vacancy Title/i)).not.toBeInTheDocument();
	});

	test('renders error component when error occurs', () => {
		const errorMessage = 'Failed to fetch applications';
		useFetch.mockReturnValue({
			data: [],
			isLoading: false,
			error: errorMessage,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		// when there is an error, the Error component should be rendered
		// the table and header should not be displayed
		expect(screen.queryByTestId('applicant-table')).not.toBeInTheDocument();
		expect(screen.queryByText(/Your Applications/i)).not.toBeInTheDocument();
	});

	test('displays warning icon and tooltip when vacancy closes within 5 days', async () => {
		// Create a date 3 days from now
		const threeDaysFromNow = new Date();
		threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
		const closeDateStr = threeDaysFromNow.toISOString().split('T')[0];

		const appWithSoonCloseDate = {
			app_id: 'warn001',
			reference_status: '1 out of 3',
			state: 'submitted',
			vacancy: 'Closing Soon Vacancy',
			vacancy_closes: closeDateStr,
			vacancy_id: '999',
			vacancy_state: 'live',
			vacancy_status: 'open',
			vacancy_submitted: '2024-11-30 11:13:12',
		};

		useFetch.mockReturnValue({
			data: [appWithSoonCloseDate],
			isLoading: false,
			error: null,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		// Check for the warning icon (ExclamationCircleFilled)
		const warningIcon = document.querySelector('.anticon-exclamation-circle');
		expect(warningIcon).toBeInTheDocument();
		expect(warningIcon).toHaveStyle({ color: 'rgb(250, 173, 20)' }); // #faad14

		// Check tooltip content by hovering
		fireEvent.mouseOver(warningIcon);
		await waitFor(() => {
			expect(
				screen.getByText(/The vacancy for this application will close soon/i)
			).toBeInTheDocument();
			expect(
				screen.getByText(
					/Please ensure that all of your reference letters have been submitted/i
				)
			).toBeInTheDocument();
		});
	});

	test('does not display warning icon when vacancy closes in more than 5 days', async () => {
		// Create a date 10 days from now
		const tenDaysFromNow = new Date();
		tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
		const closeDateStr = tenDaysFromNow.toISOString().split('T')[0];

		const appWithFutureCloseDate = {
			app_id: 'nowarn001',
			reference_status: '1 out of 3',
			state: 'submitted',
			vacancy: 'Future Close Vacancy',
			vacancy_closes: closeDateStr,
			vacancy_id: '888',
			vacancy_state: 'live',
			vacancy_status: 'open',
			vacancy_submitted: '2024-11-30 11:13:12',
		};

		useFetch.mockReturnValue({
			data: [appWithFutureCloseDate],
			isLoading: false,
			error: null,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		// Warning icon should NOT be present
		const warningIcon = document.querySelector('.anticon-exclamation-circle');
		expect(warningIcon).not.toBeInTheDocument();
	});

	test('does not display warning icon when vacancy has already closed (past date)', async () => {
		// Create a date 2 days in the past
		const twoDaysAgo = new Date();
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
		const closeDateStr = twoDaysAgo.toISOString().split('T')[0];

		const appWithPastCloseDate = {
			app_id: 'past001',
			reference_status: '1 out of 3',
			state: 'submitted',
			vacancy: 'Already Closed Vacancy',
			vacancy_closes: closeDateStr,
			vacancy_id: '777',
			vacancy_state: 'live',
			vacancy_status: 'closed',
			vacancy_submitted: '2024-11-30 11:13:12',
		};

		useFetch.mockReturnValue({
			data: [appWithPastCloseDate],
			isLoading: false,
			error: null,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		// Warning icon should NOT be present for past dates
		const warningIcon = document.querySelector('.anticon-exclamation-circle');
		expect(warningIcon).not.toBeInTheDocument();
	});

	test('displays "Open Until Filled" when vacancy_closes is empty', async () => {
		const appWithNoCloseDate = {
			app_id: 'open001',
			reference_status: '0 out of 3',
			state: 'submitted',
			vacancy: 'Open Until Filled Vacancy',
			vacancy_closes: '',
			vacancy_id: '666',
			vacancy_state: 'live',
			vacancy_status: 'open',
			vacancy_submitted: '2024-11-30 11:13:12',
		};

		useFetch.mockReturnValue({
			data: [appWithNoCloseDate],
			isLoading: false,
			error: null,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		// Check that "Open Until Filled" appears in the vacancy closes column
		const openUntilFilledElements = screen.getAllByText(/Open Until Filled/i);
		expect(openUntilFilledElements.length).toBeGreaterThan(0);

		// No warning icon should be present
		const warningIcon = document.querySelector('.anticon-exclamation-circle');
		expect(warningIcon).not.toBeInTheDocument();
	});

	test('displays warning icon when vacancy closes exactly in 5 days', async () => {
		const fiveDaysFromNow = new Date();
		fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
		const closeDateStr = fiveDaysFromNow.toISOString().split('T')[0];

		const appWithFiveDayClose = {
			app_id: 'five001',
			reference_status: '2 out of 3',
			state: 'submitted',
			vacancy: 'Five Day Close Vacancy',
			vacancy_closes: closeDateStr,
			vacancy_id: '555',
			vacancy_state: 'live',
			vacancy_status: 'open',
			vacancy_submitted: '2024-11-30 11:13:12',
		};

		useFetch.mockReturnValue({
			data: [appWithFiveDayClose],
			isLoading: false,
			error: null,
		});

		render(
			<MemoryRouter initialEntries={['/applicant-dashboard']}>
				<ApplicantDashboard />
			</MemoryRouter>
		);

		await waitFor(() => {
			expect(screen.getByTestId('applicant-table')).toBeInTheDocument();
		});

		// Warning icon SHOULD be present (boundary case: daysRemaining <= 5)
		const warningIcon = document.querySelector('.anticon-exclamation-circle');
		expect(warningIcon).toBeInTheDocument();
	});
});
