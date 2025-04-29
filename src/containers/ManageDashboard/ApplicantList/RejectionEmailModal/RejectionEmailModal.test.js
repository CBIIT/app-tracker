import { render, screen } from '@testing-library/react';
import RejectionEmailmodal from './RejectionEmailModal';
import CandidateDidInterview from './CandidateDidInterview/CandidateDidInterview';
import CandidateDidNotInterview from './CandidateDidNotInterview/CandidateDidNotInterview';

jest.mock('./CandidateDidInterview/CandidateDidInterview', () => jest.fn(() => <div>Mocked CandidateDidInterview</div>));
jest.mock('./CandidateDidNotInterview/CandidateDidNotInterview', () => jest.fn(() => <div>Mocked CandidateDidNotInterview</div>));


describe('RejectionEmailModal', () => {
    const mockSendRejectionEmail = jest.fn();
    const mockSetRejectionEmailModal = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders CandidateDidInterview component when referredToInterview is "yes"', () => {
        render(
            <RejectionEmailmodal
                appSysId="1234"
                referredToInterview="yes"
                rejectionEmailModal={true}
                rejectionEmailSent="0"
                sendRejectionEmail={mockSendRejectionEmail}
                setRejectionEmailModal={mockSetRejectionEmailModal}
            />
        );

        expect(screen.getByText('Mocked CandidateDidInterview')).toBeInTheDocument();
        expect(CandidateDidInterview).toHaveBeenCalledWith(
            expect.objectContaining({
                appSysId: "1234",
                rejectionEmailModal: true,
                setRejectionEmailModal: mockSetRejectionEmailModal,
                rejectionEmailSent: "0",
                sendRejectionEmail: mockSendRejectionEmail,
            }),
            {}
        );
    });

    test('renders CandidateDidNotInterview component when referredToInterview is "no"', () => {
        render(
            <RejectionEmailmodal
                appSysId="1234"
                referredToInterview="no"
                rejectionEmailModal={true}
                rejectionEmailSent="0"
                sendRejectionEmail={mockSendRejectionEmail}
                setRejectionEmailModal={mockSetRejectionEmailModal}
            />
        );

        expect(screen.getByText('Mocked CandidateDidNotInterview')).toBeInTheDocument();
        expect(CandidateDidNotInterview).toHaveBeenCalledWith(
            expect.objectContaining({
                appSysId: "1234",
                rejectionEmailModal: true,
                setRejectionEmailModal: mockSetRejectionEmailModal,
                rejectionEmailSent: "0",
                sendRejectionEmail: mockSendRejectionEmail,
            }),
            {}
        );
    });
});