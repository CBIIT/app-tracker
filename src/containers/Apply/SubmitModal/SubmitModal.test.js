import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SubmitModal from './SubmitModal';
import useAuth from '../../../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { VIEW_APPLICATION } from '../../../constants/Routes';
import submitEditedApp from './SubmitAppWorkflow/SubmitEditedApp';
import submitNewApp from './SubmitAppWorkflow/SubmitNewApp';
import { mockUseAuth, mockFormData } from './SubmitModalMockData';

jest.mock('../../../hooks/useAuth');
jest.mock('../../../constants/checkAuth');
jest.mock('axios');
jest.mock('./SubmitAppWorkflow/SubmitEditedApp');
jest.mock('./SubmitAppWorkflow/SubmitNewApp');
jest.mock('react-router-dom', () => ({
	Link: ({ children, to }) => <a href={to}>{children}</a>,
	useHistory: jest.fn(),
	useLocation: jest.fn(),
}));

describe('SubmitModal component', () => {
	const mockVisible = true;
	let mockHandleCancel;
	let mockDraftId;
	let mockSubmittedAppSysId;
	let mockHistoryPush;
	let mockReturnToDocuments;
	let mockSetAuth;

	const renderSubmitModal = (props = {}) =>
		render(
			<SubmitModal
				visible={mockVisible}
				onCancel={mockHandleCancel}
				data={mockFormData}
				draftId={mockDraftId}
				editSubmitted={false}
				submittedAppSysId={mockSubmittedAppSysId}
				returnToDocuments={mockReturnToDocuments}
				{...props}
			/>
		);

	beforeEach(() => {
		mockHandleCancel = jest.fn();
		mockDraftId = 'draft-123';
		mockSubmittedAppSysId = 'app-456';
		mockHistoryPush = jest.fn();
		mockReturnToDocuments = jest.fn();
		mockSetAuth = jest.fn();
		useAuth.mockReturnValue({ ...mockUseAuth, setAuth: mockSetAuth });
		useHistory.mockReturnValue({ push: mockHistoryPush });
		submitNewApp.mockReset();
		submitEditedApp.mockReset();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('renders the initial confirmation modal', () => {
		renderSubmitModal();

		expect(screen.getByText(/Ok/i)).toBeInTheDocument();
		expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Ready to submit application\?/i)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/Please ensure that the correct documents have been submitted\./i
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/Once the application is submitted, and the close date has been reached, it cannot be edited\./i
			)
		).toBeInTheDocument();
	});

	test('submits a new application and renders the in-progress state', async () => {
		submitNewApp.mockImplementation(
			(setConfirmLoading, data, draftId, setSubmitted, setPercent) => {
				setConfirmLoading(true);
				setSubmitted(true);
				setPercent(50);
			}
		);

		renderSubmitModal();
		fireEvent.click(screen.getByText(/Ok/i));

		await waitFor(() => {
			expect(submitNewApp).toHaveBeenCalledWith(
				expect.any(Function),
				mockFormData,
				mockDraftId,
				expect.any(Function),
				expect.any(Function),
				expect.any(Function),
				mockHandleCancel,
				mockReturnToDocuments,
				expect.any(Function),
				mockSetAuth
			);
		});

		expect(
			screen.getByText(/Application is being submitted/i)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/Please do not close or refresh the browser window while the system is uploading your application\./i
			)
		).toBeInTheDocument();
		expect(screen.getByTestId('percent-bar')).toBeInTheDocument();
		expect(
			screen.queryByText(/Application Submitted/i)
		).not.toBeInTheDocument();
	});

	test('submits an edited application and renders the in-progress state', async () => {
		submitEditedApp.mockImplementation(
			(
				setConfirmLoading,
				data,
				submittedAppSysId,
				setSubmitted,
				setPercent
			) => {
				setConfirmLoading(true);
				setSubmitted(true);
				setPercent(25);
			}
		);

		renderSubmitModal({ editSubmitted: true });
		fireEvent.click(screen.getByText(/Ok/i));

		await waitFor(() => {
			expect(submitEditedApp).toHaveBeenCalledWith(
				expect.any(Function),
				mockFormData,
				mockSubmittedAppSysId,
				expect.any(Function),
				expect.any(Function),
				expect.any(Function),
				expect.objectContaining({ push: mockHistoryPush }),
				expect.any(Function),
				mockSetAuth
			);
		});

		expect(
			screen.getByText(/Application is being submitted/i)
		).toBeInTheDocument();
		expect(screen.getByTestId('percent-bar')).toBeInTheDocument();
	});

	test('renders the submitted state and closes to the dashboard on Done', async () => {
		submitNewApp.mockImplementation(
			(
				setConfirmLoading,
				data,
				draftId,
				setSubmitted,
				setPercent,
				setAppSysId
			) => {
				setConfirmLoading(false);
				setSubmitted(true);
				setPercent(100);
				setAppSysId('submitted-789');
			}
		);

		renderSubmitModal();
		fireEvent.click(screen.getByText(/Ok/i));

		await waitFor(() => {
			expect(screen.getByText(/Application Submitted/i)).toBeInTheDocument();
		});

		const link = screen.getByRole('link', { name: /here/i });
		expect(link).toHaveAttribute('href', VIEW_APPLICATION + 'submitted-789');

		fireEvent.click(screen.getByText(/Done/i));
		expect(mockHistoryPush).toHaveBeenCalledWith('/');
	});

	test('calls onCancel when cancel button is clicked from the confirmation state', () => {
		renderSubmitModal();

		fireEvent.click(screen.getByText(/Cancel/i));

		expect(mockHandleCancel).toHaveBeenCalledTimes(1);
		expect(mockHistoryPush).not.toHaveBeenCalled();
	});
});
