import {
    OWM_TEAM,
    COMMITTEE_CHAIR,
    COMMITTEE_MEMBER_ROLE,
    COMMITTEE_MEMBER_VOTING,
    COMMITTEE_MEMBER_NON_VOTING,
    COMMITTEE_EXEC_SEC,
    COMMITTEE_HR_SPECIALIST,
    COMMITTEE_EDI_REPRESENTATIVE,
    APPLICANT,
    COMMITTEE_MEMBER_READ_ONLY,
} from './Roles';

describe('Roles constants', () => {
    test('should have correct value for OWM_TEAM', () => {
        expect(OWM_TEAM).toBe('x_g_nci_app_tracke.vacancy_manager');
    });

    test('should have correct value for COMMITTEE_CHAIR', () => {
        expect(COMMITTEE_CHAIR).toBe('Chair');
    });

    test('should have correct value for COMMITTEE_MEMBER_ROLE', () => {
        expect(COMMITTEE_MEMBER_ROLE).toBe('x_g_nci_app_tracke.committee_member');
    });

    test('should have correct value for COMMITTEE_MEMBER_VOTING', () => {
        expect(COMMITTEE_MEMBER_VOTING).toBe('Member');
    });

    test('should have correct value for COMMITTEE_MEMBER_NON_VOTING', () => {
        expect(COMMITTEE_MEMBER_NON_VOTING).toBe('Member (non-voting)');
    });

    test('should have correct value for COMMITTEE_EXEC_SEC', () => {
        expect(COMMITTEE_EXEC_SEC).toBe('Executive Secretary (non-voting)');
    });

    test('should have correct value for COMMITTEE_HR_SPECIALIST', () => {
        expect(COMMITTEE_HR_SPECIALIST).toBe('HR Specialist (non-voting)');
    });

    test('should have correct value for COMMITTEE_EDI_REPRESENTATIVE', () => {
        expect(COMMITTEE_EDI_REPRESENTATIVE).toBe('EDI Representative (non-voting)');
    });

    test('should have correct value for APPLICANT', () => {
        expect(APPLICANT).toBe('APPLICANT');
    });

    test('should have correct value for COMMITTEE_MEMBER_READ_ONLY', () => {
        expect(COMMITTEE_MEMBER_READ_ONLY).toBe('Member (read-only)');
    });
});