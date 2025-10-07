import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailModal from './EmailModal';
import axios from 'axios';

jest.mock('axios');
jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: { success: jest.fn() },
    notification: { error: jest.fn() }
}));

describe('EmailModal handleOk', () => {
    const sysId = '123';
    const setEmailButtonDisabled = jest.fn();
    const handleCloseModal = jest.fn();
    const visible = true;

    const setup = () => {
        render(
            <EmailModal
                sysId={sysId}
                setEmailButtonDisabled={setEmailButtonDisabled}
                handleCloseModal={handleCloseModal}
                visible={visible}
            />
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders EmailModal component', () => {
        setup();

        expect(screen.getByText('Are you sure you want to send both Complimentary and Regret Emails?')).toBeInTheDocument();
        expect(screen.getByText('Individuals who have been identified as the top 25% will receive the Complimentary email and all other individuals will receive the Regret email.')).toBeInTheDocument();
        expect(screen.getByText('Please note that once this notification has been sent, you will not be able to send the notifications again.')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Okay')).toBeInTheDocument();
    });

    it('calls success flow when axios resolves', async () => {
        axios.get.mockResolvedValue({
            data: { result: { message: 'Complimentary and regret emails have been sent.' } }
        });

        setup();

        fireEvent.click(screen.getByText('Okay'));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(sysId));
            expect(setEmailButtonDisabled).toHaveBeenCalledWith(true);
            expect(handleCloseModal).toHaveBeenCalled();
            expect(screen.getByText('Complimentary and regret emails have been sent.')).toBeInTheDocument();
        });
    });

    it('calls error flow when axios rejects', async () => {
        axios.get.mockRejectedValue(new Error('Sorry! An error occurred while attempting to send the complimentary and regret emails. Please try again.'));

        setup();

        fireEvent.click(screen.getByText('Okay'));

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(sysId));
            expect(handleCloseModal).toHaveBeenCalled();
            const message = screen.getByText(/Sorry! There was an error attempting to send the emails./);
            expect(message).toBeInTheDocument();
        });
    });

});