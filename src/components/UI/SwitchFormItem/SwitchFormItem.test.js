import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SwitchFormItem from './SwitchFormItem';
import { Form } from 'antd';

describe('SwitchFormItem Component', () => {
    const defaultProps = {
        name: 'testSwitch',
        rules: [],
        onChangeHandler: jest.fn(),
        readOnly: false,
        label: 'Test Label'
    };

    const renderComponent = (props = {}) => {
        return render(
            <Form>
                <SwitchFormItem {...defaultProps} {...props} />
            </Form>
        );
    };

    test('renders SwitchFormItem with label', () => {
        renderComponent();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    test('renders SwitchFormItem with Switch component', () => {
        renderComponent();
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    test('calls onChangeHandler when switch is toggled', () => {
        renderComponent();
        const switchElement = screen.getByRole('switch');
        fireEvent.click(switchElement);
        expect(defaultProps.onChangeHandler).toHaveBeenCalled();
    });

    test('disables switch when readOnly is true', () => {
        renderComponent({ readOnly: true });
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toBeDisabled();
    });

    test('enables switch when readOnly is false', () => {
        renderComponent({ readOnly: false });
        const switchElement = screen.getByRole('switch');
        expect(switchElement).not.toBeDisabled();
    });
});