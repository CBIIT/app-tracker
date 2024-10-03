import { render, screen } from '@testing-library/react';
import ExternalNav from './ExternalNav';

test('Renders the "HHS Vulnerability Disclosure" text', () => {
    render(<ExternalNav />);
    const element = screen.getByText("HHS Vulnerability Disclosure");
    expect(element).toBeInTheDocument();
})