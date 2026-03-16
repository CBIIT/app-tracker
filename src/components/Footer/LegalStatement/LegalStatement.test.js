import { render, screen } from '@testing-library/react';
import LegalStatement from './LegalStatement';
import useAuth from '../../../hooks/useAuth';

jest.mock('../../../hooks/useAuth');

describe('LegalStatement', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({
            auth: {
                ombNo: '5029-1067-1205',
                ombExpiration: 'Expiration Date: 12/31/3000',
            }
        })
    });

    test('should display the correct OMB number', () => {
        render(<LegalStatement />);
        expect(screen.getByText(/OMB No. 5029-1067-1205/i)).toBeInTheDocument();
    });

    test('should display the correct expiration date', () => {
        render(<LegalStatement />);
        expect(screen.getByText(/Expiration Date: 12\/31\/3000/i)).toBeInTheDocument();
    });

    // test('should contain a link to the OPM GOVT-5 document', () => {
    //     render(<LegalStatement />);
    //     const linkElement = screen.getByText(/OPM GOVT-5/i);
    //     expect(linkElement).toBeInTheDocument();
    //     expect(linkElement.closest('a')).toHaveAttribute('href', 'http://www.opm.gov/information-management/privacy-policy/sorn/opm-sorn-govt-5-recruiting-examining-and-placement-records.pdf');
    // });

    test('should display the correct public reporting burden information', () => {
        render(<LegalStatement />);
        expect(screen.getByText(/Public reporting burden for this collection of information is estimated to average 30 minutes per response/i)).toBeInTheDocument();
    });

    test('should display the correct NIH address', () => {
        render(<LegalStatement />);
        expect(screen.getByText(/NIH, Project Clearance Branch, 6705 Rockledge Drive, MSC 7974, Bethesda, MD 20892-7974, ATTN: PRA \(5029-1067-1205\)/i)).toBeInTheDocument();
    });
});