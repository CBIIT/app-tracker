import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminScoringWidget from './AdminScoringWidget';
import axios from 'axios';

// ============================================
// Mock Setup
// ============================================

jest.mock('axios');
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

// Mock ScoringWidget with controlled test interface
jest.mock('../ScoringWidget/ScoringWidget', () => (props) => (
  <div data-testid="scoring-widget">
    <div>{props.title}</div>
    <div>{props.description}</div>
    {props.enableCommitteeMemberDropdown && (
      <select
        data-testid="committee-member-dropdown"
        onChange={(e) => props.committeeMemberDropdownOnClick(e.target.value)}
      >
        {props.committeeMemberDropdownChoices.map((choice, idx) => (
          <option key={idx} value={idx}>
            {choice}
          </option>
        ))}
      </select>
    )}
    <input
      data-testid="score-input-category1"
      type="number"
      onChange={(e) => props.scoreChangeHandler(parseInt(e.target.value), 'category1')}
      value={props.scores.category1 || 0}
    />
    <textarea
      data-testid="comments-textarea"
      onChange={props.onScoreCommentsChange}
      value={props.triageComments}
    />
    <select
      data-testid="triage-select"
      onChange={props.onTriageSelect}
      value={props.triageChoice}
    >
      <option value="">Select</option>
      {props.triageOptions?.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <button onClick={props.onSaveClick} data-testid="save-button">
      Save
    </button>
    <button onClick={props.onCancelClick} data-testid="cancel-button">
      Cancel
    </button>
  </div>
));

// ============================================
// Test Data
// ============================================

const MOCK_COMMITTEE_RESPONSE = {
  data: {
    result: [
      {
        sys_id: 'member-1',
        name: 'Jane Smith',
        category_1: 4,
        comments: 'Good candidate',
        recommend: 'yes',
        recused: 0,
      },
      {
        sys_id: 'member-2',
        name: 'John Johnson',
        category_1: 3,
        comments: 'Average candidate',
        recommend: 'no',
        recused: 0,
      },
      {
        sys_id: 'member-3',
        name: 'Bob Wilson',
        category_1: 0,
        comments: '',
        recommend: '',
        recused: 1,
      },
    ],
  },
};

const DEFAULT_PROPS = {
  applicationId: 'app-123',
  numOfCategories: 1,
  categories: ['Category 1'],
  triageOptions: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ],
  ratingPlanDownloadLink: 'http://example.com/rating-plan.pdf',
  onCancelClick: jest.fn(),
  style: {},
  initiallyHideContent: false,
};

// ============================================
// Helper Functions
// ============================================

const renderComponent = (props = {}) => {
  return render(<AdminScoringWidget {...DEFAULT_PROPS} {...props} />);
};

// ============================================
// Tests
// ============================================

