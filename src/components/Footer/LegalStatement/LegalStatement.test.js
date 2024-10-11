import { render, screen } from '@testing-library/react'
import LegalStatement from './LegalStatement'

describe('legalStatement', () => {
    test('should render the component and it contains the LegalStatement class', () => {
        const { container } = render(<LegalStatement />);
        expect(container.firstChild).toHaveClass('LegalStatement')
    })
});