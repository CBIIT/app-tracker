import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserPicker from './UserPicker';
import axios from 'axios';

jest.mock('axios');

describe('UserPicker Component', () => {
    const mockOnChange = jest.fn();

    const mockUser = {
        name: { value: 'John Doe' },
        email: { value: 'john.doe@example.com' },
        organization: { value: 'Example Org' },
        sys_id: { value: '1' }
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({
            data: {
                result: [mockUser]
            }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders UserPicker component', () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    test('loads options on input change', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        const options = await screen.findAllByText('John Doe');
        expect(options).toHaveLength(1);
    });

    test('calls onChange when an option is selected', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        const option = await screen.findByText('John Doe');
        fireEvent.click(option);

        expect(mockOnChange).toHaveBeenCalledWith(mockUser);
    });

    test('formats option label correctly', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });
        await screen.findByText('John Doe');
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('Example Org')).toBeInTheDocument();
    });
});