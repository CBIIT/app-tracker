import { render, screen } from '@testing-library/react';
import ExternalNav from './ExternalNav';

describe('ExternalNav', () => {
    test('should render the "HHS Vulnerability Disclosure" text', () => {
        render(<ExternalNav />);
        const element = screen.getByText(/HHS Vulnerability Disclosure/i);
        expect(element).toBeInTheDocument();
    });

    test('should render the "Home" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("Home");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://ccr.cancer.gov/');
    });

    test('should render the "Support" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("Support");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'mailto:NCIAppSupport@mail.nih.gov');
    });

    test('should render the "Policies" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("Policies");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://www.cancer.gov/global/web/policies');
    });

    test('should render the "Accessibility" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("Accessibility");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://www.cancer.gov/global/web/policies/accessibility');
    });

    test('should render the "Viewing Files" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("Viewing Files");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://cancer.gov/global/viewing-files');
    });

    test('should render the "FOIA" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("FOIA");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://www.cancer.gov/global/web/policies/foia');
    });

    test('should render the "U.S Department of Health and Human Services" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("U.S Department of Health and Human Services");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://www.hhs.gov/');
    });

    test('should render the "National Institutes of Health" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("National Institutes of Health");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://www.nih.gov/');
    });

    test('should render the "National Cancer Institute" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("National Cancer Institute");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://www.cancer.gov/');
    });

    test('should render the "USA.gov" link', () => {
        render(<ExternalNav />);
        const element = screen.getByText("USA.gov");
        expect(element).toBeInTheDocument();
        expect(element.closest('a')).toHaveAttribute('href', 'https://usa.gov/');
    });

    test('should render the trademark text', () => {
        render(<ExternalNav />);
        const element = screen.getByText("NIH ... Turning Discovery Into Health ®");
        expect(element).toBeInTheDocument();
    });
});