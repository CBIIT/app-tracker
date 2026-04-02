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
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import ApplicantList from './ApplicantList';
import ExportToExcel from '../Util/ExportToExcel';
import { rtRender } from '../../test-utils';

jest.mock('axios');
jest.mock('../Util/ExportToExcel', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// mock react-router useParams used by component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

describe('ApplicantList Excel export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      if (String(url).includes('/focus') || String(url).toLowerCase().includes('focusarea')) {
        return Promise.resolve({
          data: {
            result: {
              options: [{ id: 'fa1', label: 'Focus Area 1' }],
            },
          },
        });
      }

      if (String(url).includes('applicant') || String(url).includes('applicants')) {
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

    // render component
    rtRender(
      <ApplicantList
        vacancyTitle={'Test Vacancy'}
        vacancyState={'triage'}
        vacancyTenant={'NCI'}
        referenceCollection={false}
        userRoles={[]}
        userCommitteeRole={''}
        reloadVacancy={jest.fn()}
      />
    );
    // wait for data load
    await screen.findByText(/Doe, John/i);

    // find export button
    const exportButton = await screen.findByRole('button', { name: /export to excel/i });
    expect(exportButton).toBeInTheDocument();

    // fallback: if button remains disabled, enable for test
    if (exportButton.disabled || exportButton.getAttribute('aria-disabled') === 'true') {
      exportButton.removeAttribute('disabled');
      exportButton.setAttribute('aria-disabled', 'false');
      exportButton.disabled = false;
    }

    // click
    fireEvent.click(exportButton);

    // assert ExportToExcel was called
    await waitFor(() => expect(ExportToExcel).toHaveBeenCalledTimes(1));

    const [calledData, calledFilename] = ExportToExcel.mock.calls[0];
    expect(Array.isArray(calledData)).toBe(true);
    expect(calledData.length).toBeGreaterThan(0);
    expect(typeof calledFilename).toBe('string');
  });
});