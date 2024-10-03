import { render, screen } from '@testing-library/react'
import LegalStatement from './LegalStatement'

test('Renders the "OMB No." text', () => {
    const { container } = render(<LegalStatement />);
    expect(container.firstChild).toHaveClass('LegalStatement')
})