import { render, screen } from '@testing-library/react';
import SubmitModal from './SubmitModal';
import useAuth from '../../../hooks/useAuth';

jest.mock('../../../hooks/useAuth');


describe('SubmitModal component', () => {
    let mockUseAuth;
    let mockVisible; // returns True or False
    let mockHandleCancel;
    let mockFormData;
    let mockDraftId;
    let mockEditSubmitted; // returns True or False
    let mockAppSysId;

    beforeEach(() => {
        mockHandleCancel = jest.fn();
    });

    test('should render SubmitModal component', () => {
        mockVisible = true;
        render(<SubmitModal
            visible={mockVisible}
            onCancel={mockHandleCancel}
            data={mockFormData}
            draftId={mockDraftId}
            editSubmitted={mockEditSubmitted}
            submittedAppSysId={mockAppSysId}
        />);

        const handleOkElement = screen.getByText(/Ok/i);
        expect(handleOkElement).toBeInTheDocument();

        const handleCancelElement = screen.getByText(/Cancel/i);
        expect(handleCancelElement).toBeInTheDocument();
    });

    // Test cases for new app submissions
    test('should begin new app submission process on Ok click', () => {
        mockUseAuth = {
            auth: {
                isUserLoggedIn: true,
                user: { uid: '123' },
                oktaLoginAndRedirectUrl: 'http://example.com/login',
            },
        };
        useAuth.mockReturnValue(mockUseAuth);

        mockVisible = true;

    });
    


    
    // Test cases for editing submitted applications

    mockFormData = {
        VacancyDocuments: [
            {
                uploadedDocument: {
                    markedToDelete: false,
                    attachSysId: '123',
                },
            },
        ],
    }

})


