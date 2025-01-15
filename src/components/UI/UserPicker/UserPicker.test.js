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
    const mockUser2 = {
        name: { value: 'John Doe2' },
        email: { value: 'john.doe2@example.com' },
        organization: { value: 'Example Org Two' },
        sys_id: { value: '2' }
    };
    const mockUser3 = {
        name: { value: 'Jane Doe' },
        email: { value: 'jane.doe@example.com' },
        organization: { value: 'Example Org Three' },
        sys_id: { value: '3' }
    };
    beforeEach(() => {
        axios.get.mockResolvedValue({
            data: {
                result: [mockUser, mockUser2, mockUser3]
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

        await screen.findAllByText('John Doe');
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('Example Org')).toBeInTheDocument();
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
    test('shows appropriate users appear when input is changed', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });
        await screen.findAllByText('John Doe');
        expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('Example Org')).toBeInTheDocument();
        expect(screen.getByText('John Doe2')).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'Jane' } });
        await screen.findAllByText('Jane Doe');
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('Example Org Three')).toBeInTheDocument();
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('John Doe2')).not.toBeInTheDocument();
    });
});