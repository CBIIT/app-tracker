import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoCardRow from './InfoCardRow';

describe('InfoCardRow Component', () => {
    test('renders children correctly', () => {
        const { getByText } = render(
            <InfoCardRow>
                <span>Test Child</span>
            </InfoCardRow>
        );
        expect(getByText('Test Child')).toBeInTheDocument();
    });

    test('applies custom styles correctly', () => {
        const customStyle = { backgroundColor: 'red' };
        const { container } = render(
            <InfoCardRow style={customStyle}>
                <span>Styled Child</span>
            </InfoCardRow>
        );
        expect(container.firstChild).toHaveStyle('background-color: red');
    });

    test('has the correct class name', () => {
        const { container } = render(
            <InfoCardRow>
                <span>Class Name Test</span>
            </InfoCardRow>
        );
        expect(container.firstChild).toHaveClass('InfoCardRow');
    });

    test('renders without crashing', () => {
        const { container } = render(<InfoCardRow />);
        expect(container.firstChild).toBeInTheDocument();
    });

    test('renders multiple children correctly', () => {
        const { getByText } = render(
            <InfoCardRow>
                <span>Child 1</span>
                <span>Child 2</span>
            </InfoCardRow>
        );
        expect(getByText('Child 1')).toBeInTheDocument();
        expect(getByText('Child 2')).toBeInTheDocument();
    });
    test('renders with no children', () => {
        const { container } = render(<InfoCardRow />);
        expect(container.firstChild).toBeEmptyDOMElement();
    });



    test('renders with additional props', () => {
        const { container } = render(
            <InfoCardRow data-testid="info-card-row">
                <span>Additional Props Test</span>
            </InfoCardRow>
        );
        expect(container.firstChild).toHaveAttribute('data-testid', 'info-card-row');
    });
    test('renders with different HTML elements as children', () => {
        const { getByText } = render(
            <InfoCardRow>
                <p>Paragraph Child</p>
                <div>Div Child</div>
            </InfoCardRow>
        );
        expect(getByText('Paragraph Child')).toBeInTheDocument();
        expect(getByText('Div Child')).toBeInTheDocument();
    });


});