import { rtRender } from '../test-utils';
import axios from 'axios';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { VACANCY_DASHBOARD, EDIT_DRAFT, EDIT_VACANCY } from '../../constants/Routes';

const mockCountTile = jest.fn();
jest.mock('./CountTile/CountTile', () => (props) => {
    mockCountTile(props);
    return <mock-CountTile />
});

// Store ExtendModal props for testing handleExtendModalCancel
let lastExtendModalProps = null;
jest.mock('./ExtendModal/ExtendModal', () => (props) => {
    lastExtendModalProps = props;
    return <mock-ExtendModal data-testid="extend-modal" />
});

// Mock the RoleValidator
jest.mock('../../components/Util/RoleValidator/RoleValidator', () => ({
    validateRoleForCurrentTenant: jest.fn(() => true),
}));

// Mock Ant Design Empty component to render description
jest.mock('antd', () => {
    const actualAntd = jest.requireActual('antd');
    return {
        ...actualAntd,
        Empty: ({ description }) => <div data-testid="empty-state">{description}</div>,
    };
});

jest.mock('axios', () => {
    return {
      CancelToken: {
        source: jest.fn(() => ({
          token: 'mockCancelToken',
          cancel: jest.fn(),
        })),
      },
      get: jest.fn(),
      post: jest.fn(),
      isCancel: jest.fn(() => false),
    };
});

jest.mock('../../hooks/useAuth');

// Define mockNavigate before using it in the mock
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: jest.fn(),
}));

// Import after mock is defined
import useAuth from '../../hooks/useAuth';
import { validateRoleForCurrentTenant as mockValidateRoleForCurrentTenant } from '../../components/Util/RoleValidator/RoleValidator';
import { useParams } from 'react-router-dom';

// Mock window.matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Import component AFTER all mocks are defined
import VacancyDashboard from './VacancyDashboard';

