import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableDropDown from './EditableDropDown';
import { Form } from 'antd';

describe('EditableDropDown Component', () => {
    const defaultProps = {
        label: 'Test Label',
        name: 'testName',
        required: true,
        loading: false,
        disabled: false,
        showSearch: true,
        menu: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
        ],
        filterOption: (input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
        filterSort: (optionA, optionB) =>
            optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase()),
    };
    // Mock window.matchMedia
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // deprecated
                removeListener: jest.fn(), // deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    });

    it('renders without crashing', () => {
        render(
            <Form>
                <EditableDropDown {...defaultProps} />
            </Form>
        );
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('displays loading icon when loading is true', () => {
        render(
            <Form>
                <EditableDropDown {...defaultProps} loading={true} />
            </Form>
        );
        expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
        expect(screen.getByRole('img', { hidden: true })).toHaveClass('anticon-loading');
    });

    it('disables the select when disabled is true', () => {
        render(
            <Form>
                <EditableDropDown {...defaultProps} disabled={true} />
            </Form>
        );
        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('shows required message when no selection is made', async () => {
        render(
            <Form>
                <EditableDropDown {...defaultProps} />
            </Form>
        );
        const select = screen.getByRole('combobox');
        select.focus();
        select.blur();
        expect(await screen.findByText('Please make a selection')).toBeInTheDocument();
    });
    it('allows switching values in the dropdown', () => {
        render(
            <Form>
                <EditableDropDown {...defaultProps} />
            </Form>
        );
        const select = screen.getByRole('combobox');
        expect(select.value).toBe('');

        // Simulate selecting the first option
        fireEvent.mouseDown(select);
        const firstOption = screen.getByText('Option 1');
        fireEvent.click(firstOption);
        expect(screen.getByLabelText('Option 1')).toHaveAttribute('aria-selected', 'true');


        // Simulate selecting the second option
        fireEvent.mouseDown(select);
        const secondOption = screen.getByText('Option 2');
        fireEvent.click(secondOption);
        expect(screen.getByLabelText('Option 2')).toHaveAttribute('aria-selected', 'true');
    });
});