import * as VacancyStates from './VacancyStates';

describe('VacancyStates constants', () => {
    it('should have the correct value for TRIAGE', () => {
        expect(VacancyStates.TRIAGE).toBe('triage');
    });

    it('should have the correct value for CHAIR_TRIAGE', () => {
        expect(VacancyStates.CHAIR_TRIAGE).toBe('chair_triage');
    });

    it('should have the correct value for INDIVIDUAL_SCORING_IN_PROGRESS', () => {
        expect(VacancyStates.INDIVIDUAL_SCORING_IN_PROGRESS).toBe('individual_scoring_in_progress');
    });

    it('should have the correct value for INDIVIDUAL_SCORING_COMPLETE', () => {
        expect(VacancyStates.INDIVIDUAL_SCORING_COMPLETE).toBe('individual_scoring_complete');
    });

    it('should have the correct value for COMMITTEE_REVIEW_IN_PROGRESS', () => {
        expect(VacancyStates.COMMITTEE_REVIEW_IN_PROGRESS).toBe('committee_review_in_progress');
    });

    it('should have the correct value for COMMITTEE_REVIEW_COMPLETE', () => {
        expect(VacancyStates.COMMITTEE_REVIEW_COMPLETE).toBe('committee_review_complete');
    });

    it('should have the correct value for VOTING_COMPLETE', () => {
        expect(VacancyStates.VOTING_COMPLETE).toBe('voting_complete');
    });

    it('should have the correct value for ROLLING_CLOSE', () => {
        expect(VacancyStates.ROLLING_CLOSE).toBe('rolling_close');
    });

    it('should have the correct value for LIVE', () => {
        expect(VacancyStates.LIVE).toBe('live');
    });

    it('should have the correct value for FINAL', () => {
        expect(VacancyStates.FINAL).toBe('final');
    });
});