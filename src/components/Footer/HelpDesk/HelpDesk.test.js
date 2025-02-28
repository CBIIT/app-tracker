import { render, screen } from '@testing-library/react';
import HelpDesk from './HelpDesk';

describe('HelpDesk', () => {
    test('Should display the correct title', () => {
        render(<HelpDesk />);
        expect(screen.getByText(/Contact System Support/i)).toBeInTheDocument();
    });

    test('should display the correct email address', () => {
        render(<HelpDesk />);
        const linkElement = screen.getByText(/NCIAppSupport@nih.gov/i);
        expect(screen.getByText(/Email:/i)).toBeInTheDocument();
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.closest('a')).toHaveAttribute('href', 'mailto:NCIAppSupport@mail.nih.gov');
    });

    test('should display the correct telephone number', () => {
        render(<HelpDesk />);
        expect(screen.getByText(/System Support Telephone:/i)).toBeInTheDocument();
        expect(screen.getByText(/240-276-5541 or toll free: 888-478-4423/i)).toBeInTheDocument();
    });

    test('should display the correct hours of operation', () => {
        render(<HelpDesk />);
        expect(screen.getByText(/Hours: Monday to Friday, 9:00 a.m. to 5:00 p.m. Eastern Time \(ET\), closed weekends and holidays./i)).toBeInTheDocument();
    });
});