import { render, screen } from '@testing-library/react';
import Documents from './Documents';

// ============================================
// Mock Setup
// ============================================

jest.mock('../../../components/UI/InfoCard/InfoCard', () => (props) => (
  <div data-testid="info-card">
    <h3>{props.title}</h3>
    {props.children}
  </div>
));

// ============================================
// Test Data
// ============================================

const MOCK_DOCUMENTS = [
  {
    title: 'Resume',
    filename: 'John_Doe_Resume.pdf',
    downloadLink: '/documents/resume.pdf',
  },
  {
    title: 'Cover Letter',
    filename: 'Cover_Letter.docx',
    downloadLink: '/documents/cover-letter.docx',
  },
  {
    title: 'Transcript',
    filename: 'Transcript.pdf',
    downloadLink: '/documents/transcript.pdf',
  },
];

const DEFAULT_PROPS = {
  documents: MOCK_DOCUMENTS,
  style: {},
};

// ============================================
// Tests
// ============================================

describe('Documents component', () => {
  // ===== Rendering Tests =====
  describe('Component Rendering', () => {
    test('renders without crashing', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('displays correct card title', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      expect(screen.getByText('Applicant Documents')).toBeInTheDocument();
    });

    test('renders document list container', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      const list = screen.getByRole('list');
      expect(list).toHaveClass('ApplicantDocumentList');
    });

    test('applies style prop to outer div', () => {
      const customStyle = { backgroundColor: 'blue', padding: '20px' };
      const props = {
        ...DEFAULT_PROPS,
        style: customStyle,
      };
      
      render(<Documents {...props} />);
      const container = screen.getByTestId('info-card').parentElement;
      expect(container).toHaveStyle(customStyle);
    });
  });

  // ===== Document List Tests =====
  describe('Document List Rendering', () => {
    test('renders all documents', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    test('renders document titles', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      
      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('Cover Letter')).toBeInTheDocument();
      expect(screen.getByText('Transcript')).toBeInTheDocument();
    });

    test('renders document filenames as links', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);
      expect(links[0]).toHaveTextContent('John_Doe_Resume.pdf');
      expect(links[1]).toHaveTextContent('Cover_Letter.docx');
      expect(links[2]).toHaveTextContent('Transcript.pdf');
    });

    test('renders correct download links (hrefs)', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/documents/resume.pdf');
      expect(links[1]).toHaveAttribute('href', '/documents/cover-letter.docx');
      expect(links[2]).toHaveAttribute('href', '/documents/transcript.pdf');
    });
  });

  // ===== Empty/Null Tests =====
  describe('Empty and Null Documents', () => {
    test('renders empty list when documents array is empty', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [],
      };
      
      render(<Documents {...props} />);
      
      const listItems = screen.queryAllByRole('listitem');
      expect(listItems).toHaveLength(0);
      expect(screen.getByText('Applicant Documents')).toBeInTheDocument();
    });

    test('renders without crashing when documents is undefined', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: undefined,
      };
      
      render(<Documents {...props} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('renders without crashing when documents is null', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: null,
      };
      
      render(<Documents {...props} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });
  });

  // ===== Single Document Tests =====
  describe('Single Document', () => {
    test('renders single document', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            title: 'Certificate',
            filename: 'Certificate.pdf',
            downloadLink: '/documents/certificate.pdf',
          },
        ],
      };
      
      render(<Documents {...props} />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      expect(screen.getByText('Certificate')).toBeInTheDocument();
      expect(screen.getByText('Certificate.pdf')).toBeInTheDocument();
    });
  });

  // ===== Optional Chaining Tests =====
  describe('Optional Chaining Behavior', () => {
    test('handles missing document title gracefully', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            filename: 'file.pdf',
            downloadLink: '/documents/file.pdf',
          },
        ],
      };
      
      render(<Documents {...props} />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      expect(screen.getByText('file.pdf')).toBeInTheDocument();
    });

    test('handles missing document filename gracefully', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            title: 'Resume',
            downloadLink: '/documents/resume.pdf',
          },
        ],
      };
      
      render(<Documents {...props} />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    test('renders null document in array without crashing', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            title: 'Resume',
            filename: 'resume.pdf',
            downloadLink: '/documents/resume.pdf',
          },
          null,
          {
            title: 'Cover Letter',
            filename: 'letter.docx',
            downloadLink: '/documents/letter.docx',
          },
        ],
      };
      
      render(<Documents {...props} />);
      
      // Should still render the valid documents
      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('Cover Letter')).toBeInTheDocument();
    });
  });

  // ===== Document Properties Tests =====
  describe('Document Properties', () => {
    test('renders documents with special characters in filenames', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            title: 'Document',
            filename: 'John_Doe-CV (2024).pdf',
            downloadLink: '/documents/cv.pdf',
          },
        ],
      };
      
      render(<Documents {...props} />);
      expect(screen.getByText('John_Doe-CV (2024).pdf')).toBeInTheDocument();
    });

    test('renders documents with special characters in titles', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            title: 'Document & Report',
            filename: 'document.pdf',
            downloadLink: '/documents/document.pdf',
          },
        ],
      };
      
      render(<Documents {...props} />);
      expect(screen.getByText('Document & Report')).toBeInTheDocument();
    });

    test('renders documents with URLs in download links', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            title: 'Resume',
            filename: 'resume.pdf',
            downloadLink: 'https://example.com/documents/resume.pdf',
          },
        ],
      };
      
      render(<Documents {...props} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com/documents/resume.pdf');
    });

    test('renders documents with relative and absolute paths', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            title: 'Doc1',
            filename: 'doc1.pdf',
            downloadLink: '/documents/doc1.pdf',
          },
          {
            title: 'Doc2',
            filename: 'doc2.pdf',
            downloadLink: '../documents/doc2.pdf',
          },
        ],
      };
      
      render(<Documents {...props} />);
      
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', '/documents/doc1.pdf');
      expect(links[1]).toHaveAttribute('href', '../documents/doc2.pdf');
    });
  });

  // ===== Structure Tests =====
  describe('DOM Structure', () => {
    test('renders correct DOM structure for document list', () => {
      const props = {
        ...DEFAULT_PROPS,
        documents: [
          {
            title: 'Resume',
            filename: 'resume.pdf',
            downloadLink: '/documents/resume.pdf',
          },
        ],
      };
      
      render(<Documents {...props} />);
      
      const listItems = screen.getAllByRole('listitem');
      const lineItems = listItems[0].querySelectorAll('.LineItemItem');
      
      expect(lineItems).toHaveLength(2);
      expect(lineItems[0]).toHaveTextContent('Resume');
      expect(lineItems[1].querySelector('a')).toHaveTextContent('resume.pdf');
    });

    test('renders list with proper semantic HTML', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      
      const ul = screen.getByRole('list');
      expect(ul.tagName).toBe('UL');
      
      const listItems = screen.getAllByRole('listitem');
      listItems.forEach(item => {
        expect(item.tagName).toBe('LI');
      });
    });
  });

  // ===== Style Props Tests =====
  describe('Style Props', () => {
    test('renders with empty style object', () => {
      const props = {
        ...DEFAULT_PROPS,
        style: {},
      };
      
      render(<Documents {...props} />);
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
    });

    test('renders with custom background color', () => {
      const customStyle = { backgroundColor: 'red' };
      const props = {
        ...DEFAULT_PROPS,
        style: customStyle,
      };
      
      render(<Documents {...props} />);
      const container = screen.getByTestId('info-card').parentElement;
      expect(container).toHaveStyle('backgroundColor: red');
    });

    test('renders with multiple style properties', () => {
      const customStyle = {
        backgroundColor: 'lightblue',
        padding: '10px',
        margin: '5px',
      };
      const props = {
        ...DEFAULT_PROPS,
        style: customStyle,
      };
      
      render(<Documents {...props} />);
      const container = screen.getByTestId('info-card').parentElement;
      
      expect(container).toHaveStyle(customStyle);
    });
  });

  // ===== Integration Tests =====
  describe('Integration', () => {
    test('renders complete document list with all components', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      
      expect(screen.getByTestId('info-card')).toBeInTheDocument();
      expect(screen.getByText('Applicant Documents')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      expect(screen.getAllByRole('link')).toHaveLength(3);
    });

    test('renders minimal document data', () => {
      const minimalProps = {
        documents: [
          {
            title: 'Doc',
            filename: 'doc.pdf',
            downloadLink: '/doc.pdf',
          },
        ],
        style: {},
      };
      
      render(<Documents {...minimalProps} />);
      
      expect(screen.getByText('Doc')).toBeInTheDocument();
      expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    });

    test('maintains document order in list', () => {
      render(<Documents {...DEFAULT_PROPS} />);
      
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveTextContent('John_Doe_Resume.pdf');
      expect(links[1]).toHaveTextContent('Cover_Letter.docx');
      expect(links[2]).toHaveTextContent('Transcript.pdf');
    });
  });
});
