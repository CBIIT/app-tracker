import * as ApplicationStates from './ApplicationStates';

describe('ApplicationStates constants', () => {
    it('should have the correct value for APP_TRIAGE', () => {
        expect(ApplicationStates.APP_TRIAGE).toBe('triage');
    });

    it('should have the correct value for SCORING', () => {
        expect(ApplicationStates.SCORING).toBe('scoring');
    });

    it('should have the correct value for IN_REVIEW', () => {
        expect(ApplicationStates.IN_REVIEW).toBe('in_review');
    });

    it('should have the correct value for REVIEW_COMPLETE', () => {
        expect(ApplicationStates.REVIEW_COMPLETE).toBe('review_complete');
    });

    it('should have the correct value for COMPLETED', () => {
        expect(ApplicationStates.COMPLETED).toBe('completed');
    });
});