describe('AdminScoringWidget component tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue(MOCK_COMMITTEE_RESPONSE);
    axios.post.mockResolvedValue({ data: { result: 'success' } });
  });

  // ===== Rendering Tests =====
  describe('Component Rendering', () => {
    test('renders without crashing', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('scoring-widget')).toBeInTheDocument();
      });
    });

    test('displays correct title and description', async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Committee Members' Rating and Feedback")
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Please score the applicant on a scale of 5/)
        ).toBeInTheDocument();
      });
    });
  });

  // ===== API Integration Tests =====
  describe('API Integration', () => {
    test('loads scores on mount via useEffect', async () => {
      renderComponent();

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('app-123')
        );
      });
    });

    test('populates committee member dropdown with fetched data', async () => {
      renderComponent();

      await waitFor(() => {
        const dropdown = screen.getByTestId('committee-member-dropdown');
        const options = dropdown.querySelectorAll('option');
        expect(options).toHaveLength(3);
        expect(options[0]).toHaveTextContent('Jane Smith');
        expect(options[1]).toHaveTextContent('John Johnson');
        expect(options[2]).toHaveTextContent('Bob Wilson');
      });
    });

    test('handles empty committee member list', async () => {
      axios.get.mockResolvedValue({ data: { result: [] } });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('scoring-widget')).toBeInTheDocument();
      });

      const dropdown = screen.getByTestId('committee-member-dropdown');
      const options = dropdown.querySelectorAll('option');
      expect(options).toHaveLength(0);
    });
  });

  // ===== Default Selection Tests =====
  describe('Default Selection', () => {
    test('selects first committee member by default', async () => {
      renderComponent();

      await waitFor(() => {
        const scoreInput = screen.getByTestId('score-input-category1');
        expect(scoreInput).toHaveValue(4); // Jane Smith's score
      });
    });
  });

  // ===== Dropdown Selection Tests =====
  describe('Dropdown Selection', () => {
    test('updates selected committee member when dropdown changes', async () => {
      renderComponent();

      await waitFor(() => {
        const scoreInput = screen.getByTestId('score-input-category1');
        expect(scoreInput).toHaveValue(4); // Jane Smith
      });

      const dropdown = screen.getByTestId('committee-member-dropdown');
      fireEvent.change(dropdown, { target: { value: '1' } });

      await waitFor(() => {
        const scoreInput = screen.getByTestId('score-input-category1');
        expect(scoreInput).toHaveValue(3); // John Johnson
      });
    });

    test('loads scores on selectedCommitteeMember change', async () => {
      renderComponent();

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });

      const initialCallCount = axios.get.mock.calls.length;
      const dropdown = screen.getByTestId('committee-member-dropdown');
      fireEvent.change(dropdown, { target: { value: '1' } });

      await waitFor(() => {
        expect(axios.get.mock.calls.length).toBeGreaterThan(initialCallCount);
      });
    });
  });

  // ===== Input Change Tests =====
  describe('Input Changes', () => {
    test('handles score change via selectedScoreChangeHandler', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('score-input-category1')).toBeInTheDocument();
      });

      const scoreInput = screen.getByTestId('score-input-category1');
      fireEvent.change(scoreInput, { target: { value: '5' } });

      await waitFor(() => {
        expect(scoreInput).toHaveValue(5);
      });
    });

    test('handles comment change via onSelectedScoreCommentsChange', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('comments-textarea')).toBeInTheDocument();
      });

      const textarea = screen.getByTestId('comments-textarea');
      fireEvent.change(textarea, {
        target: { value: 'This is a great candidate!' },
      });

      await waitFor(() => {
        expect(textarea).toHaveValue('This is a great candidate!');
      });
    });

    test('handles triage selection via onTriageSelect', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('triage-select')).toBeInTheDocument();
      });

      const triageSelect = screen.getByTestId('triage-select');
      fireEvent.change(triageSelect, { target: { value: 'yes' } });

      await waitFor(() => {
        expect(triageSelect).toHaveValue('yes');
      });
    });
  });

  // ===== Save Tests =====
  describe('Save Operations', () => {
    test('saves scores and comments via onSaveClick', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
      });

      const scoreInput = screen.getByTestId('score-input-category1');
      const textarea = screen.getByTestId('comments-textarea');
      const triageSelect = screen.getByTestId('triage-select');
      const saveButton = screen.getByTestId('save-button');

      fireEvent.change(scoreInput, { target: { value: '5' } });
      fireEvent.change(textarea, { target: { value: 'Excellent candidate' } });
      fireEvent.change(triageSelect, { target: { value: 'yes' } });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            app_sys_id: 'app-123',
            score_as: 'member-1',
            recommend: 'yes',
            comments: 'Excellent candidate',
            category_1: 5,
          })
        );
      });
    });

    test('saves default score of 0 when no score is set', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
      });

      const dropdown = screen.getByTestId('committee-member-dropdown');
      fireEvent.change(dropdown, { target: { value: '2' } });

      await waitFor(() => {
        expect(screen.getByTestId('score-input-category1')).toHaveValue(0);
      });

      fireEvent.click(screen.getByTestId('save-button'));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ category_1: 0 })
        );
      });
    });

    test('formats submitted data correctly with category prefixes', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('score-input-category1'), {
        target: { value: '4' },
      });
      fireEvent.click(screen.getByTestId('save-button'));

      await waitFor(() => {
        const submittedData = axios.post.mock.calls[0][1];
        expect(submittedData).toHaveProperty('category_1');
        expect(submittedData.category_1).toBe(4);
      });
    });
  });

  // ===== Data Preservation Tests =====
  describe('Data Preservation', () => {
    test('preserves existing comments when switching committee members', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('comments-textarea')).toBeInTheDocument();
      });

      const textarea = screen.getByTestId('comments-textarea');
      expect(textarea).toHaveValue('Good candidate');

      const dropdown = screen.getByTestId('committee-member-dropdown');
      fireEvent.change(dropdown, { target: { value: '1' } });

      await waitFor(() => {
        expect(textarea).toHaveValue('Average candidate');
      });

      fireEvent.change(dropdown, { target: { value: '0' } });

      await waitFor(() => {
        expect(textarea).toHaveValue('Good candidate');
      });
    });

    test('handles recused committee member', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('committee-member-dropdown')).toBeInTheDocument();
      });

      const dropdown = screen.getByTestId('committee-member-dropdown');
      fireEvent.change(dropdown, { target: { value: '2' } });

      await waitFor(() => {
        expect(screen.getByTestId('score-input-category1')).toHaveValue(0);
      });
    });
  });

  // ===== Multiple Categories Tests =====
  describe('Multiple Categories', () => {
    test('handles multiple categories', async () => {
      const mockDataMultipleCategories = {
        data: {
          result: [
            {
              sys_id: 'member-1',
              name: 'Jane Smith',
              category_1: 4,
              category_2: 5,
              category_3: 3,
              comments: 'Good candidate',
              recommend: 'yes',
              recused: 0,
            },
          ],
        },
      };

      axios.get.mockResolvedValue(mockDataMultipleCategories);

      renderComponent({
        numOfCategories: 3,
        categories: ['Category 1', 'Category 2', 'Category 3'],
      });

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('app-123')
        );
      });

      fireEvent.click(screen.getByTestId('save-button'));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            category_1: 4,
            category_2: 5,
            category_3: 3,
          })
        );
      });
    });
  });

  // ===== Cancel Tests =====
  describe('Cancel Operations', () => {
    test('cancels action when onCancelClick is called', async () => {
      const mockOnCancel = jest.fn();
      renderComponent({ onCancelClick: mockOnCancel });

      await waitFor(() => {
        expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('cancel-button'));
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  // ===== Edge Cases Tests =====
  describe('Edge Cases', () => {
    test('passes rating plan link as description component', async () => {
      renderComponent({
        ratingPlanDownloadLink: 'http://example.com/rating-plan.pdf',
      });

      await waitFor(() => {
        expect(screen.getByTestId('scoring-widget')).toBeInTheDocument();
      });

      const descriptionText = screen.getByText(
        /Please score the applicant on a scale of 5/
      );
      expect(descriptionText).toBeInTheDocument();
    });
  });
});
