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
		return TriageView;
	} else {
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

	return () => null;
}
