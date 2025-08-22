import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserPicker from './UserPicker';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';

// Mock dependencies
jest.mock('../../../hooks/useAuth');
jest.mock('axios');
jest.mock('@ant-design/icons', () => ({
    LoadingOutlined: () => <span data-testid="loading-icon" />,
}));

const mockSetCommitteeMemberOptions = jest.fn();

const defaultCommitteeMemberOptions = [
    {
        uid: '1',
        name: { value: 'Alice' },
        email: 'alice@example.com',
        organization: 'Org1',
        label: 'Alice',
        value: '1',
    },
    {
        uid: '2',
        name: { value: 'Bob' },
        email: 'bob@example.com',
        organization: 'Org2',
        label: 'Bob',
        value: '2',
    },
];

function setupAuthMock(options = defaultCommitteeMemberOptions) {
    useAuth.mockReturnValue({
        currentTenant: 'tenant1',
        committeeMemberOptions: options,
        setCommitteeMemberOptions: mockSetCommitteeMemberOptions,
    });
}

describe('UserPicker (referenceField) crash test', () => {
    it('renders without crashing with empty committeeMemberOptions', async () => {
        setupAuthMock([]);
        axios.get.mockResolvedValueOnce({
            data: {
                result: [
                    { uid: '1', name: { value: 'Alice' }, email: 'alice@example.com', organization: 'Org1' },
                ],
            },
        });

        render(<UserPicker value={{}} onChange={jest.fn()} />);
        expect(await screen.getByTestId('loading-icon')).toBeInTheDocument();

        await waitFor(() => {
            expect(mockSetCommitteeMemberOptions).toHaveBeenCalled();
        });
    });

    it('renders without crashing with prefilled committeeMemberOptions 1', async () => {
        setupAuthMock(defaultCommitteeMemberOptions);

        render(<UserPicker value={{}} onChange={jest.fn()} />);
        await fireEvent.mouseDown(screen.getByRole('combobox'));
        expect(await screen.queryByTestId('loading-icon')).not.toBeInTheDocument();
        //expect(screen.getByPlaceholderText('Search to select a user')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('handles axios error gracefully', async () => {
        setupAuthMock([]);
        axios.get.mockRejectedValueOnce(new Error('Network error'));

        render(<UserPicker value={{}} onChange={jest.fn()} />);
        expect(screen.getByTestId('loading-icon')).toBeInTheDocument();

        await waitFor(() => {
            // Should stop loading even on error
            expect(screen.queryByTestId('loading-icon')).not.toBeInTheDocument();
        });
    });

    it('renders with no options', async () => {
        setupAuthMock([]);
        axios.get.mockResolvedValueOnce({ data: { result: [] } });

        render(<UserPicker value={{}} onChange={jest.fn()} />);
        expect(screen.getByTestId('loading-icon')).toBeInTheDocument();

        await waitFor(() => {
            expect(mockSetCommitteeMemberOptions).toHaveBeenCalledWith([]);
        });
    });
});