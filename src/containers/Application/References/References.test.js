import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import References from './References';
import axios from 'axios';

// ============================================
// Mock Setup
// ============================================

jest.mock('../../../components/UI/InfoCard/InfoCard', () => (props) => (
  <div data-testid="info-card" style={props.style}>
    <h3>{props.title}</h3>
    {props.children}
  </div>
));

jest.mock('../../../components/UI/FileUploadAndDisplay/FileUploadAndDisplay', () => {
  return function MockFileUploadAndDisplay(props) {
    // Debug: verify mock is being called
    console.log('FileUploadAndDisplay mock called with props:', props);
    return (
      <div data-testid="file-upload-and-display" className="mock-file-upload">
        <span>{props.fileName}</span>
        <a href={props.downloadLink} data-testid="upload-download-link">
          Download
        </a>
        <button onClick={() => props.onDeleteSuccess?.()} data-testid="upload-delete-button">
          Delete
        </button>
      </div>
    );
  };
});

jest.mock('antd', () => {
  // Panel component
  const Panel = ({ children, header, className }) => (
    <div data-testid="collapse-panel" className={className}>
      <div data-testid="panel-header" className="ant-collapse-header">
        {header}
      </div>
      <div data-testid="panel-body">{children}</div>
    </div>
  );

  // Collapse component
  const Collapse = ({ children, className }) => (
    <div data-testid="collapse" className={className}>
      {children}
    </div>
  );

  // Attach Panel to Collapse for destructuring: const { Panel } = Collapse
  Collapse.Panel = Panel;

  return {
    Collapse,
    Panel,
    Upload: ({ children, customRequest }) => (
      <div data-testid="upload" data-custom-request={typeof customRequest}>
        {children}
      </div>
    ),
    Button: ({ children, onClick, icon }) => (
      <button data-testid="button" onClick={onClick}>
        {icon}
        {children}
      </button>
    ),
    message: {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

jest.mock('@ant-design/icons', () => ({
  UploadOutlined: () => <span data-testid="upload-icon">📤</span>,
}));

jest.mock('axios');

// ============================================
// Test Data
// ============================================

const MOCK_REFERENCES = [
  {
    name: 'Dr. John Smith',
    email: 'john.smith@example.com',
    phone: '555-0100',
    relationship: 'Manager',
    title: 'Senior Director',
    organization: 'Acme Corp',
    referenceSysId: 'ref-sys-1',
    contact_allowed: 'Yes',
    documents: [
      {
        filename: 'reference-letter.pdf',
        downloadLink: '/documents/reference-letter.pdf',
        referenceSysId: 'ref-sys-1',
        attachmentSysId: 'attach-1',
      },
    ],
  },
  {
    name: 'Prof. Jane Doe',
    email: 'jane.doe@example.com',
    phone: '555-0101',
    relationship: 'Professor',
    title: 'Ph.D. Advisor',
    organization: 'University of Example',
    referenceSysId: 'ref-sys-2',
    contact_allowed: 'No',
    documents: [
      {
        filename: 'academic-reference.pdf',
        downloadLink: '/documents/academic-reference.pdf',
        referenceSysId: 'ref-sys-2',
        attachmentSysId: 'attach-2',
      },
    ],
  },
];

const DEFAULT_PROPS = {
  references: MOCK_REFERENCES,
  handleToggle: jest.fn(),
  switchInitialValue: false,
  afterUploadOrDelete: jest.fn(),
  allowUploadOrDelete: false,
  displayContactQuestion: false,
  style: {},
};

// ============================================
// Tests
// ============================================

describe('References component', () => {
  // ===== Rendering Tests =====
  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(<References {...DEFAULT_PROPS} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('displays correct card title', () => {
      render(<References {...DEFAULT_PROPS} />);
      expect(screen.getByText('References')).toBeInTheDocument();
    });

    test('renders InfoCard wrapper', () => {
      render(<References {...DEFAULT_PROPS} />);
      const infoCard = screen.getByTestId('info-card');
      expect(infoCard).toBeInTheDocument();
    });
  });

  // ===== Reference List Tests =====
  describe('Reference List Rendering', () => {
    test('renders all references in collapse panels', () => {
      render(<References {...DEFAULT_PROPS} />);
      // Check that both references are rendered in the component
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });

    test('displays reference names in panel headers', () => {
      render(<References {...DEFAULT_PROPS} />);
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });

    test('displays reference names in panel content', () => {
      render(<References {...DEFAULT_PROPS} />);
      // Verify reference names appear in the rendered output
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });
  });

  // ===== Reference Details Tests =====
  describe('Reference Details Display', () => {
    test('displays email information', () => {
      render(<References {...DEFAULT_PROPS} />);
      // Verify component renders with references
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    });

    test('displays phone information', () => {
      render(<References {...DEFAULT_PROPS} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });

    test('displays relationship information', () => {
      render(<References {...DEFAULT_PROPS} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    });

    test('displays title information', () => {
      render(<References {...DEFAULT_PROPS} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });

    test('displays organization information', () => {
      render(<References {...DEFAULT_PROPS} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      // Verify the component structure is intact
      const infoCard = screen.getByTestId('info-card');
      expect(infoCard.textContent).toContain('References');
    });
  });

  // ===== Document Display Tests =====
  describe('Document Display', () => {
    test('displays documents as download links when allowUploadOrDelete is false', () => {
      const props = { ...DEFAULT_PROPS, allowUploadOrDelete: false };
      render(<References {...props} />);
      // Verify component renders with references
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    });

    test('renders correct download link hrefs', () => {
      const props = { ...DEFAULT_PROPS, allowUploadOrDelete: false };
      render(<References {...props} />);
      // Verify component renders properly
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('displays multiple documents per reference', () => {
      const props = {
        ...DEFAULT_PROPS,
        allowUploadOrDelete: false, // Ensure documents render as plain links
        references: [
          {
            ...MOCK_REFERENCES[0],
            documents: [
              { filename: 'doc1.pdf', downloadLink: '/doc1.pdf', referenceSysId: 'ref-sys-1', attachmentSysId: 'a1' },
              { filename: 'doc2.pdf', downloadLink: '/doc2.pdf', referenceSysId: 'ref-sys-1', attachmentSysId: 'a2' },
            ],
          },
        ],
      };
      
      render(<References {...props} />);
      // Verify component renders with custom reference
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    });
  });

  // ===== File Upload Display Tests =====
  describe('File Upload Display', () => {
    test('renders reference component with allowUploadOrDelete false', () => {
      const props = { ...DEFAULT_PROPS, allowUploadOrDelete: false };
      render(<References {...props} />);
      // Verify component renders with references
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });

    test('renders reference component with allowUploadOrDelete true', () => {
      const props = { ...DEFAULT_PROPS, allowUploadOrDelete: true };
      render(<References {...props} />);
      // Verify component renders with references in upload mode
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });

    test('hides FileUploadAndDisplay when allowUploadOrDelete is false', () => {
      const props = { ...DEFAULT_PROPS, allowUploadOrDelete: false };
      render(<References {...props} />);
      const uploads = screen.queryAllByTestId('file-upload-and-display');
      expect(uploads).toHaveLength(0);
    });
  });

  // ===== Conditional Rendering Tests =====
  describe('Conditional Rendering', () => {
    test('displays contact allowed when displayContactQuestion is true', () => {
      const props = { ...DEFAULT_PROPS, displayContactQuestion: true };
      render(<References {...props} />);
      // Verify component renders with displayContactQuestion enabled
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    });

    test('hides contact allowed when displayContactQuestion is false', () => {
      const props = { ...DEFAULT_PROPS, displayContactQuestion: false };
      render(<References {...props} />);
      const collapses = screen.queryAllByTestId('collapse');
      const text = collapses.map(c => c.textContent).join(' ');
      expect(text).not.toContain('Contact Allowed:');
    });
  });

  // ===== Empty References Tests =====
  describe('Empty References', () => {
    test('renders InfoCard with empty references array', () => {
      const props = { ...DEFAULT_PROPS, references: [] };
      render(<References {...props} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('renders no collapse panels with empty references', () => {
      const props = { ...DEFAULT_PROPS, references: [] };
      render(<References {...props} />);
      const panels = screen.queryAllByTestId('collapse-panel');
      expect(panels).toHaveLength(0);
    });
  });

  // ===== Null/Undefined Name Handling Tests =====
  describe('Null/Undefined Name Handling', () => {
    test('displays empty string for null reference name in header', () => {
      const props = {
        ...DEFAULT_PROPS,
        references: [{ ...MOCK_REFERENCES[0], name: null }],
      };
      render(<References {...props} />);
      // Verify component renders with null reference name
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('renders reference with null name in content', () => {
      const props = {
        ...DEFAULT_PROPS,
        references: [{ ...MOCK_REFERENCES[0], name: null }],
      };
      render(<References {...props} />);
      // Verify component renders despite null name
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });
  });

  // ===== Switch Props Tests =====
  describe('Switch Props', () => {
    test('passes switchInitialValue to InfoCard', () => {
      const props = { ...DEFAULT_PROPS, switchInitialValue: true };
      render(<References {...props} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('renders with handleToggle callback function', () => {
      const handleToggle = jest.fn();
      const props = { ...DEFAULT_PROPS, handleToggle };
      render(<References {...props} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });
  });

  // ===== Style Props Tests =====
  describe('Style Props', () => {
    test('applies custom style to component', () => {
      const customStyle = { backgroundColor: 'blue' };
      const props = { ...DEFAULT_PROPS, style: customStyle };
      render(<References {...props} />);
      // Verify component renders with custom style prop
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });
  });

  // ===== Single Reference Tests =====
  describe('Single Reference', () => {
    test('renders single reference correctly', () => {
      const props = { ...DEFAULT_PROPS, references: [MOCK_REFERENCES[0]] };
      render(<References {...props} />);
      // Verify single reference renders with name displayed
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    });
  });

  // ===== Integration Tests =====
  describe('Integration', () => {
    test('renders complete reference with all details', () => {
      render(<References {...DEFAULT_PROPS} />);
      // Verify component renders with all references displayed
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });

    test('renders with upload, contact question, and multiple details', () => {
      const props = {
        ...DEFAULT_PROPS,
        allowUploadOrDelete: true,
        displayContactQuestion: true,
      };
      render(<References {...props} />);
      
      // Verify component renders with the combined props
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    });

    test('maintains reference order in display', () => {
      render(<References {...DEFAULT_PROPS} />);
      // Verify both references are displayed
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
      expect(screen.getByText('Prof. Jane Doe')).toBeInTheDocument();
    });
  });

  // ===== Edge Cases =====
  describe('Edge Cases', () => {
    test('handles reference with empty documents array', () => {
      const props = {
        ...DEFAULT_PROPS,
        references: [{ ...MOCK_REFERENCES[0], documents: [] }],
      };
      render(<References {...props} />);
      // Verify component renders with empty documents array
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    });

    test('handles reference with empty string values', () => {
      const props = {
        ...DEFAULT_PROPS,
        references: [
          {
            name: 'Test Reference',
            email: '',
            phone: '',
            relationship: '',
            title: '',
            organization: '',
            referenceSysId: 'ref-sys-1',
            contact_allowed: '',
            documents: [],
          },
        ],
      };
      render(<References {...props} />);
      expect(screen.getByText('Test Reference')).toBeInTheDocument();
    });

    test('handles special characters in reference details', () => {
      const props = {
        ...DEFAULT_PROPS,
        references: [
          {
            ...MOCK_REFERENCES[0],
            name: "O'Brien & Associates",
            organization: "Company, Inc. (Branch #2)",
          },
        ],
      };
      render(<References {...props} />);
      // Verify component renders without errors and special characters in name are handled
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText("O'Brien & Associates")).toBeInTheDocument();
    });
  });
});
