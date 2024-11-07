import React from 'react';
import { render } from '@testing-library/react';
import Divider from './Divider';

describe('Divider Component', () => {
    it('should render without crashing', () => {
        const { container } = render(<Divider text="Test Text" />);
        expect(container).toBeInTheDocument();
    });

    it('should display the correct text', () => {
        const { getByText } = render(<Divider text="Test Text" />);
        expect(getByText('Test Text')).toBeInTheDocument();
    });

    it('should have the correct class name', () => {
        const { container } = render(<Divider text="Test Text" />);
        expect(container.firstChild).toHaveClass('Divider');
    });
});