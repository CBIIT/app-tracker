import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Review from './Review';
import FormContext from '../../Context';
import { expect } from '@jest/globals';


// Mock window.matchMedia
beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));
});

const mockFormData = {
    basicInfo: {
        firstName: 'John',
        middleName: 'Doe',
        lastName: 'Smith',
        email: 'john.doe@example.com',
        phonePrefix: '+1',
        phone: '1234567890',
        businessPhonePrefix: '+1',
        businessPhone: '0987654321',
        highestLevelEducation: 'Bachelor',
        isUsCitizen: 1,
    },
    address: {
        address: '123 Main St',
        address2: 'Apt 4B',
        city: 'Anytown',
        stateProvince: 'CA',
        zip: '12345',
    },
    focusArea: ['Area 1', 'Area 2'],
    references: [
        {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            phoneNumber: '1112223333',
            relationship: 'Colleague',
            title: 'Manager',
            organization: 'Company Inc',
        },
    ],
    applicantDocuments: [
        {
            title: { value: 'Resume' },
            uploadedDocument: {
                fileName: 'resume.pdf',
                markedToDelete: false,
            },
            file: {
                fileList: [
                    { name: 'resume.pdf' },
                ],
            },
        },
    ],
};

const mockProps = {
    onEditButtonClick: jest.fn(),
};

describe('Review Component', () => {
    test('renders basic information section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        expect(screen.getByText('Basic Information')).toBeInTheDocument();
        expect(screen.getByText('First Name')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Middle Name')).toBeInTheDocument();
        expect(screen.getByText('Doe')).toBeInTheDocument();
        expect(screen.getByText('Last Name')).toBeInTheDocument();
        expect(screen.getByText('Smith')).toBeInTheDocument();
        expect(screen.getByText('Email Address')).toBeInTheDocument();
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });

    test('renders address section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        expect(screen.getByText('Address')).toBeInTheDocument();
        expect(screen.getByText('Address Line 1')).toBeInTheDocument();
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
        expect(screen.getByText('Address Line 2')).toBeInTheDocument();
        expect(screen.getByText('Apt 4B')).toBeInTheDocument();
        expect(screen.getByText('City')).toBeInTheDocument();
        expect(screen.getByText('Anytown')).toBeInTheDocument();
        expect(screen.getByText('State')).toBeInTheDocument();
        expect(screen.getByText('CA')).toBeInTheDocument();
        expect(screen.getByText('Post Code')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
    });

    test('renders focus area section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        expect(screen.getByText('Focus Area')).toBeInTheDocument();
        expect(screen.getByText('Area 1')).toBeInTheDocument();
        expect(screen.getByText('Area 2')).toBeInTheDocument();
    });

    test('renders references section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        expect(screen.getByText('References')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
        expect(screen.getByText('1112223333')).toBeInTheDocument();
        expect(screen.getByText('Colleague')).toBeInTheDocument();
        expect(screen.getByText('Manager')).toBeInTheDocument();
        expect(screen.getByText('Company Inc')).toBeInTheDocument();
    });

    test('renders application documents section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        expect(screen.getByText('Application Documents')).toBeInTheDocument();
        expect(screen.getByText('✓ Resume')).toBeInTheDocument();
        expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    });

    test('expect button for basic information section to be hidden', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );
        expect(screen.getByText('Basic Information').closest('.SectionHeader').querySelector('button')).not.toBeInTheDocument();
    });

    test('calls onEditButtonClick for address section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        expect(screen.getByText('Address').closest('.SectionHeader').querySelector('button')).not.toBeInTheDocument();
    });

    test('calls onEditButtonClick for focus area section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        fireEvent.click(screen.getByText('Focus Area').closest('.SectionHeader').querySelector('button'));
        expect(mockProps.onEditButtonClick).toHaveBeenCalledWith('applicantDocuments');
    });

    test('calls onEditButtonClick for references section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        fireEvent.click(screen.getByText('References').closest('.SectionHeader').querySelector('button'));
        expect(mockProps.onEditButtonClick).toHaveBeenCalledWith('references');
    });

    test('calls onEditButtonClick for application documents section', () => {
        render(
            <FormContext.Provider value={{ formData: mockFormData }}>
                <Review {...mockProps} />
            </FormContext.Provider>
        );

        fireEvent.click(screen.getByText('Application Documents').closest('.SectionHeader').querySelector('button'));
        expect(mockProps.onEditButtonClick).toHaveBeenCalledWith('applicantDocuments');
    });
});
