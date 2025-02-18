import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputWithButton from './InputWithButton';
import { Button, Input, Form } from 'antd';
import { expect } from '@jest/globals';

describe('InputWithButton Component', () => {
    const defaultProps = {
        name: 'testInput',
        rules: [{ required: true, message: 'Input is required' }],
        readOnly: false,
        buttonIcon: <span>Icon</span>,
        onInnerButtonClick: jest.fn(),
    };

    test('renders input and button when readOnly is false', () => {
        render(<InputWithButton {...defaultProps} />);

        const inputElement = screen.getByRole('textbox');
        const buttonElement = screen.getByRole('button');

        expect(inputElement).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
    });

    test('renders input only when readOnly is true', () => {
        render(<InputWithButton {...defaultProps} readOnly={true} />);

        const inputElement = screen.getByRole('textbox');
        const buttonElement = screen.queryByRole('button');

        expect(inputElement).toBeInTheDocument();
        expect(buttonElement).not.toBeInTheDocument();
    });

    test('button click triggers onInnerButtonClick', () => {
        render(<InputWithButton {...defaultProps} />);

        const buttonElement = screen.getByRole('button');
        fireEvent.click(buttonElement);

        expect(defaultProps.onInnerButtonClick).toHaveBeenCalled();
    });

    test('input is disabled when readOnly is true', () => {
        render(<InputWithButton {...defaultProps} readOnly={true} />);

        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toBeDisabled();
    });

    test('input is enabled when readOnly is false', () => {
        render(<InputWithButton {...defaultProps} />);

        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toBeEnabled();
    });
});