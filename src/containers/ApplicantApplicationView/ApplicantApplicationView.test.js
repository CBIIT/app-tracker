import ApplicantApplicationView from './ApplicantApplicationView';
import React, { useState as usestateMock } from 'react';
import { useParams } from 'react-router-dom';
import { APPLICANT_GET_APPLICATION } from '../../constants/ApiEndpoints';
import { mockResponse, mockTransformedResponse, mockProps } from './MockData';
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
		mockAppSysId = '123';
		useParams.mockReturnValue({ id: mockAppSysId });
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should render ApplicantApplicationView component', async () => {
		render(<ApplicantApplicationView {...mockProps} />);

		axios.get.mockImplementationOnce(() => Promise.resolve(mockResponse));
		const response = await axios.get(1, APPLICANT_GET_APPLICATION, {appSysId: mockAppSysId});


        // usestateMock.mockImplementationOnce(application => [application, setApplication]);
		expect(axios.get).toHaveBeenCalledTimes(2);

		expect(response).toEqual(mockResponse);


	});
});
