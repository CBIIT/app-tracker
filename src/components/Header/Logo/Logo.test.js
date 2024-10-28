import React from 'react';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';
import nihLogo from '../../../assets/images/nih-logo.png';

describe('Logo Component', () => {
    test('renders without crashing', () => {
        const { getByTestId } = render(<Logo />);
        const logoElement = getByTestId('logo');
        expect(logoElement).toBeInTheDocument();
    });

    test('contains a link to the NIH website', () => {
        const { getByTestId } = render(<Logo />);
        const linkElement = getByTestId('logo').querySelector('a');
        expect(linkElement).toHaveAttribute('href', 'https://www.nih.gov');
    });

    test('NIH logo image has correct src attribute', () => {
        render(<Logo />);
        const logo = screen.getByRole('img');
        expect(logo).toHaveAttribute('src', nihLogo);
        expect(logo).toHaveAttribute('alt', 'NIH');
    });
});