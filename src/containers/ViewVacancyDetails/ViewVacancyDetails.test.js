import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ViewVacancyDetails from './ViewVacancyDetails';
import Header from './Header/Header';
import Divider from './Divider/Divider';
import useAuth from '../../hooks/useAuth';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
}));
jest.mock('../../hooks/useAuth', () => ({
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
        render(<Header />);

        // click the apply button

        // Apply.js functionality should appear
    });

    // Test case for handling error when checking if user has profile
});