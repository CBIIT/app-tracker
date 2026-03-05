import { render, screen, waitFor, prettyDOM} from '@testing-library/react';
import Application from './Application';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

// Mock dependencies
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock('../../hooks/useAuth');

const mockAdminScoringWidget = jest.fn();
jest.mock('./AdminScoringWidget/AdminScoringWidget', () => (props) => {
    mockAdminScoringWidget(props);
    return <mock-AdminScoringWidget />
});

describe('Application component', () => {
  // Provide mock implementations
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        result: {
          basic_info: {
            vacancy: { value: 'vac1', label: 'Vacancy 1' },
            state: { value: 'CHAIR_TRIAGE' },
            tenant: { label: 'Tenant' },
            number_of_categories: { value: '1' },
            triage: { value: '' },
            triage_comments: { value: '' },
            chair_triage: { value: '' },
            chair_triage_comment: { value: '' },
            require_focus_area: { value: '0' },
            display_references: { value: '0' },
            sys_id: 'sysid1',
            first_name: 'John',
            middle_name: 'A',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            business_phone: '098-765-4321',
            highest_level_of_education: 'PhD',
            us_citizen: true,
            address: '123 Main St',
            address_2: 'Apt 4',
            city: 'Anytown',
            state_province: 'CA',
            zip_code: '12345',
            country: 'USA',
          },
          references: [],
          app_documents: [],
          individual_scoring: null,
          additional_documents: [],
        },
      },
    });
    axios.put.mockResolvedValue({ data: { result: { recused: false } } });
    axios.post.mockResolvedValue({});

    useParams.mockReturnValue({ sysId: 'app1' });
    useNavigate.mockReturnValue(jest.fn());

    useAuth.mockReturnValue({
      auth: {
        isUserLoggedIn: true,
        user: {
          isManager: true,
          isCommitteeMember: true,
          roles: [],
          hasApplications: false,
          uid: '123',
        },
        tenants: [
          {
            value: 'tenant value 1',
            label: 'tenant 1',
            roles: [
              'x_g_nci_app_tracke.committee_member',
            ],
            is_exec_sec: true,
            is_read_only_user: true,
            is_chair: true,
            is_hr: false,
            properties: [],
          },
        ],
      },
      currentTenant: 'tenant value 1',
    });
  });

  // Mock window.matchMedia
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function () { },
      removeListener: function () { }
    };
  };

  test('renders Application without crashing', async () => {
    render(<Application />);
    await waitFor(() => {
      expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
    });
  });


});




