import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import Header from './Header';
import useAuth from '../../../hooks/useAuth';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useHistory: jest.fn(),
}));
jest.mock('../../../hooks/useAuth', () => ({
    __esModule: true,
    default: jest.fn(), 
}));
jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    message: {
        error: jest.fn(),
    }
}));

describe('ViewVacancyDetails', () => {
    const mockUser = {
        hasProfile: true,
    };

    const mockProps = {
        closeDate: '',
        openDate: '2024-09-13',
        sysId: '456',
        title: 'Rolling Close Test Title',
        vacancyPOC: {
            email: 'vacancy.poc@email.com',
            name: 'Vacancy POC',
            value: '789',
        },
        vacancyState: 'rolling_close',
        vacancyStatus: 'open',
    };

    const mockAppliedAlreadyFalse = {
        userAlreadyApplied: false,
    };

    const mockAppliedAlreadyTrue = {
        userAlreadyApplied: true,
    };

    beforeEach(() => {
        useParams.mockReturnValue({ sysId: '123'});
        useAuth.mockReturnValue({ auth: { user: mockUser}});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('successfully clicks Apply button and checks for profile', async () => {
        // mock hasProfile to true mock call
        axios.get.mockResolvedValue({ data: { result: { exists: true }}});

        // render the header (apply button exists here)
        render(<Header { ...mockProps } />);

        // click the apply button

        // Apply.js functionality should appear
    });

    // Test case for handling error when checking if user has profile
});