import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import InputWithCheckbox from './InputWithCheckbox';
// import { DeleteOutlined } from '@ant-design/icons';
import { Form } from 'antd';

describe('InputWithCheckbox Component', () => {
    const defaultProps = {
        name: 'testInput',
        rules: [],
        onInnerButtonClick: jest.fn(),
        checkboxName: 'testCheckbox',
        readOnly: false,
    };

    const renderComponent = (props = {}) => {
        return render(
            <Form>
                <InputWithCheckbox {...defaultProps} {...props} />
            </Form>
        );
    };

    test('renders InputWithCheckbox component with correct props', () => {
        renderComponent();
        const inputField = screen.getByRole('textbox');
        expect(inputField).toBeInTheDocument();
        expect(inputField).toHaveClass('ant-input Input');
    });

    test('renders DeleteOutlined icon inside InputWithButton', () => {
        renderComponent();
        const deleteIcon = screen.getByRole('img', { hidden: true });
        expect(deleteIcon).toBeInTheDocument();
        expect(deleteIcon).toHaveClass('anticon anticon-delete');
    });

    test('renders Checkbox with correct props', () => {
        renderComponent();
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    test('Checkbox is disabled when readOnly is true', () => {
        renderComponent({ readOnly: true });
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();
    });

    test('Checkbox is enabled when readOnly is false', () => {
        renderComponent({ readOnly: false });
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeDisabled();
    });

    test('calls onInnerButtonClick when button is clicked', () => {
        renderComponent();
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(defaultProps.onInnerButtonClick).toHaveBeenCalled();
    });
});