import TriageView from './states/triage';
import IndividualScoringView from './states/individual-scoring';
import CommitteeReviewView from './states/committee-review';
import VotingComplete from './states/voting-complete';

import RcTriageView from './rolling-close/triage';
import RcIndividualScoringView from './rolling-close/individual-scoring';
import RcCommitteeReviewView from './rolling-close/committee-review';
import RcVotingCompleteView from './rolling-close/voting-complete';

export function getWorkflowComponent({
	vacancyState,
	isRollingClose,
	tenantCaps,
}) {
	if (tenantCaps.maxProgressState === 'individual_scoring') {
		if (isRollingClose) {
			if (vacancyState === 'rolling_close_triage') {
				return RcTriageView;
			}
			return RcIndividualScoringView;
		}
		if (vacancyState === 'triage') {
			return TriageView;
		}
		return IndividualScoringView;
	}

	if (isRollingClose) {
		if (vacancyState === 'rolling_close_triage') {
			return RcTriageView;
		}
		if (vacancyState === 'rolling_close_scoring') {
			return RcIndividualScoringView;
		}
		if (vacancyState === 'rolling_close_in_review') {
			return RcCommitteeReviewView;
		}
		return RcVotingCompleteView;
	}

	if (vacancyState === 'triage') {
		return TriageView;
	}
	if (vacancyState === 'individual_scoring_in_progress') {
		return IndividualScoringView;
	}
	if (vacancyState === 'committee_review_in_progress') {
		return CommitteeReviewView;
	}
	return VotingCompleteView;
}
