window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import ApplicantList from './ApplicantList';
import ExportToExcel from '../Util/ExportToExcel';
import SearchContext from '../Util/SearchContext';
import { mockSearchContextValue, mockNonStadtmanAuth } from './ApplicantListMockData';
import { rtRender } from '../../test-utils';
import useAuth from '../../../hooks/useAuth';
import {
  GET_APPLICANT_LIST,
  GET_APPLICANT_FOCUS_AREA,
} from '../../../constants/ApiEndpoints';

jest.mock('axios');
jest.mock('../../../hooks/useAuth');
jest.mock('../Util/ExportToExcel', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('ApplicantList Excel export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue(mockNonStadtmanAuth);
  });

  test('clicking Export to Excel calls ExportToExcel with data and filename', async () => {
    const mockApplicants = [
      {
        sys_id: '1',
        applicant_name: 'Doe, John',
        applicant_email: 'john@example.com',
        submitted: '2025-01-01T12:00:00Z',
      },
    ];

    axios.get.mockImplementation((url) => {
      console.log('Axios call to:', url);

      if (url.includes(GET_APPLICANT_FOCUS_AREA)) {
        return Promise.resolve({
          data: {
            result: {
              focusAreaFilter: ['Cancer Biology', 'Immunology'],
            },
          },
        });
      }

      if (url.includes(GET_APPLICANT_LIST)) {
        return Promise.resolve({
          data: {
            result: {
              applicants: mockApplicants,
              totalCount: mockApplicants.length,
              pageSize: 10,
            },
          },
        });
      }

      return Promise.resolve({ data: {} });
    });

    const { useParams } = require('react-router-dom');
    useParams.mockReturnValue({ sysId: 'test-sysid' });

    rtRender(
      <SearchContext.Provider value={mockSearchContextValue}>
        <ApplicantList
          vacancyTitle={'Test Vacancy'}
          vacancyState={'triage'}
          vacancyTenant={'NCI'}
          referenceCollection={false}
          userRoles={[]}
          userCommitteeRole={''}
          reloadVacancy={jest.fn()}
        />
      </SearchContext.Provider>
    );

    // Wait for applicant data
    await screen.findByText(/Doe, John/i);

    // Wait longer for excel data to load
    let exportButton;
    await waitFor(() => {
      exportButton = screen.getByRole('button', { name: /export to excel/i });
      if (exportButton.disabled) {
        console.log('🔸 Button still disabled - axios.get call count:', axios.get.mock.calls.length);
        axios.get.mock.calls.forEach((call, idx) => {
          console.log(`  Call ${idx + 1}:`, call[0]);
        });
        throw new Error('Button disabled');
      }
    }, { timeout: 15000 });

    expect(exportButton).not.toBeDisabled();

    // Click the button
    fireEvent.click(exportButton);

    // Verify ExportToExcel was called
    await waitFor(() => {
      expect(ExportToExcel).toHaveBeenCalledTimes(1);
    });

    const [calledData, calledFilename] = ExportToExcel.mock.calls[0];
    expect(Array.isArray(calledData)).toBe(true);
    expect(calledData.length).toBeGreaterThan(0);
    expect(typeof calledFilename).toBe('string');
  });


});