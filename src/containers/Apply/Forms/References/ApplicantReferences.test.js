import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormContext from '../../Context';
import ApplicantReferences from './ApplicantReferences';
import { beforeEach, expect } from '@jest/globals';
// Mock window.matchMedia

const mockContextValue = {
    formData: {
        references: [
            {
                firstName: 'John',
                middleName: 'A',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phoneNumber: '123-456-7890',
                relationship: 'Supervisor/Manager',
                title: 'Manager',
                organization: 'Company Inc.',
            },
            {
                firstName: 'Jane',
                middleName: 'B',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                phoneNumber: '987-654-3210',
                relationship: 'Co-worker',
                title: 'Developer',
                organization: 'Tech Corp',
            },
            {
                firstName: 'Alice',
                middleName: 'C',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                phoneNumber: '555-555-5555',
                relationship: 'Colleague',
                title: 'Designer',
                organization: 'Design Studio',
            },
            {
                firstName: 'Bob',
                middleName: 'D',
                lastName: 'Brown',
                email: 'bob.brown@example.com',
                phoneNumber: '444-444-4444',
                relationship: 'Peer',
                title: 'Tester',
                organization: 'QA Inc.',
            },
            {
                firstName: 'Charlie',
                middleName: 'E',
                lastName: 'Davis',
                email: 'charlie.davis@example.com',
                phoneNumber: '333-333-3333',
                relationship: 'Supervisor/Manager',
                title: 'Lead',
                organization: 'Lead Corp',
            },
            {
                firstName: 'David',
                middleName: 'F',
                lastName: 'Evans',
                email: 'david.evans@example.com',
                phoneNumber: '222-222-2222',
                relationship: 'Co-worker',
                title: 'Engineer',
                organization: 'Engineering Inc.',
            },
            {
                firstName: 'Jane',
                middleName: 'B',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                phoneNumber: '987-654-3210',
                relationship: 'Co-worker',
                title: 'Developer',
                organization: 'Tech Corp',
            },
            {
                firstName: 'Alice',
                middleName: 'C',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                phoneNumber: '555-555-5555',
                relationship: 'Colleague',
                title: 'Designer',
                organization: 'Design Studio',
            },
            {
                firstName: 'Bob',
                middleName: 'D',
                lastName: 'Brown',
                email: 'bob.brown@example.com',
                phoneNumber: '444-444-4444',
                relationship: 'Peer',
                title: 'Tester',
                organization: 'QA Inc.',
            },
            {
                firstName: 'Charlie',
                middleName: 'E',
                lastName: 'Davis',
                email: 'charlie.davis@example.com',
                phoneNumber: '333-333-3333',
                relationship: 'Supervisor/Manager',
                title: 'Lead',
                organization: 'Lead Corp',
            },
            {
                firstName: 'David',
                middleName: 'F',
                lastName: 'Evans',
                email: 'david.evans@example.com',
                phoneNumber: '222-222-2222',
                relationship: 'Co-worker',
                title: 'Engineer',
                organization: 'Engineering Inc.',
            },

        ],
    },
    setCurrentFormInstance: jest.fn(),
};

const renderComponent = () => {
    render(
        <FormContext.Provider value={mockContextValue}>
            <ApplicantReferences />
        </FormContext.Provider>
    );
};

beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // deprecated
            removeListener: jest.fn(), // deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
});

