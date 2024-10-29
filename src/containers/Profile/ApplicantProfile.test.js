import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import ApplicantProfile from './ApplicantProfile';
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
	},
}));

describe('ApplicantProfile', () => {
    const mockUser = {
		hasProfile: true,
	};

    // Mock window.matchMedia
    beforeAll(() => {
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

	beforeEach(() => {
		useParams.mockReturnValue({ sysId: '123' });
		useAuth.mockReturnValue({ auth: { user: mockUser } });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

    it('successfully retrieves and displays applicant profile', async () => {
		axios.get.mockResolvedValueOnce({ data: { result: { exists: true } } });
		axios.get.mockResolvedValueOnce({
			data: {
				result: {
					response: {
                        basic_info: {
						    first_name: 'Luke',
						    last_name: 'Skywalker',
						    phone: '+11234567890',
                        }
					},
				},
			},
		});

		render(<ApplicantProfile />);

		await waitFor(() => {
			expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
			expect(screen.getByText(/basic information/i)).toBeInTheDocument();
		});
	});

    it('handles failed profile retrieval gracefully', async () => {
        axios.get.mockResolvedValueOnce({ data: { result: { exists: true } } });
        axios.get.mockRejectedValueOnce(new Error('Profile not found'));
      
        // Render your component
        const { getByText } = render(<ApplicantProfile />);
      
        // Wait for the component to update
        await waitFor(() => {
          expect(getByText('Sorry! There was an error loading your profile. Try refreshing the browser.')).toBeInTheDocument();
        });
    });

});