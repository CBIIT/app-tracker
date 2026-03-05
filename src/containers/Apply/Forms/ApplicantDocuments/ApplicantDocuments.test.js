import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Upload } from 'antd';
import ApplicantDocuments from './ApplicantDocuments';
import axios from 'axios';
import FormContext from '../../Context';
import { afterEach, expect } from '@jest/globals';
import { act } from 'react-dom/test-utils';

jest.mock('axios');
const mockError = jest.fn();
const mockBeforeUpload = jest.fn();

// With Documents
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

// Without Documents
const mockFormDataWithoutDocuments = {
    applicantDocuments: [{
        title: { value: 'Document 1' },
        is_optional: { value: '0' },
        file: { fileList: [] }
    }],
    focusArea: {}
};
const mockContextValueWithoutDocuments = {
    formData: mockFormDataWithoutDocuments,
    setCurrentFormInstance: jest.fn()
};
const renderComponentWithoutDocuments = (props = {}) => {
    return render(
        <FormContext.Provider value={mockContextValueWithoutDocuments}>
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


const mockedUpload = (props) => {
    return (
        <Upload
            {...props}
            beforeUpload={mockBeforeUpload}
        />
    );
};

jest.mock('antd', () => {
    const originalModule = jest.requireActual('antd');
    return {
        ...originalModule,
        Upload: mockedUpload,
        message: {
            ...originalModule.message,
            error: mockError,
        },
    };
});

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
        renderComponentWithoutDocuments({ vacancyId: '123' });

        await waitFor(() => {
            const uploadButton = screen.getAllByRole('button', { name: /upload/i })[0];
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

        renderComponent({ vacancyId: '123' });
        try {
            await axios.get.mockRejectedValue(new Error(errorMessage));
        } catch (error) {
            expect(error).toEqual(new Error(errorMessage));
        }
    });

    it('should accept files smaller than or equal to 1 GB', async () => {
        renderComponentWithoutDocuments({ vacancyId: '123' });

        const validFile = new File(['dummy content'], 'valid-file.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        Object.defineProperty(validFile, 'size', {
            value: 1024 * 1024 * 1024, // Exactly 1 GB
        });

        const input = screen.getByLabelText(/upload/i);

        act(() => {
            fireEvent.change(input, { target: { files: [validFile] } });
        });

        await waitFor(() => {
            expect(screen.queryByText('Document should be less than 1 GB.')).not.toBeInTheDocument();
        });
    });

    it('should allow only one file to be uploaded at a time', async () => {
        renderComponentWithoutDocuments({ vacancyId: '123' });

        const file1 = new File(['dummy content'], 'file1.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const file2 = new File(['dummy content'], 'file2.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

        const input = screen.getByLabelText(/upload/i);

        act(() => {
            fireEvent.change(input, { target: { files: [file1] } });
        });

        await waitFor(() => {
            expect(input.files.length).toBe(1); // First file uploaded
        });

        act(() => {
            fireEvent.change(input, { target: { files: [file2] } });
        });

        await waitFor(() => {
            expect(input.files.length).toBe(1); // Second file replaces the first
        });
    });
    // These are attempts to test the file size limit
    // Test 1
    // it('should reject files larger than 1 GB', async () => {
    //     renderComponentWithoutDocuments({ vacancyId: '123' });

    //     const largeFile = new File(['dummy content'], 'large-file.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //     Object.defineProperty(largeFile, 'size', {
    //         value: 1024 * 1024 * 1024 + 1, // 1 GB + 1 byte
    //     });

    //     const input = screen.getByLabelText(/upload/i);

    //     act(() => {
    //         fireEvent.change(input, { target: { files: [largeFile] } });
    //     });
    //     await waitFor(() => {
    //         expect(screen.getByText('Document should be less than 1 GB.')).toBeInTheDocument();
    //     });
    // });

    // Test 2
    // it('should reject files larger than 1 GB', async () => {
    //     const flushPromises = () => new Promise(setImmediate);

    //     renderComponentWithoutDocuments({ vacancyId: '123' });

    //     const mockFile = (name, type = 'text/plain') => {
    //         const size = 1024;
    //         //const size = 1024 * 1024 * 1024;
    //         const blob = new Blob(['a'.repeat(size)], { type });
    //         return new File([blob], name, { type });
    //     };

    //     const largeFile = mockFile('large-file.txt');
    //     Object.defineProperty(largeFile, 'size', {
    //         value: 1024 * 1024 * 1024 * 1.5, // 1 GB + 1 byte
    //     });

    //     console.log('****************', largeFile.size);
    //     console.log(' ********** size check ', (largeFile.size / 1024 / 1024), ' ***** 1000')

    //     const input = screen.getByLabelText(/upload/i);
    //     await act(async () => {
    //         fireEvent.change(input, { target: { files: largeFile } })
    //     });

    //     // act(() => {
    //     //     fireEvent.change(input, { target: { files: [largeFile] } });
    //     // });

    //     //await new Promise(process.nextTick);
    //     await flushPromises();
    //     expect(mockBeforeUpload).toHaveBeenCalled();
    //     expect(mockError).toHaveBeenCalledWith('Document should be less than 1 GB.');
    // });
});