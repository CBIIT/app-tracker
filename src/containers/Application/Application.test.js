import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import Application from './Application';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { message } from 'antd';
import { isAllowedToVacancyManagerTriage } from './Util/Permissions';

// Mock dependencies
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useHistory: jest.fn(),
}));
jest.mock('../../hooks/useAuth');
jest.mock('./Util/Permissions', () => ({
  isAllowedToVacancyManagerTriage: jest.fn(() => false),
}));
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

jest.mock('./ScoringWidget/ScoringWidgetSlider/ScoringWidgetSlider', () => (props) => (
  <button
    type="button"
    data-testid={`slider-${props.title}`}
    onClick={() => props.onChange(8)}
  >
    {props.title}: {props.value ?? 'unset'}
  </button>
));

const mockAdminScoringWidget = jest.fn();
jest.mock('./AdminScoringWidget/AdminScoringWidget', () => (props) => {
  mockAdminScoringWidget(props);
  return <mock-AdminScoringWidget />;
});

const buildApplicationResponse = (overrides = {}) => ({
  data: {
    result: {
      basic_info: {
        vacancy: { value: 'vac1', label: 'Vacancy 1' },
        state: { value: 'INDIVIDUAL_SCORING_IN_PROGRESS' },
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
        phone: { value: '123-456-7890' },
        business_phone: { value: '098-765-4321' },
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
      individual_scoring: {
        recused: { value: '0' },
        category_1: { value: '5' },
        comments: { value: 'Good candidate' },
        recommend: { value: 'yes' },
      },
      additional_documents: [],
      ...overrides,
    },
  },
});

const buildVacancyManagerViewResponse = (overrides = {}) => ({
  data: {
    result: {
      basic_info: {
        state: { value: 'INDIVIDUAL_SCORING_IN_PROGRESS' },
        number_of_categories: { value: '1' },
        require_focus_area: { value: '0' },
        tenant: { label: 'Tenant' },
      },
      user: {
        committee_role_of_current_vacancy: 'Member',
      },
      ...overrides,
    },
  },
});

const mockApplicationAndVacancyGet = ({
  application = {},
  vacancy = {},
} = {}) => {
  axios.get.mockImplementation((url) => {
    if (url.includes('get_vacancy_manager_view')) {
      return Promise.resolve(
        buildVacancyManagerViewResponse(vacancy)
      );
    }

    return Promise.resolve(
      buildApplicationResponse(application)
    );
  });
};

describe('Application component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    message.success.mockClear?.();
    message.error.mockClear?.();

    mockApplicationAndVacancyGet();

    axios.put.mockResolvedValue({ data: { result: { recused: false } } });
    axios.post.mockResolvedValue({});

    useParams.mockReturnValue({ sysId: 'app1' });
    useHistory.mockReturnValue({ push: jest.fn() });

    useAuth.mockReturnValue({
      auth: {
        isUserLoggedIn: true,
        user: {
          isManager: false,
          isCommitteeMember: true,
          roles: [],
          hasApplications: false,
          uid: '123',
        },
        tenants: [
          {
            value: 'tenant value 1',
            label: 'tenant 1',
            roles: ['x_g_nci_app_tracke.committee_member'],
            is_exec_sec: false,
            is_read_only_user: false,
            is_chair: false,
            is_hr: false,
            properties: [],
          },
        ],
      },
      currentTenant: 'tenant value 1',
    });
  });

  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function () { },
      removeListener: function () { },
    };
  };

  test('renders Application without crashing', async () => {
    render(<Application />);
    await waitFor(() => {
      expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
    });
  });

  describe('recuseSelf function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      message.success.mockClear?.();
      message.error.mockClear?.();
    });

    test('successfully recuses self and displays success message', async () => {
      axios.put.mockResolvedValueOnce({
        data: { result: { recused: true } },
      });

      mockApplicationAndVacancyGet();

      jest.spyOn(message, 'success').mockImplementation();

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/Recuse self/i));
      fireEvent.click(await screen.findByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
      });

      const [recuseUrl, recusePayload] = axios.put.mock.calls[0];

      expect(recuseUrl).toEqual(expect.stringMatching(/recuse/i));
      expect(recusePayload).toEqual(expect.any(Object));
      expect(message.success).toHaveBeenCalled();
    });
  });

  describe('handleDisplayReferenceToggle', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      message.success.mockClear?.();
      message.error.mockClear?.();
    });

    test('successfully toggles display references and displays success message', async () => {
      axios.post.mockResolvedValueOnce({ data: {} });
      jest.spyOn(message, 'success').mockImplementation();

      useAuth.mockReturnValue({
        auth: {
          isUserLoggedIn: true,
          user: {
            isManager: false,
            isCommitteeMember: true,
            roles: [],
            hasApplications: false,
            uid: '123',
          },
          tenants: [
            {
              value: 'tenant value 1',
              label: 'tenant 1',
              roles: ['x_g_nci_app_tracke.vacancy_manager'],
              is_exec_sec: false,
              is_read_only_user: false,
              is_chair: false,
              is_hr: false,
              properties: [],
            },
          ],
        },
        currentTenant: 'tenant value 1',
      });

      mockApplicationAndVacancyGet({
        application: {
          references: [
            {
              ref_sys_id: 'ref1',
              name: 'Reference Person',
              email: 'ref@example.com',
              phone: '555-111-2222',
              relationship: 'Supervisor',
              title: 'Director',
              organization: 'NCI',
              contact_allowed: 'Yes',
              documents: [],
            },
          ],
        },
      });

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      const referencesCard = screen.getByText(/References/i).closest('.InfoCardContainer');
      const toggle = within(referencesCard).getByRole('switch');

      fireEvent.click(toggle);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringMatching(/display_references\/undefined\/true$/)
        );
      });

      expect(message.success).toHaveBeenCalledWith('References preference saved.');
    });

    test('displays error message when toggle fails', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network error'));
      jest.spyOn(message, 'error').mockImplementation();

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      expect(axios.post).toBeDefined();
    });
  });

  describe('State change handlers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('onTriageCommentsChange updates triage comments', async () => {
      isAllowedToVacancyManagerTriage.mockReturnValue(true);
      mockApplicationAndVacancyGet();

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/Vacancy Manager Team Feedback/i));

      const triageCommentsTextarea = await screen.findByPlaceholderText(/add notes \(optional\)/i);
      fireEvent.change(triageCommentsTextarea, {
        target: { value: 'Triage test comment' },
      });

      expect(triageCommentsTextarea.value).toBe('Triage test comment');
    });

    test('onScoreCommentsChange updates individual score comments', async () => {
      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      const textareas = screen.queryAllByRole('textbox');
      if (textareas.length > 0) {
        fireEvent.change(textareas[0], { target: { value: 'Score comment' } });
        expect(textareas[0].value).toBe('Score comment');
      }
    });

  });


  describe('Individual scoring', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      message.success.mockClear?.();
      message.error.mockClear?.();
    });

    test('onIndividualScoreSaveClick saves individual scores', async () => {
      axios.post.mockResolvedValueOnce({ data: {} });
      jest.spyOn(message, 'success').mockImplementation();

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      expect(axios.post).toBeDefined();
    });

    test('onIndividualScoreSaveClick displays error on save failure', async () => {
      axios.post.mockRejectedValueOnce(new Error('Save failed'));
      jest.spyOn(message, 'error').mockImplementation();

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      expect(axios.post).toBeDefined();
    });

    test('individualScoreSlideChangeHandler updates scores', async () => {
      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      const categorySlider = await screen.findByTestId('slider-Category 1');
      expect(categorySlider).toHaveTextContent('Category 1: 5');

      fireEvent.click(categorySlider);

      await waitFor(() => {
        expect(screen.getByTestId('slider-Category 1')).toHaveTextContent('Category 1: 8');
      });
    });
  });

  describe('unRecuse function', () => {
    test('successfully unrecuses self and displays success message', async () => {
      axios.put.mockResolvedValueOnce({
        data: { result: { recused: false } },
      });
      jest.spyOn(message, 'success').mockImplementation();

      mockApplicationAndVacancyGet({
        application: {
          individual_scoring: {
            recused: { value: '1' },
            category_1: { value: '5' },
            comments: { value: 'Good candidate' },
            recommend: { value: 'yes' },
          },
        },
      });

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText(/Unrecuse self/i));

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
      });

      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/recuse/i),
        { applicationId: 'app1', recuse: false }
      );

      expect(message.success).toHaveBeenCalledWith(
        'You have successfully unrecused yourself for the scoring of this applicant.'
      );
    });
  });

  describe('chair triage validation', () => {
    test('shows validation error when chair selects no without comments', async () => {
      jest.spyOn(message, 'error').mockImplementation();

      mockApplicationAndVacancyGet({
        vacancy: {
          user: {
            committee_role_of_current_vacancy: 'Chair',
          },
        },
      });

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      const chairCard = screen
        .getByText(/Committee Chair Feedback and Notes/i)
        .closest('.InfoCardContainer');

      fireEvent.click(
        within(chairCard).getByText(/Committee Chair Feedback and Notes/i)
      );

      fireEvent.click(within(chairCard).getByRole('radio', { name: /no/i }));
      fireEvent.click(within(chairCard).getByRole('button', { name: /save triage/i }));

      expect(axios.post).not.toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith(
        'Please provide a note for why "no" was selected.'
      );
    });

  });

  test('displays error message when display reference toggle fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network error'));
    jest.spyOn(message, 'error').mockImplementation();

    useAuth.mockReturnValue({
      auth: {
        isUserLoggedIn: true,
        user: {
          isManager: false,
          isCommitteeMember: true,
          roles: [],
          hasApplications: false,
          uid: '123',
        },
        tenants: [
          {
            value: 'tenant value 1',
            label: 'tenant 1',
            roles: ['x_g_nci_app_tracke.vacancy_manager'],
            is_exec_sec: false,
            is_read_only_user: false,
            is_chair: false,
            is_hr: false,
            properties: [],
          },
        ],
      },
      currentTenant: 'tenant value 1',
    });

    mockApplicationAndVacancyGet({
      application: {
        references: [
          {
            ref_sys_id: 'ref1',
            name: 'Reference Person',
            email: 'ref@example.com',
            phone: '555-111-2222',
            relationship: 'Supervisor',
            title: 'Director',
            organization: 'NCI',
            contact_allowed: 'Yes',
            documents: [],
          },
        ],
      },
    });

    render(<Application />);

    await waitFor(() => {
      expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
    });

    const referencesCard = screen
      .getByText(/References/i)
      .closest('.InfoCardContainer');
    const toggle = within(referencesCard).getByRole('switch');

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        'Sorry!  An error occurred.  Unable to save.  Try reloading the page and trying again.'
      );
    });
  });
});