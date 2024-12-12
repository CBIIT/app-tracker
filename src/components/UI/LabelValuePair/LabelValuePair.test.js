import React from 'react';
import { render } from '@testing-library/react';
import LabelValuePair from './LabelValuePair';

describe('LabelValuePair Component', () => {
    it('renders without crashing', () => {
        const { getByText } = render(<LabelValuePair label="Test Label" value="Test Value" />);
        expect(getByText('Test Label')).toBeInTheDocument();
        expect(getByText('Test Value')).toBeInTheDocument();
    });

    it('applies custom styles correctly', () => {
        const containerStyle = { backgroundColor: 'red' };
        const labelStyle = { color: 'blue' };
        const valueStyle = { fontWeight: 'bold' };

        const { getByText, container } = render(
            <LabelValuePair
                label="Styled Label"
                value="Styled Value"
                containerStyle={containerStyle}
                labelStyle={labelStyle}
                valueStyle={valueStyle}
            />
        );

        expect(container.firstChild).toHaveStyle('background-color: red');
        expect(getByText('Styled Label')).toHaveStyle('color: blue');
        expect(getByText('Styled Value')).toHaveStyle('font-weight: bold');
    });

    it('renders empty label and value when not provided', () => {
        const { container } = render(<LabelValuePair />);
        expect(container.querySelector('h2').textContent).toBe('');
        expect(container.querySelector('span').textContent).toBe('');
    });
});