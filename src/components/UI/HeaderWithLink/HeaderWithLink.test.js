import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HeaderWithLink from './HeaderWithLink';

describe('HeaderWithLink Component', () => {
    it('should render the title', () => {
        const { getByText } = render(
            <Router>
                <HeaderWithLink title="Test Title" route="/" routeTitle="Home" />
            </Router>
        );
        screen.debug()
        expect(getByText('Test Title')).toBeInTheDocument();
        expect(getByText('Home')).toBeInTheDocument();
    });

    it('should render the link with the correct route and title', () => {
        const { getByText } = render(
            <Router>
                <HeaderWithLink title="Test Title" route="/test-route" routeTitle="Test Route" />
            </Router>
        );
        const linkElement = getByText('Test Route').closest('a');
        expect(linkElement).toHaveAttribute('href', '/test-route');
        expect(linkElement).toHaveAttribute('target', '_blank');
    });
});