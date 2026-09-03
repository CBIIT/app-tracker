// Resolves workflow state and filter context to the correct ApplicantListv2 view.
import TriageView from './states/triage/triageView';
import IndividualScoringView from './states/individual-scoring/indivdualScoringView';
import CommitteeReviewView from './states/committee-review/committeeReviewView';
import VotingCompleteView from './states/voting-complete/votingCompleteView';

import {
	APP_TRIAGE,
	SCORING,
	IN_REVIEW,
	REVIEW_COMPLETE,
} from '../../../constants/ApplicationStates';
import {
	TRIAGE,
	INDIVIDUAL_SCORING_IN_PROGRESS,
	COMMITTEE_REVIEW_IN_PROGRESS,
	VOTING_COMPLETE,
	ROLLING_CLOSE,
} from '../../../constants/VacancyStates';

export function getWorkflowView({
	vacancyState,
	isRollingClose,
	tenantCaps,
	filter,
}) {
	// Rolling-close workflows route by active filter tab instead of vacancy state.
	if (isRollingClose || vacancyState === ROLLING_CLOSE) {
		if (filter === APP_TRIAGE) {
			return TriageView;
		}
		if (filter === SCORING) {
			return IndividualScoringView;
		}
		if (filter === IN_REVIEW) {
			return CommitteeReviewView;
		}
		if (filter === REVIEW_COMPLETE) {
			return VotingCompleteView;
		}
		// Defaults to triage when rolling-close filter is missing.
		return TriageView;
	} else {
		// Standard workflows route directly from the vacancy state.
		if (vacancyState === TRIAGE) {
			return TriageView;
		}

		if (vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS) {
			return IndividualScoringView;
		}

		if (vacancyState === COMMITTEE_REVIEW_IN_PROGRESS) {
			return CommitteeReviewView;
		}

		if (vacancyState === VOTING_COMPLETE) {
			return VotingCompleteView;
		}
	}

	// Safe default during transient states.
	return () => null;
}
