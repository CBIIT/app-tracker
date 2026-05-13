/**
 * workflowRouter.js
 * 
 * VIEW ROUTING LOGIC for the applicant management workflow.
 * 
 * RESPONSIBILITY:
 * Maps vacancy state + other context to the appropriate view component.
 * Single source of truth for which UI to display at each stage.
 * 
 * ROUTING LOGIC:
 * For ROLLING_CLOSE vacancies:
 *   - Ignores vacancy state; instead uses the 'filter' parameter (active tab/slice)
 *   - Allows users to manually switch between all stages without state transitions
 *   - Each tab maps to a view (Triage, Scoring, Review, Voting)
 * 
 * For standard vacancies:
 *   - Uses vacancy state directly to determine which view to show
 *   - Single path through workflow (Triage -> Scoring -> Review -> Voting)
 *   - No user control over stage switching
 * 
 * VIEW COMPONENTS:
 * - TriageView: Initial screening and triage decisions
 * - IndividualScoringView: Evaluator scoring and Top 25 selection
 * - CommitteeReviewView: Committee voting and discussion
 * - VotingCompleteView: Final results and offer stage
 */

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

/**
 * WORKFLOW ROUTE RESOLVER
 * 
 * @param {Object} options - Routing context
 * @param {string} options.vacancyState - The current vacancy processing state
 * @param {boolean} options.isRollingClose - True if this is a rolling close vacancy
 * @param {Object} options.tenantCaps - Organization capabilities (may influence view selection)
 * @param {string} options.filter - Active tab/slice for rolling close vacancies
 * 
 * @returns {Component} The view component to render
 *   Returns null if state cannot be resolved (safe fallback for loading states)
 */
export function getWorkflowView({
	vacancyState,
	isRollingClose,
	tenantCaps,
	filter,
}) {
	/**
	 * ROLLING CLOSE ROUTING
	 * Special mode where user can navigate between all stages within the same view.
	 * 'filter' parameter (also called 'slice' or 'tab') determines which stage to show.
	 * 
	 * Filter values map to application states:
	 * - APP_TRIAGE -> TriageView
	 * - SCORING -> IndividualScoringView
	 * - IN_REVIEW -> CommitteeReviewView
	 * - REVIEW_COMPLETE -> VotingCompleteView
	 */
	if (isRollingClose || vacancyState === ROLLING_CLOSE) {
		/**
		 * User is viewing the Triage tab
		 * Initial screening of applicants before scoring begins
		 */
		if (filter === APP_TRIAGE) {
			return TriageView;
		}
		/**
		 * User is viewing the Individual Scoring tab
		 * Evaluators provide individual scores and recommendations
		 */
		if (filter === SCORING) {
			return IndividualScoringView;
		}
		/**
		 * User is viewing the Committee Review tab
		 * Committee members vote and make hiring recommendations
		 */
		if (filter === IN_REVIEW) {
			return CommitteeReviewView;
		}
		/**
		 * User is viewing the Voting Complete tab
		 * Final stage after committee voting is finished
		 */
		if (filter === REVIEW_COMPLETE) {
			return VotingCompleteView;
		}
		/**
		 * Default fallback if no tab is set (shouldn't happen in normal flow)
		 */
		return TriageView;
	} else {
		/**
		 * STANDARD VACANCY ROUTING
		 * Single-path workflow based on vacancy state.
		 * Vacancy transitions through states automatically as stages progress.
		 */

		/**
		 * Vacancy is in initial triage stage
		 * Users perform initial screening, triage decisions
		 */
		if (vacancyState === TRIAGE) {
			return TriageView;
		}

		/**
		 * Vacancy is in individual scoring stage
		 * Evaluators provide individual scores, make recommendations
		 */
		if (vacancyState === INDIVIDUAL_SCORING_IN_PROGRESS) {
			return IndividualScoringView;
		}

		/**
		 * Vacancy is in committee review stage
		 * Committee members vote and make final hiring recommendations
		 */
		if (vacancyState === COMMITTEE_REVIEW_IN_PROGRESS) {
			return CommitteeReviewView;
		}

		/**
		 * Vacancy is in voting complete stage
		 * Process is finished, viewing final results
		 */
		if (vacancyState === VOTING_COMPLETE) {
			return VotingCompleteView;
		}
	}

	/**
	 * SAFE DEFAULT: Return null component
	 * Used during data loading or if state cannot be resolved.
	 * Keeps render tree safe during transient states.
	 */
	return () => null;
}
