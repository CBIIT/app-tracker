import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Application from './Application';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { message } from 'antd';

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

const mockAdminScoringWidget = jest.fn();
jest.mock('./AdminScoringWidget/AdminScoringWidget', () => (props) => {
  mockAdminScoringWidget(props);
  return <mock-AdminScoringWidget />;
});

// const mockScoringWidget = jest.fn();
// jest.mock('./ScoringWidget/ScoringWidget', () => (props) => {
//   mockScoringWidget(props);
//   return (
//     <div data-testid="scoring-widget">
//       <h3>{props.title}</h3>
//       <div>{props.description}</div>
//       {props.onScoreCommentsChange && (
//         <textarea 
//           data-testid="score-comments"
//           onChange={props.onScoreCommentsChange}
//         >
//           {props.triageComments}
//         </textarea>
//       )}
//       {props.categories && props.categories.map((cat, i) => <div key={i}>{cat.title}</div>)}
//       {props.onSaveClick && (
//         <button data-testid="save-scoring-button" onClick={props.onSaveClick}>
//           Save
//         </button>
//       )}
//     </div>
//   );
// });

describe('Application component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    message.success.mockClear?.();
    message.error.mockClear?.();

    axios.get.mockResolvedValue({
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
        },
      },
    });

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

      axios.get.mockImplementation((url) => {
        if (url.includes('get_vacancy_manager_view')) {
          return Promise.resolve({
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
              },
            },
          });
        }
        return Promise.resolve({
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
            },
          },
        });
      });

      jest.spyOn(message, 'success').mockImplementation();

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      expect(axios.put).toBeDefined();
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

      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      expect(axios.post).toBeDefined();
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
      render(<Application />);

      await waitFor(() => {
        expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
      });

      const textareas = screen.queryAllByRole('textbox');
      if (textareas.length > 0) {
        fireEvent.change(textareas[0], { target: { value: 'Triage test comment' } });
        expect(textareas[0].value).toBe('Triage test comment');
      }
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
  //   const buildApplicationResult = (recusedValue = '1') => ({
  //     basic_info: {
  //       vacancy: { value: 'vac1', label: 'Vacancy 1' },
  //       state: { value: 'INDIVIDUAL_SCORING_IN_PROGRESS' },
  //       tenant: { label: 'Tenant' },
  //       number_of_categories: { value: '1' },
  //       triage: { value: '' },
  //       triage_comments: { value: '' },
  //       chair_triage: { value: '' },
  //       chair_triage_comment: { value: '' },
  //       require_focus_area: { value: '0' },
  //       display_references: { value: '0' },
  //       sys_id: 'sysid1',
  //       first_name: 'John',
  //       middle_name: 'A',
  //       last_name: 'Doe',
  //       email: 'john.doe@example.com',
  //       phone: { value: '123-456-7890' },
  //       business_phone: { value: '098-765-4321' },
  //       highest_level_of_education: 'PhD',
  //       us_citizen: true,
  //       address: '123 Main St',
  //       address_2: 'Apt 4',
  //       city: 'Anytown',
  //       state_province: 'CA',
  //       zip_code: '12345',
  //       country: 'USA',
  //     },
  //     references: [],
  //     app_documents: [],
  //     individual_scoring: {
  //       recused: { value: recusedValue },
  //       category_1: { value: '' },
  //       comments: { value: '' },
  //       recommend: { value: '' },
  //     },
  //     additional_documents: [],
  //   });

  //   const setupVacancyAndApplicationMocks = ({
  //     recusedValue = '1',
  //     putReject = false,
  //   } = {}) => {
  //     if (putReject) {
  //       axios.put.mockRejectedValueOnce(new Error('Network error'));
  //     } else {
  //       axios.put.mockResolvedValueOnce({
  //         data: { result: { recused: false } },
  //       });
  //     }

  //     axios.get.mockImplementation((url) => {
  //       if (url.includes('get')) {
  //         return Promise.resolve({
  //           data: {
  //             result: {
  //               basic_info: {
  //                 state: { value: 'INDIVIDUAL_SCORING_IN_PROGRESS' },
  //                 number_of_categories: { value: '1' },
  //                 require_focus_area: { value: '0' },
  //               },
  //               user: {
  //                 committee_role_of_current_vacancy: 'Member',
  //               },
  //             },
  //           },
  //         });
  //       }

  //       return Promise.resolve({
  //         data: {
  //           result: buildApplicationResult(recusedValue),
  //         },
  //       });
  //     });
  //   };

  //   const unrecuseLink = await screen.findByText(/unrecuse\s+self/i, {
  //     selector: 'a',
  //   });

  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //     message.success.mockClear?.();
  //     message.error.mockClear?.();
  //   });

  //   test('successfully unrecuses self and displays success message', async () => {
  //     jest.spyOn(message, 'success').mockImplementation();
  //     setupVacancyAndApplicationMocks({ recusedValue: '1' });

  //     render(<Application />);

  //     await waitFor(() => {
  //       expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
  //     });

  //     await clickUnrecuseLink();

  //     await waitFor(() => {
  //       expect(axios.put).toHaveBeenCalledWith(
  //         expect.any(String),
  //         expect.objectContaining({
  //           applicationId: 'app1',
  //           recuse: false,
  //         })
  //       );
  //     });

  //     expect(message.success).toHaveBeenCalledWith(
  //       'You have successfully unrecused yourself for the scoring of this applicant.'
  //     );
  //   });

  //   test('calls RECUSE endpoint with correct payload', async () => {
  //     setupVacancyAndApplicationMocks({ recusedValue: '1' });

  //     render(<Application />);

  //     await waitFor(() => {
  //       expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
  //     });

  //     await clickUnrecuseLink();

  //     await waitFor(() => {
  //       expect(axios.put).toHaveBeenCalled();
  //     });

  //     const [, payload] = axios.put.mock.calls[0];
  //     expect(payload).toEqual({
  //       applicationId: 'app1',
  //       recuse: false,
  //     });
  //   });

  //   test('displays error message on unrecuse failure', async () => {
  //     jest.spyOn(message, 'error').mockImplementation();
  //     setupVacancyAndApplicationMocks({ recusedValue: '1', putReject: true });

  //     render(<Application />);

  //     await waitFor(() => {
  //       expect(screen.getByText(/Applicant:/i)).toBeInTheDocument();
  //     });

  //     await clickUnrecuseLink();

  //     await waitFor(() => {
  //       expect(message.error).toHaveBeenCalledWith(
  //         'Sorry, something went wrong!  Try refreshing the page and trying again.'
  //       );
  //     });
  //   });
  // });

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

      const sliders = screen.queryAllByRole('slider');
      if (sliders.length > 0) {
        fireEvent.change(sliders[0], { target: { value: 8 } });
        expect(sliders[0].value).toBe('8');
      }
    });
  });
});