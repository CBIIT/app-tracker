import { render, screen } from '@testing-library/react';
import ApplicantInfo from './ApplicantInfo';

// ============================================
// Mock Setup
// ============================================

jest.mock('../../../components/UI/LabelValuePair/LabelValuePair', () => (props) => (
  <div data-testid={`label-value-pair-${props.label}`}>
    <span className="label">{props.label}:</span>
    <span className="value">{props.value || 'N/A'}</span>
  </div>
));

jest.mock('../../../components/UI/InfoCard/InfoCard', () => (props) => (
  <div data-testid="info-card" style={props.style}>
    <h3>{props.title}</h3>
    {props.children}
  </div>
));

jest.mock('../../../components/UI/InfoCard/InfoCardRow/InfoCardRow', () => (props) => (
  <div data-testid="info-card-row">{props.children}</div>
));

// ============================================
// Test Data
// ============================================

const DEFAULT_BASIC_INFO = {
  firstName: 'John',
  middleName: 'Michael',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-0100',
  businessPhone: '555-0101',
  highestLevelEducation: 'Bachelor\'s Degree',
  isUsCitizen: '1',
};

const DEFAULT_PROPS = {
  basicInfo: DEFAULT_BASIC_INFO,
  style: {},
};

// ============================================
// Tests
// ============================================

