import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SubmitModal from './SubmitModal';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
    mockUseAuth, 
    mockFormData,
} from './SubmitModalMockData';

jest.mock('../../../hooks/useAuth');
jest.mock('../../../constants/checkAuth');
jest.mock('axios');
jest.mock('./SubmitAppWorkflow/SubmitEdittedApp');
jest.mock('./SubmitAppWorkflow/SubmitNewApp');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

describe('SubmitModal component', () => {
    const mockVisible = true;
    let mockHandleCancel;
    let mockDraftId;
    let mockEditSubmitted; // returns True or False
    let mockAppSysId;
    let mockHistoryPush;

    beforeEach(() => {
        mockHandleCancel = jest.fn();
        useAuth.mockReturnValue(mockUseAuth);
        mockHistoryPush = jest.fn();
        useNavigate.mockReturnValue(mockHistoryPush);
        delete window.location;
        window.location = {
            href: '',
            assign: jest.fn(),
        }
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render SubmitModal component', () => {
        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        const handleOkElement = screen.getByText(/Ok/i);
        expect(handleOkElement).toBeInTheDocument();

        const handleCancelElement = screen.getByText(/Cancel/i);
        expect(handleCancelElement).toBeInTheDocument();

        const header = screen.getByText(/Ready to submit application?/i);
        expect(header).toBeInTheDocument();

        const p1 = screen.getByText(/Please ensure that the correct documents have been submitted./i);
        expect(p1).toBeInTheDocument();

        const p2 = screen.getByText(/Once the application is submitted, and the close date has been reached, it cannot be edited./i);
        expect(p2).toBeInTheDocument();
    });

    test('should render updated modal to let user know that a new application is being submitted', () => {
        mockEditSubmitted = false;

        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        const handleOkElement = screen.getByText(/Ok/i);
        waitFor(() => {
            fireEvent.click(handleOkElement);

            const header = screen.getByText(/Application is being submitted/i);
            expect(header).toBeInTheDocument();

            // This will be displaying while the application is being submitted
            const p1 = screen.getByText(/Please do not close or refresh the browser window while the system is uploading your application./i);
            expect(p1).toBeInTheDocument();
            expect(screen.getByTestId('percent-bar')).toBeInTheDocument();

            // This will display after the application has been submitted
            const header2 = screen.getByText(/Application Submitted/i);
            expect(header2).toBeInTheDocument();

            const p2 = screen.getByText(/View and print here./i);
            expect(p2).toBeInTheDocument();
        });
    });

    test('Should render modal letting user know that their edited app is being submitted', () => {
        mockEditSubmitted = true;

        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        const handleOkElement = screen.getByText(/Ok/i);
        waitFor(() => {
            fireEvent.click(handleOkElement);

            const header = screen.getByText(/Application is being submitted/i);
            expect(header).toBeInTheDocument();

            // This will be displaying while the application is being submitted
            const p1 = screen.getByText(/Please do not close or refresh the browser window while the system is uploading your application./i);
            expect(p1).toBeInTheDocument();
            expect(screen.getByTestId('percent-bar')).toBeInTheDocument();

            // This will display after the application has been submitted
            const header2 = screen.getByText(/Application Submitted/i);
            expect(header2).toBeInTheDocument();

            const p2 = screen.getByText(/View and print here./i);
            expect(p2).toBeInTheDocument();
        });
    });

    test('should handle the onCancel when cancel button is clicked', () => {
        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        const handleCancelElement = screen.getByText(/Cancel/i);
        waitFor(() => {
            fireEvent.click(handleCancelElement);
            expect(mockHandleCancel).toHaveBeenCalledTimes(1);
            expect(mockHistoryPush).toHaveBeenCalledWith('/');
        });
    });
});