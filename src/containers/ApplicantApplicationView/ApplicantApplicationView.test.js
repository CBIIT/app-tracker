import React, { useState as usestateMock } from 'react';
import { useParams, MemoryRouter } from 'react-router-dom';
import { APPLICANT_GET_APPLICATION } from '../../constants/ApiEndpoints';
import { VIEW_APPLICATION } from '../../constants/Routes';
import { mockResponse  } from './MockData';
import axios from 'axios';
import { render } from '@testing-library/react';

jest.mock('axios');
jest.mock('react', () => ({
	...jest.requireActual('react'),
	useState: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useParams: jest.fn(),
}));

describe('ApplicantApplicationView component', () => {
	let mockAppSysId;

	beforeEach(() => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: jest.fn().mockImplementation((query) => ({
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
		mockAppSysId = '123';
		useParams.mockReturnValue({ id: mockAppSysId });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should render ApplicantApplicationView component', async () => {

		render(
			<MemoryRouter initialEntries={[VIEW_APPLICATION]}>
			</MemoryRouter>
		);
		
		axios.get.mockImplementationOnce(() => Promise.resolve(mockResponse));
		const response = await axios.get(1, APPLICANT_GET_APPLICATION, {
			appSysId: mockAppSysId,
		});

		usestateMock.mockImplementationOnce(() => [mockResponse.data.result, setApplication]);
		expect(axios.get).toHaveBeenCalledTimes(1);

		expect(response).toEqual(mockResponse);
	});
});
