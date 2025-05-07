import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploadAndDisplay from './FileUploadAndDisplay';
import { expect } from '@jest/globals';
import axios from 'axios';
import { message, Modal } from 'antd';

jest.mock('axios');
jest.mock('antd', () => {
    const originalAntd = jest.requireActual('antd');
    return {
        ...originalAntd,
        message: {
            ...originalAntd.message,
            info: jest.fn(() => { }),
            success: jest.fn(),
            error: jest.fn(() => { }),
            destroy: jest.fn(),
        },
        Modal: {
            ...originalAntd.Modal,
            confirm: jest.fn(),
        },
    };
});

describe('FileUploadAndDisplay Component', () => {
    const defaultProps = {
        sysId: '123',
        url: '/upload',
        table: 'test_table',
        afterUploadSuccess: jest.fn(),
        uploadSuccessMessage: 'File uploaded successfully!',
        buttonText: 'Upload File',
        deleteConfirmTitle: 'Confirm Delete',
        deleteConfirmText: 'Are you sure you want to delete this file?',
        onDeleteSuccess: jest.fn(),
        deleteUrl: '/delete',
        deleteSuccessMessage: 'File deleted successfully!',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders upload button when no file is uploaded', () => {
        render(<FileUploadAndDisplay {...defaultProps} />);
        expect(screen.getByText(defaultProps.buttonText)).toBeInTheDocument();
    });

    it('renders file link and delete button when a file is uploaded', () => {
        const props = {
            ...defaultProps,
            downloadLink: '/file-download',
            fileName: 'test-file.txt',
        };
        render(<FileUploadAndDisplay {...props} />);
        expect(screen.getByText(props.fileName)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calls uploadFile when a file is uploaded', async () => {
        message.info = jest.fn();
        const file = new File(['test'], 'test-file.txt', { type: 'text/plain' });
        render(<FileUploadAndDisplay {...defaultProps} />);
        const uploadButton = screen.getByText(defaultProps.buttonText);

        fireEvent.click(uploadButton);
        const input = document.querySelector('input[type="file"]');
        fireEvent.change(input, { target: { files: [file] } });

        await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async actions

        expect(message.info).toHaveBeenCalledWith('Uploading...', 0);
    });

    it('handles successful file upload', async () => {
        message.success = jest.fn();
        axios.post.mockResolvedValueOnce({});
        const file = new File(['test'], 'test-file.txt', { type: 'text/plain' });
        render(<FileUploadAndDisplay {...defaultProps} />);
        const uploadButton = screen.getByText(defaultProps.buttonText);

        fireEvent.click(uploadButton);
        const input = document.querySelector('input[type="file"]');
        fireEvent.change(input, { target: { files: [file] } });

        await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async actions

        expect(message.success).toHaveBeenCalledWith(defaultProps.uploadSuccessMessage);
        expect(defaultProps.afterUploadSuccess).toHaveBeenCalled();
    });

    it('handles file upload error', async () => {
        message.error = jest.fn();
        axios.post.mockRejectedValueOnce(new Error('Upload failed'));
        const file = new File(['test'], 'test-file.txt', { type: 'text/plain' });
        render(<FileUploadAndDisplay {...defaultProps} />);
        const uploadButton = screen.getByText(defaultProps.buttonText);

        fireEvent.click(uploadButton);
        const input = document.querySelector('input[type="file"]');
        fireEvent.change(input, { target: { files: [file] } });

        await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async actions

        expect(message.error).toHaveBeenCalledWith(
            'Sorry, an error occurred while uploading.  Try reloading the page and uploading again.'
        );
    });

    it('calls onDeleteButtonClick when delete button is clicked', () => {
        Modal.confirm = jest.fn();
        const props = {
            ...defaultProps,
            downloadLink: '/file-download',
            fileName: 'test-file.txt',
        };
        render(<FileUploadAndDisplay {...props} />);
        const deleteButton = screen.getByRole('button');

        fireEvent.click(deleteButton);
        // Check if Modal.confirm was called'
        // Test failing with no calls being made to Modal.confirm
        expect(Modal.confirm).toHaveBeenCalledWith({
            title: props.deleteConfirmTitle,
            icon: expect.anything(),
            content: props.deleteConfirmText,
            onOk: expect.any(Function),
            onCancel: expect.any(Function),
        });
    });
});