import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditableField from './EditableField';

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};
import { Form } from 'antd';

describe('EditableField Component', () => {
    test('renders email input with correct validation rules', () => {
        const { getByLabelText } = render(
            <Form>
                <EditableField label="Email" name="email" required={true} />
            </Form>
        );

        const emailInput = getByLabelText('Email');
        expect(emailInput).toBeInTheDocument();
        expect(emailInput).toHaveAttribute('required');
    });

    test('renders generic input with correct validation rules', () => {
        const { getByLabelText } = render(
            <Form>
                <EditableField label="Name" name="name" required={true} />
            </Form>
        );

        const nameInput = getByLabelText('Name');
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveAttribute('required');
    });

    test('renders input without required attribute when not required', () => {
        const { getByLabelText } = render(
            <Form>
                <EditableField label="Name" name="name" required={false} />
            </Form>
        );

        const nameInput = getByLabelText('Name');
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).not.toHaveAttribute('required');
    });
});