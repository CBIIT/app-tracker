import CandidateDidInterview from './CandidateDidInterview';
import { render, screen, fireEvent } from '@testing-library/react';

describe('CandidateDidInterview', () => {
    let mockAppSysId;
    let mockRejectionEmailModal;
    let mockSetRejectionEmailModal;
    let mockSendRejectionEmail;
    let mockRejectionEmailSent;

    beforeEach(() => {
        mockAppSysId = '1234';
        mockRejectionEmailModal = true;
        mockSetRejectionEmailModal = jest.fn();
        mockSendRejectionEmail = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders CandidateDidInterview component if Rejection Email has not been sent', () => {
        mockRejectionEmailSent = '0';

        render(<CandidateDidInterview 
            appSysId={mockAppSysId}
            rejectionEmailModal={mockRejectionEmailModal}
            setRejectionEmailModal={mockSetRejectionEmailModal}
            sendRejectionEmail={mockSendRejectionEmail}
            rejectionEmailSent={mockRejectionEmailSent}
        />);

        expect(screen.getByText('Ready to Send Candidate Did Interview Rejection Email')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to send the rejection email to this applicant? The email will be sent immediately upon your confirmation.')).toBeInTheDocument();
        expect(screen.getByText('Send Rejection Email')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('renders CandidateDidInterview component if Rejection Email has been sent', () => {
        mockRejectionEmailSent = '1';

        render(<CandidateDidInterview 
            appSysId={mockAppSysId}
            rejectionEmailModal={mockRejectionEmailModal}
            setRejectionEmailModal={mockSetRejectionEmailModal}
            sendRejectionEmail={mockSendRejectionEmail}
            rejectionEmailSent={mockRejectionEmailSent}
        />);

        expect(screen.getByText('Candidate Did Interview Rejection Email Already Sent.')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to send the rejection email to this applicant again?/i)).toBeInTheDocument();
        expect(screen.getByText('Send Rejection Email Again')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('calls handleReferenceSubmit function when Send Rejection Email button is clicked', () => {
        mockRejectionEmailSent = '0';

        render(<CandidateDidInterview 
            appSysId={mockAppSysId}
            rejectionEmailModal={mockRejectionEmailModal}
            setRejectionEmailModal={mockSetRejectionEmailModal}
            sendRejectionEmail={mockSendRejectionEmail}
            rejectionEmailSent={mockRejectionEmailSent}
        />);

        fireEvent.click(screen.getByText('Send Rejection Email'));

        expect(mockSendRejectionEmail).toHaveBeenCalledWith(mockAppSysId);
        expect(mockSetRejectionEmailModal).toHaveBeenCalledWith(false);
    }); 

    test('calls handleReferenceCancel function when Cancel button is clicked', () => {
        mockRejectionEmailSent = '0';

        render(<CandidateDidInterview 
            appSysId={mockAppSysId}
            rejectionEmailModal={mockRejectionEmailModal}
            setRejectionEmailModal={mockSetRejectionEmailModal}
            sendRejectionEmail={mockSendRejectionEmail}
            rejectionEmailSent={mockRejectionEmailSent}
        />);

        fireEvent.click(screen.getByText('Cancel'));

        expect(mockSetRejectionEmailModal).toHaveBeenCalledWith(false);
    });
});