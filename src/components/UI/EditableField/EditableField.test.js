import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import EditableField from './EditableField';
import { Form } from 'antd';

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('EditableField Component', () => {
    test('should display an error message when the email input is empty', async () => {
        const { getByLabelText } = render(
            <Form>
                <EditableField label="Email" name="email" required={true} />
            </Form>
        );

        const emailInput = getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: ' ' } });
        fireEvent.focus(emailInput);
        fireEvent.blur(emailInput);

        const errorMessage = await screen.findByText('Please provide a valid email address.');
        expect(errorMessage).toBeVisible();
    });
    test('should display an error message when the email input is invalid', async () => {
        const { getByLabelText } = render(
            <Form>
                <EditableField label="Email" name="email" required={true} />
            </Form>
        );

        const emailInput = getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: '@.com' } });
        fireEvent.focus(emailInput);
        fireEvent.blur(emailInput);

        const errorMessage = await screen.findByText('Please provide a valid email address.');
        expect(errorMessage).toBeVisible();
    });
    test('should not display an error message when the email input is valid', () => {
        const { getByLabelText } = render(
            <Form>
                <EditableField label="Email" name="email" required={true} />
            </Form>
        );

        const emailInput = getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.focus(emailInput);
        fireEvent.blur(emailInput);

        const errorMessage = screen.queryByText('Please provide a valid email address.');
        expect(errorMessage).toBeNull();
    });

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
    test('should not display an error message when the name input is not empty', async () => {
        const { getByLabelText } = render(
            <Form>
                <EditableField label="Name" name="name" required={true} />
            </Form>
        );

        const nameInput = getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: ' ' } });
        fireEvent.focus(nameInput);
        fireEvent.blur(nameInput);

        const errorMessage = screen.queryByText('Please provide an answer.');
        expect(errorMessage).toBeNull();
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