describe('ApplicantInfo component', () => {
  // ===== Rendering Tests =====
  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(<ApplicantInfo {...DEFAULT_PROPS} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('displays correct card title', () => {
      render(<ApplicantInfo {...DEFAULT_PROPS} />);
      expect(screen.getByText('Applicant Information')).toBeInTheDocument();
    });

    test('renders all basic contact information', () => {
      render(<ApplicantInfo {...DEFAULT_PROPS} />);
      
      expect(screen.getByTestId('label-value-pair-First Name')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      
      expect(screen.getByTestId('label-value-pair-Last Name')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      
      expect(screen.getByTestId('label-value-pair-Email Address')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });

    test('renders phone numbers', () => {
      render(<ApplicantInfo {...DEFAULT_PROPS} />);
      
      expect(screen.getByTestId('label-value-pair-Phone')).toBeInTheDocument();
      expect(screen.getByText('555-0100')).toBeInTheDocument();
      
      expect(screen.getByTestId('label-value-pair-Business Phone')).toBeInTheDocument();
      expect(screen.getByText('555-0101')).toBeInTheDocument();
    });
  });

  // ===== Middle Name Tests =====
  describe('Middle Name Display', () => {
    test('displays middle name when provided', () => {
      render(<ApplicantInfo {...DEFAULT_PROPS} />);
      
      expect(screen.getByTestId('label-value-pair-Middle Name')).toBeInTheDocument();
      expect(screen.getByText('Michael')).toBeInTheDocument();
    });

    test('displays middle name as empty when not provided', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: { ...DEFAULT_BASIC_INFO, middleName: '' },
      };
      
      render(<ApplicantInfo {...props} />);
      const middleNamePair = screen.getByTestId('label-value-pair-Middle Name');
      expect(middleNamePair).toBeInTheDocument();
    });
  });

  // ===== Conditional Rendering Tests =====
  describe('Conditional Rendering - Highest Level Education', () => {
    test('displays education level when defined', () => {
      render(<ApplicantInfo {...DEFAULT_PROPS} />);
      
      expect(screen.getByTestId('label-value-pair-Highest Level of Education')).toBeInTheDocument();
      expect(screen.getByText('Bachelor\'s Degree')).toBeInTheDocument();
    });

    test('does not render education level when undefined', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: { ...DEFAULT_BASIC_INFO, highestLevelEducation: undefined },
      };
      
      render(<ApplicantInfo {...props} />);
      expect(screen.queryByTestId('label-value-pair-Highest Level of Education')).not.toBeInTheDocument();
    });

    test('does not render education level when null', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: { ...DEFAULT_BASIC_INFO, highestLevelEducation: null },
      };
      
      render(<ApplicantInfo {...props} />);
      expect(screen.queryByTestId('label-value-pair-Highest Level of Education')).not.toBeInTheDocument();
    });
  });

  // ===== US Citizen Display Tests =====
  describe('US Citizen Display', () => {
    test('displays "Yes" when isUsCitizen is "1"', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: { ...DEFAULT_BASIC_INFO, isUsCitizen: '1' },
      };
      
      render(<ApplicantInfo {...props} />);
      
      const usCitizenPair = screen.getByTestId('label-value-pair-US Citizen');
      expect(usCitizenPair).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    test('displays "No" when isUsCitizen is "0"', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: { ...DEFAULT_BASIC_INFO, isUsCitizen: '0' },
      };
      
      render(<ApplicantInfo {...props} />);
      
      const usCitizenPair = screen.getByTestId('label-value-pair-US Citizen');
      expect(usCitizenPair).toBeInTheDocument();
      const values = screen.queryAllByText('No');
      expect(values.length).toBeGreaterThan(0);
    });

    test('displays empty string for invalid isUsCitizen value', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: { ...DEFAULT_BASIC_INFO, isUsCitizen: '2' },
      };
      
      render(<ApplicantInfo {...props} />);
      const usCitizenPair = screen.getByTestId('label-value-pair-US Citizen');
      expect(usCitizenPair).toBeInTheDocument();
    });

    test('does not render US Citizen when undefined', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: { ...DEFAULT_BASIC_INFO, isUsCitizen: undefined },
      };
      
      render(<ApplicantInfo {...props} />);
      expect(screen.queryByTestId('label-value-pair-US Citizen')).not.toBeInTheDocument();
    });

    test('does not render US Citizen when null', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: { ...DEFAULT_BASIC_INFO, isUsCitizen: null },
      };
      
      render(<ApplicantInfo {...props} />);
      expect(screen.queryByTestId('label-value-pair-US Citizen')).not.toBeInTheDocument();
    });
  });

  // ===== Style Props Tests =====
  describe('Style Props', () => {
    test('passes style prop to InfoCard', () => {
      const customStyle = { backgroundColor: 'blue', padding: '20px' };
      const props = {
        ...DEFAULT_PROPS,
        style: customStyle,
      };
      
      render(<ApplicantInfo {...props} />);
      const infoCard = screen.getByTestId('info-card');
      expect(infoCard).toHaveStyle(customStyle);
    });

    test('works with empty style object', () => {
      const props = {
        ...DEFAULT_PROPS,
        style: {},
      };
      
      render(<ApplicantInfo {...props} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });
  });

  // ===== Edge Cases =====
  describe('Edge Cases', () => {
    test('handles all optional fields as undefined', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: {
          firstName: 'Jane',
          middleName: '',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '555-0200',
          businessPhone: '',
          // highestLevelEducation and isUsCitizen undefined
        },
      };
      
      render(<ApplicantInfo {...props} />);
      
      // Component should still render with required fields
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
      
      // Optional fields should not render
      expect(screen.queryByTestId('label-value-pair-Highest Level of Education')).not.toBeInTheDocument();
      expect(screen.queryByTestId('label-value-pair-US Citizen')).not.toBeInTheDocument();
    });

    test('handles empty string values', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: {
          ...DEFAULT_BASIC_INFO,
          middleName: '',
          businessPhone: '',
        },
      };
      
      render(<ApplicantInfo {...props} />);
      
      // Component should render all fields
      expect(screen.getByTestId('label-value-pair-Middle Name')).toBeInTheDocument();
      expect(screen.getByTestId('label-value-pair-Business Phone')).toBeInTheDocument();
    });

    test('handles special characters in names', () => {
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: {
          ...DEFAULT_BASIC_INFO,
          firstName: "Jean-Claude",
          lastName: "O'Brien",
        },
      };
      
      render(<ApplicantInfo {...props} />);
      
      expect(screen.getByText("Jean-Claude")).toBeInTheDocument();
      expect(screen.getByText("O'Brien")).toBeInTheDocument();
    });

    test('handles long email addresses', () => {
      const longEmail = 'very.long.email.address.with.many.parts@example.com';
      const props = {
        ...DEFAULT_PROPS,
        basicInfo: {
          ...DEFAULT_BASIC_INFO,
          email: longEmail,
        },
      };
      
      render(<ApplicantInfo {...props} />);
      expect(screen.getByText(longEmail)).toBeInTheDocument();
    });
  });

  // ===== Integration Tests =====
  describe('Integration', () => {
    test('renders complete applicant info with all fields', () => {
      render(<ApplicantInfo {...DEFAULT_PROPS} />);
      
      // Verify all rows are rendered
      const rows = screen.getAllByTestId('info-card-row');
      expect(rows.length).toBeGreaterThan(0);
      
      // Verify card title
      expect(screen.getByText('Applicant Information')).toBeInTheDocument();
      
      // Verify key fields
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });

    test('renders with minimal required data', () => {
      const minimalProps = {
        basicInfo: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '555-0000',
        },
        style: {},
      };
      
      render(<ApplicantInfo {...minimalProps} />);
      
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });
  });
});
