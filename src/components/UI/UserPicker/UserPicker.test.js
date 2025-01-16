import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserPicker from './UserPicker';
import axios from 'axios';

jest.mock('axios');

describe('UserPicker Component', () => {
    const mockOnChange = jest.fn();
    const mockBuildUrl = jest.fn();

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

    test('displays no options when search query does not match', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Nonexistent' } });

        await screen.findByText('No options');
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
    });
    // Testing Error Handling on line 57
    test('logs a warning when there is an error fetching options', async () => {
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
        axios.get.mockRejectedValue(new Error('Network Error'));

        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        await waitFor(() => {
            expect(consoleWarnSpy).toHaveBeenCalledWith(new Error('Network Error'));
        });

        consoleWarnSpy.mockRestore();
    });

    // Testing line 52 conditional
    test('sets options and hasMore when data is not empty', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        const options = await screen.findAllByText(/John Doe|Jane Doe/);
        expect(options.length).toBeGreaterThan(0);
        expect(options[0]).toBeInTheDocument();
    });

    // Testing buildURL function
    test('builds URL correctly with search query', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('nameLIKEJohn^ORemailLIKEJohn'));
        });
    });


    test('builds URL with correct response fields', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('&sysparm_fields=sys_id,name,email,organization'));
        });
    });

    test('builds URL with correct limit and offset', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('&sysparm_limit=20&sysparm_offset=0'));
        });
    });

    test('builds URL with display value set to all', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('&sysparm_display_value=all'));
        });
    });

    // Testing buildUrl with no search query

    test('builds URL correctly without search query', async () => {
        render(<UserPicker value={mockUser} onChange={mockOnChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.click(input);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('^nameISNOTEMPTY'));
        });
    });
});