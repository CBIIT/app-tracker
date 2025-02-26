import ReferenceModal from './ReferenceModal';
import { render, screen } from '@testing-library/react';
   
describe('ReferenceModal', () => {
    let mockAppSysId;
    let mockShowModal;
    let mockSetShowModal;
    let mockSendReferences;
    let mockReferencesSent;

    beforeEach(() => {
        mockAppSysId = '1234';
        mockShowModal = true;
        mockSetShowModal = jest.fn();
        mockSendReferences = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders ReferenceModal component if Reference Collection has not been sent', () => {
        mockReferencesSent = '0';

        render(<ReferenceModal 
            appSysId={mockAppSysId}
            showModal={mockShowModal}
            setShowModal={mockSetShowModal}
            sendReferences={mockSendReferences}
            referencesSent={mockReferencesSent}
        />);

        expect(screen.getByText('Ready To Send Reference Letter Collection Notifications')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to send the Reference Letter collection emails to the listed references for this applicant? The notifications will be sent immediately upon your confirmation.')).toBeInTheDocument();
        expect(screen.getByText('Send References')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    test('renders ReferenceModal component if Reference Collection has been sent', () => {
        mockReferencesSent = '1';

        render(<ReferenceModal 
            appSysId={mockAppSysId}
            showModal={mockShowModal}
            setShowModal={mockSetShowModal}
            sendReferences={mockSendReferences}
            referencesSent={mockReferencesSent}
        />);

        expect(screen.getByText('Reference Letter Collection Notifications Have Already Been Sent.')).toBeInTheDocument();
        expect(screen.getByText(/Notifications to this applicant's listed references have already been sent. Would you like to send the Reference Letter Collection emails again?/i)).toBeInTheDocument();
        expect(screen.getByText('Send References Again')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

});