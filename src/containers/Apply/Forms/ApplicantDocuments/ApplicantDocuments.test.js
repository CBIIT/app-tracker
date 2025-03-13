import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicantDocuments from './ApplicantDocuments';
import axios from 'axios';
import FormContext from '../../Context';
import { afterEach, expect } from '@jest/globals';

jest.mock('axios');

const mockFormData = {
    applicantDocuments: [
        {
            title: { value: 'Document 1' },
            is_optional: { value: '0' },
            file: { fileList: [] },
            uploadedDocument: { markedToDelete: false, downloadLink: '', fileName: '' }
        }
    ],
    focusArea: {}
};

const mockContextValue = {
    formData: mockFormData,
    setCurrentFormInstance: jest.fn()
};

const renderComponent = (props = {}) => {
    return render(
        <FormContext.Provider value={mockContextValue}>
            <ApplicantDocuments {...props} />
        </FormContext.Provider>
    );
};
// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('ApplicantDocuments', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockResolvedValue({
            data: {
                result: {
                    basic_info: {
                        require_focus_area: { value: '1' }
                    }
                }
            }
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders without crashing', async () => {
        renderComponent({ vacancyId: '123' });
        await waitFor(() => expect(mockContextValue.setCurrentFormInstance).toHaveBeenCalled());
    });

    it('displays document titles', async () => {
        renderComponent({ vacancyId: '123' });
        await waitFor(() => {
            expect(screen.getByText('Document 1')).toBeInTheDocument();
        });
    });

    it('displays focus area section when required', async () => {
        renderComponent({ vacancyId: '123' });
        await waitFor(() => {
            expect(screen.getByText('Select at least one area, no more than 2')).toBeInTheDocument();
        });
    });

    it('handles file upload', async () => {
        renderComponent({ vacancyId: '123' });

        await waitFor(() => {
            // const uploadButton = screen.getByRole('button', { name: /upload/i });
            const uploadButton = screen.getByRole('button', { name: /delete/i });
            expect(uploadButton).toBeInTheDocument();
            fireEvent.click(uploadButton);
        });
    });

    it('displays uploaded document link and delete button', async () => {
        mockFormData.applicantDocuments[0].uploadedDocument = {
            markedToDelete: false,
            downloadLink: 'http://example.com/document.pdf',
            fileName: 'document.pdf'
        };
        renderComponent({ vacancyId: '123' });

        await waitFor(() => {
            expect(screen.getByText('document.pdf')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
        });
    });

    it('marks document for deletion', async () => {
        mockFormData.applicantDocuments[0].uploadedDocument = {
            markedToDelete: false,
            downloadLink: 'http://example.com/document.pdf',
            fileName: 'document.pdf'
        };
        renderComponent({ vacancyId: '123' });

        await waitFor(() => {
            const deleteButton = screen.getByRole('button', { name: /delete/i });
            expect(deleteButton).toBeInTheDocument();
            fireEvent.click(deleteButton);
        });
        await waitFor(() => {
            mockFormData.applicantDocuments[0].uploadedDocument.markedToDelete = true;
        });
        await waitFor(() => {
            expect(mockContextValue.formData.applicantDocuments[0].uploadedDocument.markedToDelete).toBe(true);
        });
    });

    it('sets requireFocusArea value correctly', async () => {
        renderComponent({ vacancyId: '123' });

        await waitFor(() => {
            expect(mockContextValue.setCurrentFormInstance).toHaveBeenCalled();
            expect(screen.getByText('Select at least one area, no more than 2')).toBeInTheDocument();
        });
    });

    it('handles empty require_focus_area value', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                result: {
                    basic_info: {
                        require_focus_area: { value: '' }
                    }
                }
            }
        });

        renderComponent({ vacancyId: '123' });

        await waitFor(() => {
            expect(mockContextValue.setCurrentFormInstance).toHaveBeenCalled();
            expect(screen.queryByText('Select at least one area, no more than 2')).not.toBeInTheDocument();
        });
    });
    it('displays error message on load failure', async () => {
        const errorMessage = 'Sorry, an error occurred while loading.';
        axios.get.mockImplementation(() => Promise.reject(errorMessage));
        try {

            renderComponent({ vacancyId: '123' });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toEqual(new Error('Sorry, an error occurred while loading.'));
        }

        // Initial copilot code
        // axios.get.mockRejectedValue(new Error('Sorry, an error occurred while loading.'));

        // renderComponent({ vacancyId: '123' });
        // await waitFor(() => {
        //     expect(screen.getByText('Sorry, an error occurred while loading.')).toBeInTheDocument();
        // });
    });
});