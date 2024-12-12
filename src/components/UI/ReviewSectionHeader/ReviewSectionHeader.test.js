import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewSectionHeader from './ReviewSectionHeader';

describe('ReviewSectionHeader', () => {
    test('renders without crashing', () => {
        render(<ReviewSectionHeader title="Test Title" showButton="true" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    test('renders title with error style', () => {
        render(<ReviewSectionHeader title="Test Title" error={true} showButton="false" />);
        expect(screen.getByText('Test Title')).toHaveStyle('color: red');
    });

    test('renders title without error style', () => {
        render(<ReviewSectionHeader title="Test Title" error={false} showButton="false" />);
        expect(screen.getByText('Test Title')).not.toHaveStyle('color: red');
    });

    test('renders button when showButton is true', () => {
        render(<ReviewSectionHeader title="Test Title" showButton="true" />);
        expect(screen.getByRole('button', { name: /edit section/i })).toBeInTheDocument();
    });

    test('does not render button when showButton is false', () => {
        render(<ReviewSectionHeader title="Test Title" showButton="false" />);
        expect(screen.queryByRole('button', { name: /edit section/i })).not.toBeInTheDocument();
    });

    test('calls onClick when button is clicked', () => {
        const handleClick = jest.fn();
        render(<ReviewSectionHeader title="Test Title" showButton="true" onClick={handleClick} />);
        fireEvent.click(screen.getByRole('button', { name: /edit section/i }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});