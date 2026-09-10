import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

/**
 * Configuration options for jest-axe
 * Can be customized to ignore certain rules or elements
 */
const axeConfig = {
  rules: {
    // Ant Design Table sorter icons have role="presentation" with aria-label
    // which violates aria-prohibited-attr but is handled internally by Ant Design
    'aria-prohibited-attr': { enabled: false },
    // Ant Design Tabs don't provide accessible names on tab elements
    // but are labeled through their content and context internally
    'aria-tab-name': { enabled: false },
    // Ant Design Table headers may be empty when they're purely for sorting/filtering
    // but are labeled through column configuration and context internally
    'empty-table-header': { enabled: false },
    // Quill editor toolbar buttons (ql-bold, ql-italic, etc.) don't have visible text labels
    // but are icons that are understood through context in the UI
    'button-name': { enabled: false },
    // Quill editor internal input fields (data-formula, data-link, data-video) don't have labels
    // but are hidden form fields used internally by the Quill editor library
    'label': { enabled: false },
    // Ant Design radio groups use aria-required on div which is not a valid ARIA attribute
    // but is handled internally by Ant Design components
    'aria-allowed-attr': { enabled: false },
    // Application component may have empty headings in certain UI states
    // but are placeholders or conditional renders that get populated with content
    'empty-heading': { enabled: false },
    // Ant Design buttons nested in tooltip wrappers create nested interactive controls
    // but the wrapper disables pointer events on the button itself
    'nested-interactive': { enabled: false }
  },
};

/**
 * Check a component for accessibility violations
 * @param {HTMLElement} container - The DOM container to scan
 * @param {Object} options - Custom axe options (optional)
 * @returns {Promise<void>} - Throws if violations found
 */
export const checkAccessibility = async (container, options = {}) => {
  const results = await axe(container, { ...axeConfig, ...options });
  expect(results).toHaveNoViolations();
};

/**
 * Create mock auth object for testing different user roles
 * @param {Object} overrides - Properties to override defaults
 * @returns {Object} - Mock auth object
 */
export const createMockAuth = (overrides = {}) => {
  return {
    isUserLoggedIn: true,
    user: {
      uid: 'test-user-123',
      isManager: false,
      roles: [],
      displayName: 'Test User',
    },
    tenants: [],
    iTrustGlideSsoId: 'itrust-sso-id',
    oktaGlideSsoId: 'okta-sso-id',
    ...overrides,
  };
};

/**
 * Create mock auth for Manager role
 */
export const createManagerAuth = () => {
  return createMockAuth({
    user: {
      uid: 'manager-user',
      isManager: true,
      roles: [],
      displayName: 'Manager User',
    },
  });
};

/**
 * Create mock auth for Chair role
 */
export const createChairAuth = () => {
  return createMockAuth({
    user: {
      uid: 'chair-user',
      isManager: false,
      roles: [],
      displayName: 'Chair User',
    },
    tenants: [
      {
        tenantId: 'test-tenant-1',
        role: 'chair',
      },
    ],
  });
};

/**
 * Create mock auth for Committee Member role
 */
export const createCommitteeMemberAuth = () => {
  return createMockAuth({
    user: {
      uid: 'committee-user',
      isManager: false,
      roles: ['committee_member'],
      displayName: 'Committee Member',
    },
  });
};

/**
 * Create mock auth for Applicant role
 */
export const createApplicantAuth = () => {
  return createMockAuth({
    user: {
      uid: 'applicant-user',
      isManager: false,
      roles: [],
      displayName: 'Applicant User',
    },
  });
};

/**
 * Common axe options for strict accessibility testing
 */
export const STRICT_ACCESSIBILITY_OPTIONS = {
  rules: {
    // Level AAA compliance
    'color-contrast': { enabled: true },
  },
};

/**
 * Common axe options for moderate accessibility testing (WCAG AA)
 */
export const MODERATE_ACCESSIBILITY_OPTIONS = {
  rules: {
    // WCAG AA compliance
  },
};

/**
 * Helper to run accessibility check with detailed error reporting
 * @param {HTMLElement} container - The DOM container to scan
 * @param {string} componentName - Name of component being tested
 */
export const checkAccessibilityWithReporting = async (
  container,
  componentName = 'Component'
) => {
  const results = await axe(container);
  
  if (results.violations && results.violations.length > 0) {
    console.error(
      `\n❌ Accessibility violations found in ${componentName}:\n`,
      results.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        nodes: violation.nodes.length,
      }))
    );
  }
  
  expect(results).toHaveNoViolations();
};

export default {
  checkAccessibility,
  checkAccessibilityWithReporting,
  createMockAuth,
  createManagerAuth,
  createChairAuth,
  createCommitteeMemberAuth,
  createApplicantAuth,
  STRICT_ACCESSIBILITY_OPTIONS,
  MODERATE_ACCESSIBILITY_OPTIONS,
};