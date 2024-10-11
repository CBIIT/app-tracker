import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import LegalStatement from './LegalStatement/LegalStatement';
import ExternalNav from './ExternalNav/ExternalNav';

describe('Footer component', () => {
    test('should have a div with class name Footer', () => {
        const { container } = render(<Footer />);
        const footerDiv = container.querySelector('div.Footer');
        expect(footerDiv).not.toBeNull();
    });

    test('should render ExternalNav component inside Footer', () => {
        render(<Footer />);
        const externalNavElement = screen.getByText(/HHS Vulnerability Disclosure/i);
        expect(externalNavElement).toBeInTheDocument();
    });

    test('should display the correct OMB number', () => {
        render(<LegalStatement />);
        const legalStatementElement = screen.getByText(/OMB No. 0925-0761/i);
        expect(legalStatementElement).toBeInTheDocument();
    });

    test('should display the correct expiration date', () => {
        render(<LegalStatement />);
        const legalStatementElement = screen.getByText(/Expiration Date: 07\/31\/2025/i);
        expect(legalStatementElement).toBeInTheDocument();
    });
});