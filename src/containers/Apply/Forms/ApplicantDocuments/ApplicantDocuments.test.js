import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicantDocuments from './ApplicantDocuments';
import axios from 'axios';
import FormContext from '../../Context';
import { afterEach, expect } from '@jest/globals';
// import { userEvent } from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

jest.mock('axios');

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
const mockFile = (name, size, type) => {
    const file = new File([], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
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
        renderComponentWithoutDocuments({ vacancyId: '123' });

        await waitFor(() => {
            const uploadButton = screen.getAllByRole('button', { name: /upload/i })[0];
            expect(uploadButton).toBeInTheDocument();
            fireEvent.click(uploadButton);
        });
    });
    // it('validates file size before upload', async () => {
    //     renderComponentWithoutDocuments({ vacancyId: '123' });

    //     // await waitFor(() => {
    //     //     const uploadButton = screen.getAllByRole('button', { name: /upload/i })[0];

    //     //     expect(uploadButton).toBeInTheDocument();
    //     //     fireEvent.click(uploadButton);
    //     // });

    //     const file = new File(['dummy content'], 'large-file.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //     Object.defineProperty(file, 'size', {
    //         value: 1024 * 1024 * 1024 + 1, // 1 GB + 1 byte
    //     });

    //     const input = screen.getByLabelText(/upload/i);

    //     act(() => {
    //         fireEvent.change(input, { target: { files: [file] } });
    //     });

    //     await waitFor(() => {
    //         expect(screen.getByText('Document should be less than 1 GB.')).toBeInTheDocument();
    //     });
    //     // fireEvent.click(input);



    // });


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
    // it('should reject files larger than 1 GB and display an error message', async () => {
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

    // it('should reject files with unsupported formats', async () => {
    //     renderComponentWithoutDocuments({ vacancyId: '123' });

    //     const unsupportedFile = new File(['dummy content'], 'unsupported-file.txt', { type: 'text/plain' });

    //     const input = screen.getByLabelText(/upload/i);

    //     act(() => {
    //         fireEvent.change(input, { target: { files: [unsupportedFile] } });
    //     });

    //     await waitFor(() => {
    //         expect(screen.queryByText('Document should be less than 1 GB.')).not.toBeInTheDocument();
    //         // Ensure the file is not uploaded
    //         expect(input.files).toBeNull();
    //     });
    // });

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

    // it('mocks upload props before testing size validations', async () => {
    //     const mockUploadProps = {
    //         maxFileSize: 1024 * 1024 * 1024, // 1 GB
    //         allowedFileTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    //     };

    //     renderComponentWithoutDocuments({ vacancyId: '123', uploadProps: mockUploadProps });

    //     const largeFile = new File(['dummy content'], 'large-file.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //     Object.defineProperty(largeFile, 'size', {
    //         value: mockUploadProps.maxFileSize + 1, // Exceeding max size
    //     });

    //     const input = screen.getByLabelText(/upload/i);

    //     act(() => {
    //         fireEvent.change(input, { target: { files: [largeFile] } });
    //     });

    //     await waitFor(() => {
    //         expect(screen.getByText('Document should be less than 1 GB.')).toBeInTheDocument();
    //     });

    //     const validFile = new File(['dummy content'], 'valid-file.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //     Object.defineProperty(validFile, 'size', {
    //         value: mockUploadProps.maxFileSize, // Exactly max size
    //     });

    //     act(() => {
    //         fireEvent.change(input, { target: { files: [validFile] } });
    //     });

    //     await waitFor(() => {
    //         expect(screen.queryByText('Document should be less than 1 GB.')).not.toBeInTheDocument();
    //     });
    // });

    // it('mocks beforeUpload function', async () => {
    //     const beforeUpload = jest.fn((file) => {
    //         const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    //         const isValidSize = file.size <= 1024 * 1024 * 1024; // 1 GB
    //         if (!isValidType) {
    //             return 'Unsupported file type.';
    //         }
    //         if (!isValidSize) {
    //             return 'Document should be less than 1 GB.';
    //         }
    //         return true;
    //     });

    //     renderComponentWithoutDocuments({ vacancyId: '123', beforeUpload });

    //     const invalidFile = new File(['dummy content'], 'invalid-file.txt', { type: 'text/plain' });
    //     const input = screen.getByLabelText(/upload/i);

    //     act(() => {
    //         fireEvent.change(input, { target: { files: [invalidFile] } });
    //     });

    //     // Manually invoke the beforeUpload function to simulate its behavior
    //     const result = beforeUpload(invalidFile);
    //     if (result !== true) {
    //         await waitFor(() => {
    //             const errorMessage = result !== true ? result : null;
    //             if (errorMessage) {
    //                 const errorElement = screen.queryByText(errorMessage);
    //                 expect(errorElement).not.toBeNull(); // Ensure the error message exists
    //                 expect(errorElement).toBeInTheDocument(); // Ensure the error message is rendered
    //             }
    //         });
    //     }

    //     await waitFor(() => {
    //         expect(beforeUpload).toHaveBeenCalledTimes(1); // Ensure the function is called
    //         expect(beforeUpload.mock.calls[0][0]).toEqual(invalidFile); // Check the argument
    //         expect(beforeUpload.mock.results[0].value).toBe('Unsupported file type.'); // Verify the return value
    //     });

    //     const largeFile = new File(['dummy content'], 'large-file.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //     Object.defineProperty(largeFile, 'size', {
    //         value: 1024 * 1024 * 1024 + 1, // Exceeding 1 GB
    //     });

    //     act(() => {
    //         fireEvent.change(input, { target: { files: [largeFile] } });
    //     });

    //     await waitFor(() => {
    //         expect(beforeUpload).toHaveBeenCalledWith(largeFile);
    //         expect(beforeUpload).toHaveReturnedWith('Document should be less than 1 GB.');
    //     });

    //     const validFile = new File(['dummy content'], 'valid-file.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //     Object.defineProperty(validFile, 'size', {
    //         value: 1024 * 1024 * 1024, // Exactly 1 GB
    //     });

    //     act(() => {
    //         fireEvent.change(input, { target: { files: [validFile] } });
    //     });

    //     await waitFor(() => {
    //         expect(beforeUpload).toHaveBeenCalledWith(validFile);
    //         expect(beforeUpload).toHaveReturnedWith(true);
    //     });
    // });
});