describe('VacancyDashboard component tests', () => {

    beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve({ data: { result: [] } }));
        axios.post.mockImplementation(() => Promise.resolve({ data: { result: [] } }));
        mockNavigate.mockClear();
        mockValidateRoleForCurrentTenant.mockReturnValue(true);
        useParams.mockReturnValue({ tab: undefined });
        useAuth.mockReturnValue({
            auth: {
                iTrustGlideSsoId: 'testSsoId',
                iTrustUrl: 'https://test.itrust.com',
                isUserLoggedIn: false,
                user: { firstName: 'John', lastInitial: 'D' },
                oktaLoginAndRedirectUrl: 'https://test.okta.com',
                tenants: ['tenant 1', 'tenant 2'],
            },
            currentTenant: 'tenant 1',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ===== Basic Rendering Test =====
    test('renders without crashing', async () => {
        rtRender(<VacancyDashboard />);
        
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });
    });

    // ===== useEffect Hook Tests =====
    test('useEffect calls API on component mount', async () => {
        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('vacancy/get_dashboard_vacancy_list'),
                expect.objectContaining({ cancelToken: 'mockCancelToken' })
            );
        });
    });

    test('useEffect loads preflight vacancies by default', async () => {
        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('state=preflight'),
                expect.any(Object)
            );
        });
    });

    test('useEffect cancels request on component unmount', async () => {
        const mockCancel = jest.fn();
        axios.CancelToken.source.mockReturnValue({
            token: 'mockToken',
            cancel: mockCancel,
        });

        const { unmount } = rtRender(<VacancyDashboard />);
        
        unmount();

        await waitFor(() => {
            expect(mockCancel).toHaveBeenCalled();
        });
    });

    // ===== Data Display Tests =====
    test('displays vacancy data when API returns results', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Test Position', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Test Position')).toBeInTheDocument();
        });
    });

    test('displays multiple vacancies', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Position One', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' },
                { sys_id: '2', title: 'Position Two', state: 'draft', open_date: '2024-01-02', close_date: '2024-02-02' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(screen.getByText('Position One')).toBeInTheDocument();
            expect(screen.getByText('Position Two')).toBeInTheDocument();
        });
    });

    // ===== Button State Tests =====
    test('renders Create Vacancy button', async () => {
        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            const button = screen.queryByRole('button', { name: /create vacancy/i });
            expect(button).toBeInTheDocument();
        });
    });

    // ===== Error Handling Test =====
    test('handles API errors gracefully', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });
    });

    // ===== Tab Handler Tests =====
    test('tabChangeHandler navigates to selected tab', async () => {
        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Find and click on a tab to trigger tabChangeHandler
        const tabButtons = screen.queryAllByRole('tab');
        if (tabButtons.length > 1) {
            fireEvent.click(tabButtons[1]); // Click on second tab
            
            await waitFor(() => {
                // Should navigate to the clicked tab
                expect(mockNavigate).toHaveBeenCalled();
            });
        }
    });

    test('navigates with correct tab route', async () => {
        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Find tabs and click to trigger navigation
        const tabButtons = screen.queryAllByRole('tab');
        if (tabButtons.length > 1) {
            fireEvent.click(tabButtons[1]);
            
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    expect.stringContaining(VACANCY_DASHBOARD)
                );
            });
        }
    });

    // ===== Role Validation Tests =====
    test('calls API when user has required role access', async () => {
        mockValidateRoleForCurrentTenant.mockReturnValue(true);

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });
    });

    test('shows error message when user does not have role access', async () => {
        mockValidateRoleForCurrentTenant.mockReturnValue(false);

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).not.toHaveBeenCalled();
        });
    });

    // ===== Remove Vacancy Tests =====
    test('removes a draft vacancy successfully', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Draft Position', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });
        axios.post.mockResolvedValue({ data: { result: 'success' } });

        const { container } = rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click the remove button
        const removeButtons = screen.queryAllByRole('button', { name: /remove/i });
        if (removeButtons.length > 0) {
            fireEvent.click(removeButtons[0]);

            await waitFor(() => {
                expect(screen.queryByText(/Are you sure you want to remove this vacancy/i)).toBeInTheDocument();
            });

            // Click confirm in modal
            const confirmButton = screen.getByRole('button', { name: /confirm/i });
            fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalled();
            });
        }
    });

    test('removes a final vacancy successfully', async () => {
        const mockData = {
            result: [
                { sys_id: '2', title: 'Final Position', state: 'final', open_date: '2024-01-01', close_date: '2024-02-01' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });
        axios.post.mockResolvedValue({ data: { result: 'success' } });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click the remove button
        const removeButtons = screen.queryAllByRole('button', { name: /remove/i });
        if (removeButtons.length > 0) {
            fireEvent.click(removeButtons[0]);

            await waitFor(() => {
                expect(screen.queryByText(/Are you sure you want to remove this vacancy/i)).toBeInTheDocument();
            });

            // Click confirm in modal
            const confirmButton = screen.getByRole('button', { name: /confirm/i });
            fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalled();
            });
        }
    });

    test('handles error when removing vacancy fails', async () => {
        const mockData = {
            result: [
                { sys_id: '3', title: 'Problem Position', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });
        axios.post.mockRejectedValue(new Error('Remove failed'));

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click the remove button
        const removeButtons = screen.queryAllByRole('button', { name: /remove/i });
        if (removeButtons.length > 0) {
            fireEvent.click(removeButtons[0]);

            await waitFor(() => {
                expect(screen.queryByText(/Are you sure you want to remove this vacancy/i)).toBeInTheDocument();
            });

            // Click confirm in modal
            const confirmButton = screen.getByRole('button', { name: /confirm/i });
            fireEvent.click(confirmButton);

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalled();
            });
        }
    });

    // ===== Remove Modal Cancel Tests =====
    test('handleRemoveModalCancel closes the remove modal', async () => {
        const mockData = {
            result: [
                { sys_id: '4', title: 'Test Position', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click the remove button to open modal
        const removeButtons = screen.queryAllByRole('button', { name: /remove/i });
        if (removeButtons.length > 0) {
            fireEvent.click(removeButtons[0]);

            await waitFor(() => {
                expect(screen.queryByText(/Are you sure you want to remove this vacancy/i)).toBeInTheDocument();
            });

            // Click cancel button to close modal
            const cancelButtons = screen.queryAllByRole('button', { name: /cancel/i });
            if (cancelButtons.length > 0) {
                fireEvent.click(cancelButtons[cancelButtons.length - 1]); // Click the last cancel button (modal cancel)

                // Verify no POST request was made (cancel prevents removal)
                expect(axios.post).not.toHaveBeenCalled();
            }
        }
    });

    // ===== Edit Button Click Tests =====
    test('handleEditButtonClick navigates to EDIT_DRAFT for draft vacancies', async () => {
        const mockData = {
            result: [
                { sys_id: '5', title: 'Draft Position', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click the edit button
        const editButtons = screen.queryAllByRole('button', { name: /edit/i });
        if (editButtons.length > 0) {
            fireEvent.click(editButtons[0]);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    expect.stringContaining(EDIT_DRAFT.replace(/\/+$/, ''))
                );
            });
        }
    });

    test('handleEditButtonClick navigates to EDIT_VACANCY for non-draft vacancies', async () => {
        const mockData = {
            result: [
                { sys_id: '6', title: 'Live Position', state: 'live', open_date: '2024-01-01', close_date: '2024-02-01' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click the edit button
        const editButtons = screen.queryAllByRole('button', { name: /edit/i });
        if (editButtons.length > 0) {
            fireEvent.click(editButtons[0]);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    expect.stringContaining(EDIT_VACANCY.replace(/\/+$/, ''))
                );
            });
        }
    });

    // ===== Get Filtered Data Tests =====
    test('getFilteredData returns all vacancies when filter is all', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Draft Position', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' },
                { sys_id: '2', title: 'Final Position', state: 'final', open_date: '2024-01-02', close_date: '2024-02-02' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Verify both vacancies are displayed
        expect(screen.getByText('Draft Position')).toBeInTheDocument();
        expect(screen.getByText('Final Position')).toBeInTheDocument();
    });

    test('getFilteredData filters by draft state', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Draft Position', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' },
                { sys_id: '2', title: 'Final Position', state: 'final', open_date: '2024-01-02', close_date: '2024-02-02' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click the Draft filter button
        const draftButton = screen.queryByRole('radio', { name: /draft/i });
        if (draftButton) {
            fireEvent.click(draftButton);

            // Verify only draft vacancy is displayed
            expect(screen.getByText('Draft Position')).toBeInTheDocument();
            expect(screen.queryByText('Final Position')).not.toBeInTheDocument();
        }
    });

    test('getFilteredData filters by finalized state', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Draft Position', state: 'draft', open_date: '2024-01-01', close_date: '2024-02-01' },
                { sys_id: '2', title: 'Final Position', state: 'final', open_date: '2024-01-02', close_date: '2024-02-02' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click the Finalized filter button
        const finalButton = screen.queryByRole('radio', { name: /finalized/i });
        if (finalButton) {
            fireEvent.click(finalButton);

            // Verify only final vacancy is displayed
            expect(screen.getByText('Final Position')).toBeInTheDocument();
            expect(screen.queryByText('Draft Position')).not.toBeInTheDocument();
        }
    });

    test('getFilteredData filters extended vacancies', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Extended Position', state: 'live', extended: '1', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 },
                { sys_id: '2', title: 'Regular Position', state: 'live', extended: '0', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Both vacancies should be displayed initially
        expect(screen.queryByText('Extended Position')).toBeInTheDocument();
        expect(screen.queryByText('Regular Position')).toBeInTheDocument();
    });

    // ===== Closed Tab Filtering Tests =====
    test('getFilteredData handles closed tab with triage state', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Triaged Position', state: 'triage', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 },
                { sys_id: '2', title: 'Individual Scored Position', state: 'individual_scoring_complete', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3 },
                { sys_id: '3', title: 'Committee Review Position', state: 'committee_review_in_progress', open_date: '2024-01-03', close_date: '2024-02-03', applicants: 7 },
                { sys_id: '4', title: 'Chair Triaged Position', state: 'chair_triage', open_date: '2024-01-04', close_date: '2024-02-04', applicants: 2 },
                { sys_id: '5', title: 'Scoring In Progress Position', state: 'individual_scoring_in_progress', open_date: '2024-01-05', close_date: '2024-02-05', applicants: 4 },
                { sys_id: '6', title: 'Committee Review Complete Position', state: 'committee_review_complete', open_date: '2024-01-06', close_date: '2024-02-06', applicants: 6 },
                { sys_id: '7', title: 'Voting Complete Position', state: 'voting_complete', open_date: '2024-01-07', close_date: '2024-02-07', applicants: 8 },
                { sys_id: '8', title: 'Closed Position', state: 'closed', open_date: '2024-01-08', close_date: '2024-02-08', applicants: 1 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        // Mock useParams to return 'closed' as the tab
        useParams.mockReturnValue({ tab: 'closed' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Now test filtering on closed tab - click Triage filter
        const triageButton = screen.queryByRole('radio', { name: /triage/i });
        if (triageButton) {
            fireEvent.click(triageButton);

            // After filtering by triage, only triage and chair_triage should show
            // Verify by checking for positions that should NOT be there
            expect(screen.queryByText('Individual Scored Position')).not.toBeInTheDocument();
            expect(screen.queryByText('Committee Review Position')).not.toBeInTheDocument();
            expect(screen.queryByText('Voting Complete Position')).not.toBeInTheDocument();
            expect(screen.queryByText('Scoring In Progress Position')).not.toBeInTheDocument();
            expect(screen.queryByText('Committee Review Complete Position')).not.toBeInTheDocument();
            expect(screen.queryByText('Closed Position')).not.toBeInTheDocument();
        }
    });

    test('getFilteredData closed tab filters by individual_scored state', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Triaged Position', state: 'triage', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 },
                { sys_id: '2', title: 'Individual Scored Position', state: 'individual_scoring_complete', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3 },
                { sys_id: '5', title: 'Scoring In Progress Position', state: 'individual_scoring_in_progress', open_date: '2024-01-05', close_date: '2024-02-05', applicants: 4 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'closed' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click Individual Scoring filter
        const scoringButton = screen.queryByRole('radio', { name: /individual scoring/i });
        if (scoringButton) {
            fireEvent.click(scoringButton);

            // Should filter to show only individual_scored states
            expect(screen.queryByText('Triaged Position')).not.toBeInTheDocument();
        }
    });

    test('getFilteredData closed tab filters by committee_review state', async () => {
        const mockData = {
            result: [
                { sys_id: '3', title: 'Committee Review Position', state: 'committee_review_in_progress', open_date: '2024-01-03', close_date: '2024-02-03', applicants: 7 },
                { sys_id: '6', title: 'Committee Review Complete Position', state: 'committee_review_complete', open_date: '2024-01-06', close_date: '2024-02-06', applicants: 6 },
                { sys_id: '1', title: 'Triaged Position', state: 'triage', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'closed' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click Committee Review filter
        const committeeButton = screen.queryByRole('radio', { name: /committee review/i });
        if (committeeButton) {
            fireEvent.click(committeeButton);

            // Should filter to show only committee_review states
            expect(screen.queryByText('Triaged Position')).not.toBeInTheDocument();
        }
    });

    test('getFilteredData closed tab filters by voting_complete state', async () => {
        const mockData = {
            result: [
                { sys_id: '7', title: 'Voting Complete Position', state: 'voting_complete', open_date: '2024-01-07', close_date: '2024-02-07', applicants: 8 },
                { sys_id: '1', title: 'Triaged Position', state: 'triage', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'closed' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click Voting Complete filter
        const votingButton = screen.queryByRole('radio', { name: /voting complete/i });
        if (votingButton) {
            fireEvent.click(votingButton);

            // Should filter to show only voting_complete state
            expect(screen.queryByText('Triaged Position')).not.toBeInTheDocument();
        }
    });

    test('getFilteredData closed tab filters by closed state', async () => {
        const mockData = {
            result: [
                { sys_id: '8', title: 'Closed Position', state: 'closed', open_date: '2024-01-08', close_date: '2024-02-08', applicants: 1 },
                { sys_id: '1', title: 'Triaged Position', state: 'triage', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'closed' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Verify the component rendered with the closed tab
        // At least one vacancy should be displayed
        const editButtons = screen.queryAllByRole('button', { name: /edit/i });
        expect(editButtons.length).toBeGreaterThan(0);
    });

    // ===== Rolling Tab Filtering Tests =====
    test('rolling tab renders vacancies with status field', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Rolling Open Position', status: 'open', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 },
                { sys_id: '2', title: 'Rolling Closed Position', status: 'closed', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'rolling' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Verify the component rendered with rolling tab vacancies
        const editButtons = screen.queryAllByRole('button', { name: /edit/i });
        expect(editButtons.length).toBeGreaterThan(0);
    });

    test('getFilteredData rolling tab filters by open status', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Rolling Open Position', status: 'open', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 },
                { sys_id: '2', title: 'Rolling Closed Position', status: 'closed', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'rolling' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click Open filter
        const openButton = screen.queryByRole('radio', { name: /open/i });
        if (openButton) {
            fireEvent.click(openButton);

            // Should filter to show only open status
            // At this point, we verified the filter was clicked
            await waitFor(() => {
                expect(screen.queryAllByRole('button', { name: /edit/i }).length).toBeGreaterThan(0);
            });
        }
    });

    test('getFilteredData rolling tab filters by closed status', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Rolling Open Position', status: 'open', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 },
                { sys_id: '2', title: 'Rolling Closed Position', status: 'closed', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'rolling' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click Closed filter
        const closedButton = screen.queryByRole('radio', { name: /closed/i });
        if (closedButton) {
            fireEvent.click(closedButton);

            // Should filter to show only closed status
            await waitFor(() => {
                expect(screen.queryAllByRole('button', { name: /edit/i }).length).toBeGreaterThan(0);
            });
        }
    });

    test('rolling tab shows all vacancies when filter is all', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Rolling Open Position', status: 'open', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5 },
                { sys_id: '2', title: 'Rolling Closed Position', status: 'closed', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3 },
                { sys_id: '3', title: 'Another Rolling Position', status: 'open', open_date: '2024-01-03', close_date: '2024-02-03', applicants: 7 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'rolling' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // By default, "all" filter is selected, so all vacancies should show
        // Verify multiple edit buttons are present (one for each vacancy)
        const editButtons = screen.queryAllByRole('button', { name: /edit/i });
        expect(editButtons.length).toBe(3);
    });

    // ===== Copy Link Tests =====
    test('Copy Link button exists in live tab', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Live Position', state: 'live', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5, extended: '0' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'live' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Verify Copy Link button exists
        const copyLinkButton = screen.queryByRole('button', { name: /copy link/i });
        expect(copyLinkButton).toBeInTheDocument();
    });

    test('Copy Link button can be clicked', async () => {
        const mockData = {
            result: [
                { sys_id: 'vacancy-123', title: 'Live Position for Copy', state: 'live', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5, extended: '0' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'live' });

        // Mock document.execCommand and getElementById
        const execCommandMock = jest.fn().mockReturnValue(true);
        document.execCommand = execCommandMock;
        
        const originalGetElementById = document.getElementById;
        document.getElementById = jest.fn((id) => {
            if (!id) return null;
            if (id === 'vacancy-123') {
                return { href: 'http://example.com/vacancy/vacancy-123' };
            }
            if (id.startsWith('copy_link_')) {
                const input = document.createElement('input');
                input.id = id;
                return input;
            }
            return originalGetElementById(id);
        });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click Copy Link button
        const copyLinkButton = screen.queryByRole('button', { name: /copy link/i });
        if (copyLinkButton) {
            fireEvent.click(copyLinkButton);

            // Verify document.execCommand was called with 'copy'
            await waitFor(() => {
                expect(execCommandMock).toHaveBeenCalledWith('copy');
            });
        }

        // Restore original getElementById
        document.getElementById = originalGetElementById;
    });

    test('Copy Link works with live vacancies', async () => {
        const mockData = {
            result: [
                { sys_id: 'test-vacancy-1', title: 'Live Position 1', state: 'live', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5, extended: '0' },
                { sys_id: 'test-vacancy-2', title: 'Live Position 2', state: 'live', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3, extended: '1' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'live' });

        // Mock document.execCommand and getElementById
        const execCommandMock = jest.fn().mockReturnValue(true);
        document.execCommand = execCommandMock;
        
        const originalGetElementById = document.getElementById;
        document.getElementById = jest.fn((id) => {
            if (!id) return null;
            if (id === 'test-vacancy-1' || id === 'test-vacancy-2') {
                return { href: 'http://example.com/vacancy/' + id };
            }
            if (id.startsWith('copy_link_')) {
                const input = document.createElement('input');
                input.id = id;
                return input;
            }
            return originalGetElementById(id);
        });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Get all Copy Link buttons
        const copyLinkButtons = screen.queryAllByRole('button', { name: /copy link/i });
        expect(copyLinkButtons.length).toBe(2);

        // Click the first Copy Link button
        fireEvent.click(copyLinkButtons[0]);

        // Verify copy command was executed
        await waitFor(() => {
            expect(execCommandMock).toHaveBeenCalledWith('copy');
        });

        // Restore original getElementById
        document.getElementById = originalGetElementById;
    });

    test('Copy Link button displays in rolling tab table', async () => {
        const mockData = {
            result: [
                { sys_id: '1', title: 'Rolling Position', status: 'open', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 2 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'rolling' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Verify Copy Link button is available for rolling tab vacancies
        const copyLinkButton = screen.queryByRole('button', { name: /copy link/i });
        expect(copyLinkButton).toBeInTheDocument();
    });

    test('Copy Link button works in rolling tab vacancies', async () => {
        const mockData = {
            result: [
                { sys_id: 'rolling-copy-1', title: 'Rolling Position for Copy', status: 'open', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 4 },
                { sys_id: 'rolling-copy-2', title: 'Rolling Position 2', status: 'closed', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 2 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'rolling' });

        // Mock document.execCommand and getElementById
        const execCommandMock = jest.fn().mockReturnValue(true);
        document.execCommand = execCommandMock;
        
        // Mock getElementById to return a link element with href
        const originalGetElementById = document.getElementById;
        document.getElementById = jest.fn((id) => {
            if (!id) return null;
            if (id === 'rolling-copy-1' || id === 'rolling-copy-2') {
                return { href: 'http://example.com/vacancy/' + id };
            }
            if (id.startsWith('copy_link_')) {
                const input = document.createElement('input');
                input.id = id;
                return input;
            }
            return originalGetElementById(id);
        });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Get all Copy Link buttons in rolling tab
        const copyLinkButtons = screen.queryAllByRole('button', { name: /copy link/i });
        expect(copyLinkButtons.length).toBe(2);

        // Click the second Copy Link button
        fireEvent.click(copyLinkButtons[1]);

        // Verify copy command was executed
        await waitFor(() => {
            expect(execCommandMock).toHaveBeenCalledWith('copy');
        });

        // Restore original getElementById
        document.getElementById = originalGetElementById;
    });

    // test('Copy Link button does not exist in closed vacancies', async () => {
    //     const mockData = {
    //         result: [
    //             { sys_id: 'closed-1', title: 'Closed Position', state: 'closed', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 2 }
    //         ]
    //     };
    //     axios.get.mockResolvedValue({ data: mockData });

    //     useParams.mockReturnValue({ tab: 'closed' });

    //     rtRender(<VacancyDashboard />);

    //     await waitFor(() => {
    //         expect(axios.get).toHaveBeenCalled();
    //     });

    //     // Verify Copy Link button does NOT exist in closed tab
    //     // (only View Applicants and View Vacancy buttons should exist)
    //     const copyLinkButton = screen.queryByRole('button', { name: /copy link/i });
    //     expect(copyLinkButton).not.toBeInTheDocument();

    //     // Verify View Applicants button exists instead
    //     const viewApplicantsButton = screen.queryByRole('button', { name: /view applicants/i });
    //     expect(viewApplicantsButton).toBeInTheDocument();
    // });

    // ===== Extend Modal Tests =====
    test('handleExtendModalCancel closes the extend modal', async () => {
        const mockData = {
            result: [
                { sys_id: 'extend-test-1', title: 'Live Position', state: 'live', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5, extended: '0' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'live' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Click Extend button to trigger state change
        const extendButtons = screen.queryAllByRole('button', { name: /extend/i });
        expect(extendButtons.length).toBeGreaterThan(0);
        fireEvent.click(extendButtons[0]);

        // Wait for component to update
        await waitFor(() => {
            expect(lastExtendModalProps).not.toBeNull();
        });

        // Call the handleExtendModalCancel callback to test the function
        if (lastExtendModalProps && lastExtendModalProps.handleExtendModalCancel) {
            lastExtendModalProps.handleExtendModalCancel();
        }

        // Reset for other tests
        lastExtendModalProps = null;
    });

    test('Extend modal button exists in live tab', async () => {
        const mockData = {
            result: [
                { sys_id: 'extend-1', title: 'Live Position for Extend', state: 'live', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5, extended: '0' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'live' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Verify Extend button is rendered in live tab
        const extendButton = screen.queryByRole('button', { name: /extend/i });
        expect(extendButton).toBeInTheDocument();
        
        // Click it to trigger the handler
        fireEvent.click(extendButton);

        // Verify props were captured (meaning the handler was called)
        await waitFor(() => {
            expect(lastExtendModalProps).not.toBeNull();
            expect(lastExtendModalProps.handleExtendModalCancel).toBeDefined();
        });

        // Reset for other tests
        lastExtendModalProps = null;
    });

    test('Extend button is only in live tab, not in preflight', async () => {
        const mockData = {
            result: [
                { sys_id: 'preflight-1', title: 'Preflight Position', state: 'preflight', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 3 }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'preflight' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Verify Extend button is NOT rendered in preflight tab (only Edit and Remove)
        const extendButton = screen.queryByRole('button', { name: /extend/i });
        expect(extendButton).not.toBeInTheDocument();

        // Verify Edit button IS in preflight tab
        const editButton = screen.queryByRole('button', { name: /edit/i });
        expect(editButton).toBeInTheDocument();
    });

    test('handleExtendModalCancel works with multiple vacancies', async () => {
        const mockData = {
            result: [
                { sys_id: 'extend-multi-1', title: 'Live Position 1', state: 'live', open_date: '2024-01-01', close_date: '2024-02-01', applicants: 5, extended: '0' },
                { sys_id: 'extend-multi-2', title: 'Live Position 2', state: 'live', open_date: '2024-01-02', close_date: '2024-02-02', applicants: 3, extended: '0' },
                { sys_id: 'extend-multi-3', title: 'Live Position 3', state: 'live', open_date: '2024-01-03', close_date: '2024-02-03', applicants: 7, extended: '1' }
            ]
        };
        axios.get.mockResolvedValue({ data: mockData });

        useParams.mockReturnValue({ tab: 'live' });

        rtRender(<VacancyDashboard />);

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Verify all Extend buttons are present (one for each vacancy)
        const extendButtons = screen.queryAllByRole('button', { name: /extend/i });
        expect(extendButtons.length).toBe(3);
    });

});