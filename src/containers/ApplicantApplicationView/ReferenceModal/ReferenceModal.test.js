import ReferenceModal from './ReferenceModal';
import { render, screen, fireEvent } from '@testing-library/react';

describe('ReferenceModal', () => {
    let mockSetReferenceModal;
    let mockRequestReference;
    let mockCallback;
    let mockRefSysId;
    let mockMaxTries;

    beforeEach(() => {
        mockSetReferenceModal = jest.fn();
        mockRequestReference = jest.fn();
        mockCallback = jest.fn();
        mockRefSysId = 'ref-123';
        mockMaxTries = 3;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders modal with initial state when referencesRequested is 0', () => {
        render(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'0'}
                maxTries={mockMaxTries}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        expect(screen.getByText(/Ready To Send Email for Reference Letter Collection/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /Are you sure you want to send the Reference Letter Collection email to this reference/i
            )
        ).toBeInTheDocument();
        expect(screen.getByTestId('send-email-button')).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });

    test('renders modal with already sent state when referencesRequested is greater than 0', () => {
        render(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'1'}
                maxTries={mockMaxTries}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        expect(screen.getByText(/Reference Letter Collection Email Have Already Been Sent/i)).toBeInTheDocument();
        expect(screen.getByTestId('send-email-again-button')).toBeInTheDocument();
        expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    });

    test('calls handleReferenceSubmit when Send Email button is clicked', () => {
        render(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'0'}
                maxTries={mockMaxTries}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        fireEvent.click(screen.getByTestId('send-email-button'));

        expect(mockRequestReference).toHaveBeenCalledWith(mockRefSysId);
        expect(mockCallback).toHaveBeenCalled();
        expect(mockSetReferenceModal).toHaveBeenCalledWith(false);
    });

    test('calls handleReferenceCancel when Cancel button is clicked', () => {
        render(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'0'}
                maxTries={mockMaxTries}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        fireEvent.click(screen.getByText(/Cancel/i));

        expect(mockSetReferenceModal).toHaveBeenCalledWith(false);
        expect(mockRequestReference).not.toHaveBeenCalled();
    });

    test('disables Send Email Again button when max tries reached', () => {
        render(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'3'}
                maxTries={3}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        const sendButton = screen.getByTestId('send-email-again-button');
        expect(sendButton).toBeDisabled();
    });

    test('enables Send Email Again button when max tries not reached', () => {
        render(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'1'}
                maxTries={3}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        const sendButton = screen.getByTestId('send-email-again-button');
        expect(sendButton).not.toBeDisabled();
    });

    test('displays correct message when max tries reached', () => {
        render(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'3'}
                maxTries={3}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        expect(screen.getByText(/You have reached the maximum number of reference letter requests/i)).toBeInTheDocument();
    });

    test('does not render modal when referenceModal is false', () => {
        render(
            <ReferenceModal
                referenceModal={false}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'0'}
                maxTries={mockMaxTries}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        // Modal should not be visible in the document
        expect(screen.queryByText(/Ready To Send Email for Reference Letter Collection/i)).not.toBeInTheDocument();
    });

    test('displays time/times correctly based on referencesRequested count', () => {
        const { rerender } = render(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'1'}
                maxTries={3}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        expect(screen.getByText(/have already been sent 1 time/i)).toBeInTheDocument();

        rerender(
            <ReferenceModal
                referenceModal={true}
                setReferenceModal={mockSetReferenceModal}
                refSysId={mockRefSysId}
                referencesRequested={'2'}
                maxTries={3}
                requestReference={mockRequestReference}
                reloadApplicationInfo={mockCallback}
            />
        );

        expect(screen.getByText(/have already been sent 2 times/i)).toBeInTheDocument();
    });
});