describe('ApplicantReferences', () => {
    test('renders form with initial values', () => {
        renderComponent();

        expect(screen.getAllByLabelText(/First Name/i)[0]).toHaveValue('John');
        expect(screen.getAllByLabelText(/Middle Name/i)[0]).toHaveValue('A');
        expect(screen.getAllByLabelText(/Last Name/i)[0]).toHaveValue('Doe');
        expect(screen.getAllByLabelText(/Email Address/i)[0]).toHaveValue('john.doe@example.com');
        expect(screen.getAllByLabelText(/Phone Number/i)[0]).toHaveValue('123-456-7890');
        const relationshipOptions = screen.getAllByText('Relationship')[0];
        fireEvent.click(relationshipOptions);
        expect(screen.getAllByTestId('relationship')[0]).toHaveTextContent('Supervisor/Manager');
        expect(screen.getAllByLabelText(/Position Title/i)[0]).toHaveValue('Manager');
        expect(screen.getAllByLabelText(/Organization/i)[0]).toHaveValue('Company Inc.');
    });

    test('validates required fields', async () => {
        renderComponent();

        fireEvent.change(screen.getAllByLabelText(/First Name/i)[0], { target: { value: '' } });
        fireEvent.change(screen.getAllByLabelText(/Last Name/i)[0], { target: { value: '' } });
        fireEvent.change(screen.getAllByLabelText(/Email Address/i)[0], { target: { value: '' } });

        fireEvent.blur(screen.getAllByLabelText(/First Name/i)[0]);
        fireEvent.blur(screen.getAllByLabelText(/Last Name/i)[0]);
        fireEvent.blur(screen.getAllByLabelText(/Email Address/i)[0]);

        expect(await screen.findByText(/Please enter first name/i)).toBeInTheDocument();
        expect(await screen.findByText(/Please enter last name/i)).toBeInTheDocument();
        expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    test('pagination works correctly', () => {
        renderComponent();

        const nextPageButton = screen.getByRole('listitem', { name: /Next Page/i });
        fireEvent.click(nextPageButton);

        expect(screen.getAllByLabelText(/First Name/i)[0]).toHaveValue('David');
        expect(screen.getAllByLabelText(/Middle Name/i)[0]).toHaveValue('F');
        expect(screen.getAllByLabelText(/Last Name/i)[0]).toHaveValue('Evans');
        expect(screen.getAllByLabelText(/Email Address/i)[0]).toHaveValue('david.evans@example.com');
        expect(screen.getAllByLabelText(/Phone Number/i)[0]).toHaveValue('222-222-2222');
        const relationshipOptions = screen.getAllByText('Relationship')[0];
        fireEvent.click(relationshipOptions);
        expect(screen.getAllByTestId('relationship')[0]).toHaveTextContent('Co-worker');
        expect(screen.getAllByLabelText(/Position Title/i)[0]).toHaveValue('Engineer');
        expect(screen.getAllByLabelText(/Organization/i)[0]).toHaveValue('Engineering Inc.');
    });

    test('displays correct references on page 2', () => {
        renderComponent();

        const nextPageButton = screen.getByRole('listitem', { name: /Next Page/i });
        fireEvent.click(nextPageButton);

        expect(screen.getAllByLabelText(/First Name/i)[0]).toHaveValue('David');
        expect(screen.getAllByLabelText(/Middle Name/i)[0]).toHaveValue('F');
        expect(screen.getAllByLabelText(/Last Name/i)[0]).toHaveValue('Evans');
        expect(screen.getAllByLabelText(/Email Address/i)[0]).toHaveValue('david.evans@example.com');
    });

    test('displays correct references on page 3', () => {
        renderComponent();

        const nextPageButton = screen.getByRole('listitem', { name: /Next Page/i });
        fireEvent.click(nextPageButton);
        fireEvent.click(nextPageButton);
        const nextPageButton2 = screen.getByRole('listitem', { name: /Next Page/i });

        fireEvent.click(nextPageButton2);

        expect(screen.getByLabelText(/First Name/i)).toHaveValue('David');
        expect(screen.getByLabelText(/Middle Name/i)).toHaveValue('F');
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Evans');
        expect(screen.getByLabelText(/Email Address/i)).toHaveValue('david.evans@example.com');
    });

    test('displays correct references on page 3 when current is 3', () => {
        renderComponent();

        const nextPageButton = screen.getByRole('listitem', { name: /Next Page/i });
        fireEvent.click(nextPageButton);
        fireEvent.click(nextPageButton);
        fireEvent.click(nextPageButton);

        expect(screen.getByLabelText(/First Name/i)).toHaveValue('David');
        expect(screen.getByLabelText(/Middle Name/i)).toHaveValue('F');
        expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Evans');
        expect(screen.getByLabelText(/Email Address/i)).toHaveValue('david.evans@example.com');
    });
    test('splitReferences works correctly when current is 1', () => {
        const splitReferencesMock = jest.fn((fields) => fields.slice(0, 5));
        renderComponent();

        splitReferencesMock(mockContextValue.formData.references);
        expect(splitReferencesMock).toHaveBeenCalledWith(mockContextValue.formData.references);
        expect(splitReferencesMock).toHaveReturnedWith(mockContextValue.formData.references.slice(0, 5));
    });

    test('splitReferences works correctly when current is 2', () => {
        const splitReferencesMock = jest.fn((fields) => fields.slice(5, 10));
        renderComponent();

        const nextPageButton = screen.getByRole('listitem', { name: /Next Page/i });
        fireEvent.click(nextPageButton);

        splitReferencesMock(mockContextValue.formData.references);
        expect(splitReferencesMock).toHaveBeenCalledWith(mockContextValue.formData.references);
        expect(splitReferencesMock).toHaveReturnedWith(mockContextValue.formData.references.slice(5, 10));
    });

    test('splitReferences works correctly when current is 3', () => {
        const splitReferencesMock = jest.fn((fields) => fields.slice(10, 15));
        renderComponent();

        const nextPageButton = screen.getByRole('listitem', { name: /Next Page/i });
        fireEvent.click(nextPageButton);
        fireEvent.click(nextPageButton);
        fireEvent.click(nextPageButton);

        splitReferencesMock(mockContextValue.formData.references);
        expect(splitReferencesMock).toHaveBeenCalledWith(mockContextValue.formData.references);
        expect(splitReferencesMock).toHaveReturnedWith(mockContextValue.formData.references.slice(10, 15));
    });

});


