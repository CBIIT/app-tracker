import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoCard from './InfoCard';

describe('InfoCard Component', () => {
    const defaultProps = {
        title: 'Test Title',
        initiallyHideContent: false,
        allowToggle: true,
        onSwitchToggle: jest.fn(),
        switchTitle: 'Test Switch',
        switchInitialValue: false,
        className: 'test-class',
        style: { color: 'red' },
    };

    test('renders InfoCard with title', () => {
        render(<InfoCard {...defaultProps}>Test Content</InfoCard>);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    test('renders InfoCard with default className if className is not provided', () => {
        render(<InfoCard {...defaultProps} className={undefined}>Test Content</InfoCard>);
        const container = screen.getByText('Test Title').closest('.InfoCardContainer');
        expect(container).toHaveClass('InfoCardContainer');
    });

    test('renders InfoCard with default style if style is not provided', () => {
        render(<InfoCard {...defaultProps} style={undefined}>Test Content</InfoCard>);
        const container = screen.getByText('Test Title').closest('.InfoCardContainer');
        expect(container).not.toHaveStyle('color: red');
    });

    test('toggles content visibility on heading click', () => {
        render(<InfoCard {...defaultProps}>Test Content</InfoCard>);
        const heading = screen.getByText('Test Title');
        fireEvent.click(heading);
        expect(screen.queryByText('Test Content')).toHaveStyle('display: none');
        fireEvent.click(heading);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('renders switch with correct title', () => {
        render(<InfoCard {...defaultProps}>Test Content</InfoCard>);
        expect(screen.getByText('Test Switch')).toBeInTheDocument();
    });

    test('calls onSwitchToggle when switch is toggled', () => {
        render(<InfoCard {...defaultProps}>Test Content</InfoCard>);
        const switchElement = screen.getByRole('switch');
        fireEvent.click(switchElement);
        expect(defaultProps.onSwitchToggle).toHaveBeenCalled();
    });

    test('renders switch with correct initial value', () => {
        render(<InfoCard {...defaultProps} switchInitialValue={true}>Test Content</InfoCard>);
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toBeChecked();
    });

    test('renders switch with correct checked and unchecked icons', () => {
        render(<InfoCard {...defaultProps}>Test Content</InfoCard>);
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toHaveClass('ant-switch');
    });

    test('does not render switch if onSwitchToggle is not provided', () => {
        render(<InfoCard {...defaultProps} onSwitchToggle={undefined}>Test Content</InfoCard>);
        expect(screen.queryByRole('switch')).toBeNull();
    });

    test('applies custom className and style', () => {
        render(<InfoCard {...defaultProps}>Test Content</InfoCard>);
        const container = screen.getByText('Test Title').closest('.InfoCardContainer');
        expect(container).toHaveClass('test-class');
        expect(container).toHaveStyle('color: red');
    });

    test('does not toggle content visibility if allowToggle is false', () => {
        render(<InfoCard {...defaultProps} allowToggle={false}>Test Content</InfoCard>);
        const heading = screen.getByText('Test Title');
        fireEvent.click(heading);
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('renders additionalText when provided', () => {
        render(<InfoCard {...defaultProps} additionalText="Extra Info">Test Content</InfoCard>);
        expect(screen.getByText('Extra Info')).toBeInTheDocument();
    });






});