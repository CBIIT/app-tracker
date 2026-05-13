/**
 * ApplicantListv2.js
 * 
 * PRIMARY ORCHESTRATOR for the entire applicant management workflow.
 * This component serves as the central hub that coordinates:
 * - Data fetching and state management
 * - User authentication and role-based access control
 * - Workflow routing and view selection
 * - Multi-stage vacancy handling (including Rolling Close mode)
 * 
 * CORE RESPONSIBILITIES:
 * 1. Determines user capabilities based on roles and tenant settings
 * 2. Selects which data hook (split vs non-split) should fetch applicants
 * 3. Routes to the appropriate view component based on vacancy state
 * 4. Manages query state (pagination, search, sorting, filtering) across all views
 * 5. Handles Rolling Close vacancies with tabbed interface for switching stages
 * 6. Prevents duplicate API calls by enabling only one data hook at a time
 * 
 * DATA FLOW:
 * 1. Component receives vacancy context from parent (state, tenant, roles)
 * 2. Determines eligible data hook(s) based on user role and vacancy stage
 * 3. Selects appropriate view component via workflow router
 * 4. Unified data API passed to view (abstracts hook source)
 * 5. User interactions in view -> handleTableChange() -> active hook -> API call -> state update -> re-render
 * 
 * PERMISSION LEVELS:
 * - Vacancy Manager: Can view split tables (recommended vs non-recommended)
 * - Committee Member: Single applicant list only
 * - Department Chair: Depends on tenant configuration
 * 
 * VACANCY STATES:
 * - TRIAGE: Initial screening, always uses single table (no split)
 * - INDIVIDUAL_SCORING_IN_PROGRESS: Evaluators scoring; supports split mode for managers
 * - COMMITTEE_REVIEW_IN_PROGRESS: Committee voting; supports split mode
 * - VOTING_COMPLETE: Final stage after voting ends
 * - ROLLING_CLOSE: Special mode combining all stages with user-controlled tabs
 */

import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkflowView } from './workflowRouter';
import { getRoleCapabilities } from './adapters/roleCapabilities';
import { getTenantCapabilities } from './adapters/tenantWorkflowCapabilities';
import { useSplitApplicantTables } from './hooks/useSplitApplicantTables';
import { useNonSplitApplicants } from './hooks/useNonSplitApplicants';
import { ROLLING_CLOSE, TRIAGE } from '../../../constants/VacancyStates';
import './ApplicantListv2.css';

const ApplicantListv2 = (props) => {
	/**
	 * EXTRACT VACANCY ID FROM URL
	 * The vacancy sys_id is the unique identifier for the vacancy being viewed.
	 * This ID is passed to all data hooks and API calls.
	 * Sourced from React Router route parameters (e.g., /vacancy/:sysId).
	 */
	const { sysId } = useParams();
	/**
	 * ROLLING CLOSE STATE
	 * For Rolling Close vacancies, users can navigate between Triage, Scoring, Review, and Voting
	 * within the same screen using tabs/radio buttons. This state tracks which stage is active.
	 * Non-rolling vacancies ignore this; they follow the single vacancy state.
	 * Default to TRIAGE if not specified.
	 */
	const [activeSlice, setActiveSlice] = useState(props.filter || TRIAGE);

	/**
	 * USER ROLE CAPABILITIES
	 * Convert user roles (e.g., 'Hiring Manager', 'Committee Member') into feature flags.
	 * Examples: isVacancyManager, canUseRecommendationSplit, canViewTriageFilter, etc.
	 * These flags control what UI elements and actions are available to the user.
	 * 
	 * See adapters/roleCapabilities.js for the mapping of roles to capabilities.
	 * Memoized to prevent expensive recalculations on every parent re-render.
	 */
	const roleCaps = useMemo(
		() => getRoleCapabilities(props.userRoles, props.userCommitteeRole),
		[props.userRoles, props.userCommitteeRole]
	);

	/**
	 * ORGANIZATION (TENANT) CAPABILITIES
	 * Org-level settings that control workflow behavior and feature availability.
	 * Examples: approval chains, scoring modes, notification settings, etc.
	 * Combined with role capabilities to determine the final feature set.
	 * 
	 * See adapters/tenantWorkflowCapabilities.js for the configuration options.
	 * Memoized to prevent expensive recalculations on every parent re-render.
	 */
	const tenantCaps = useMemo(
		() =>
			getTenantCapabilities(props.vacancyTenant, props.tenantProperties || []),
		[props.vacancyTenant, props.tenantProperties]
	);

	/**
	 * VACANCY TYPE DETECTION
	 * Determine if this is a rolling close vacancy (multi-stage mode).
	 */
	const isRollingClose = props.vacancyState === ROLLING_CLOSE;
	
	/**
	 * ACTIVE STAGE FOR ROLLING CLOSE
	 * For rolling close vacancies, determine which stage is currently visible.
	 * For standard vacancies, use the vacancy state directly.
	 */
	const currentSlice = props.filter || activeSlice;

	/**
	 * TRIAGE STAGE DETECTION
	 * Triage always requires single-table mode (no split) because:
	 * - Triage is the initial screening stage
	 * - Recommendations are assigned after triage decisions
	 * - All applicants are processed before splitting into recommended/non-recommended
	 * 
	 * This is true even for managers with split permissions.
	 */
	const isTriageStage =
		props.vacancyState === TRIAGE ||
		(isRollingClose && currentSlice === TRIAGE);

	/**
	 * SPLIT TABLE ELIGIBILITY
	 * Only specific roles and tenants support viewing split applicant tables.
	 * Check if user has either:
	 * - Vacancy Manager role (can always split), OR
	 * - Organization permission to use recommendation split
	 */
	const canUseSplit =
		roleCaps.canUseRecommendationSplit || roleCaps.isVacancyManager;

	/**
	 * HOOK ENABLEMENT GATES - CRITICAL: Prevent Duplicate API Calls
	 * Only ONE data hook should be fetching at any time.
	 * 
	 * Split hook enabled when:
	 * - User has split permissions (canUseSplit = true) AND
	 * - Not in triage stage (isTriageStage = false)
	 * 
	 * Non-split hook enabled when:
	 * - In triage stage (isTriageStage = true) OR
	 * - User cannot use split (canUseSplit = false)
	 * 
	 * This ensures only one hook is active and only one set of API calls fires.
	 */
	const splitEnabled = !isTriageStage && canUseSplit;
	const nonSplitEnabled = isTriageStage || !canUseSplit;

	/**
	 * SPLIT APPLICANTS DATA HOOK
	 * Used by Vacancy Managers and users with split permissions.
	 * Fetches TWO applicant lists in parallel:
	 * - Recommended applicants (users marked as recommended)
	 * - Non-recommended applicants (all others)
	 * 
	 * Returns data hook interface:
	 * - recommendedApplicants, nonRecommendedApplicants (lists)
	 * - recommendedLoading, nonRecommendedLoading (loading states)
	 * - handleTableChange (event handler for pagination/search/sort/filter)
	 * - refresh (re-fetch current query)
	 * - initializeForVacancy (reset query state)
	 * 
	 * Only fetches when enabled=true. Disabled during triage.
	 */
	const splitTables = useSplitApplicantTables({
		sysId,
		vacancyState: props.vacancyState,
		enabled: splitEnabled,
	});

	/**
	 * NON-SPLIT APPLICANTS DATA HOOK
	 * Used by Committee Members, Chairs, and other non-manager roles.
	 * Fetches a SINGLE applicant list (all recommended candidates).
	 * 
	 * Returns data hook interface:
	 * - applicants (single list)
	 * - loading (loading state)
	 * - handleTableChange (event handler for pagination/search/sort/filter)
	 * - refresh (re-fetch current query)
	 * - initializeForVacancy (reset query state)
	 * 
	 * Disabled when split mode is active to prevent duplicate network requests.
	 */
	const nonSplitApplicants = useNonSplitApplicants({
		sysId,
		vacancyState: props.vacancyState,
		enabled: nonSplitEnabled,
	});

	/**
	 * UNIFIED DATA API
	 * Creates a single interface regardless of which hook is active.
	 * Views receive this object and don't need to know whether data comes from split or non-split hook.
	 * 
	 * If non-split mode: returns nonSplitApplicants object
	 * If split mode: returns splitTables object
	 * 
	 * This abstraction makes views simpler and more testable.
	 */
	const dataApi = isTriageStage || !canUseSplit ? nonSplitApplicants : splitTables;

	/**
	 * ROLLING CLOSE CLIENT-SIDE FILTERING HELPER
	 * Rolling Close vacancies show all applicants in one view but allow filtering by state.
	 * This function filters applicants by their current processing stage.
	 * 
	 * Non-rolling vacancies return applicants unfiltered (server-side filtering via API).
	 * Rolling close vacancies filter client-side AFTER the API returns.
	 * 
	 * State mappings:
	 * - 'triage' -> Triage stage
	 * - 'scoring' -> Individual scoring stage
	 * - 'in_review' -> Committee review stage
	 * - 'review_complete' or 'completed' -> Voting complete stage
	 */
	const getFilteredApplicants = (applicants, filter) => {
		if (!isRollingClose) {
			return applicants;
		}
		return applicants.filter((applicant) => {
			let applicantState = '';
			switch (applicant.state) {
				case 'triage':
					applicantState = 'triage';
					break;
				case 'scoring':
					applicantState = 'scoring';
					break;
				case 'in_review':
					applicantState = 'in_review';
					break;
				case 'review_complete':
				case 'completed':
					applicantState = 'review_complete';
					break;
			}
			return applicantState === filter;
		});
	};

	/**
	 * COMPUTE FILTERED DATA API FOR ROLLING CLOSE
	 * For Rolling Close vacancies:
	 * - Apply client-side filtering based on current slice (stage)
	 * - Both recommended and non-recommended lists are independently filtered
	 * - Returns new filtered dataApi object
	 * 
	 * For standard vacancies:
	 * - Return dataApi as-is (no client-side filtering needed)
	 * 
	 * Memoized to prevent expensive filtering on every render.
	 * Re-computes only when dataApi, isRollingClose, or currentSlice changes.
	 */
	const filteredDataApi = useMemo(() => {
		if (!isRollingClose) {
			return dataApi;
		}

		const filteredApplicants = getFilteredApplicants(
			dataApi.applicants || [],
			currentSlice
		);

		return {
			...dataApi,
			applicants: filteredApplicants,
			recommendedApplicants: getFilteredApplicants(
				dataApi.recommendedApplicants || [],
				currentSlice
			),
			nonRecommendedApplicants: getFilteredApplicants(
				dataApi.nonRecommendedApplicants || [],
				currentSlice
			),
		};
	}, [dataApi, isRollingClose, currentSlice]);

	/**
	 * HANDLE ROLLING CLOSE TAB/SLICE CHANGE
	 * When user clicks a different tab/radio option in Rolling Close UI:
	 * 1. Update activeSlice state (e.g., TRIAGE -> SCORING)
	 * 2. Reset both data hooks to clear stale query state
	 * 
	 * Why reset hooks?
	 * - If user was on page 5 in Triage, we don't want page 5 in Scoring
	 * - If user was searching for 'John' in Scoring, we don't want that search in Voting
	 * - Each stage should start fresh with page 1, empty search, no filters
	 * 
	 * Both hooks are reset (even the inactive one) in case user switches back.
	 */
	const handleSliceChange = (slice) => {
		setActiveSlice(slice);
		nonSplitApplicants.initializeForVacancy();
		splitTables.initializeForVacancy();
	};

	/**
	 * SELECT VIEW COMPONENT VIA WORKFLOW ROUTER
	 * Route function (workflowRouter.js) determines which view to render based on:
	 * - Current vacancy state (for standard vacancies)
	 * - Active slice (for rolling close vacancies)
	 * - Tenant capabilities (may affect view behavior)
	 * 
	 * Examples:
	 * - TRIAGE state -> TriageView
	 * - INDIVIDUAL_SCORING_IN_PROGRESS -> IndividualScoringView
	 * - COMMITTEE_REVIEW_IN_PROGRESS -> CommitteeReviewView
	 * - VOTING_COMPLETE -> VotingCompleteView
	 * 
	 * Memoized to prevent expensive route lookups on every render.
	 */
	const View = useMemo(
		() =>
			getWorkflowView({
				vacancyState: props.vacancyState,
				filter: props.filter || activeSlice,
				isRollingClose,
				tenantCaps,
			}),
		[props.vacancyState, props.filter, activeSlice, isRollingClose, tenantCaps]
	);

	/**
	 * RENDER SELECTED VIEW
	 * Pass all context to view component:
	 * - sysId: Vacancy ID
	 * - roleCaps: User role permissions
	 * - tenantCaps: Organization settings
	 * - dataApi: Filtered applicant data and handlers (split or non-split)
	 * - splitTables/nonSplitApplicants: Raw hook objects for advanced access
	 * - activeSlice: Current rolling close stage (if applicable)
	 * - onSliceChange: Handler for switching stages (rolling close only)
	 * 
	 * View is responsible for:
	 * - Rendering tables/UI
	 * - Responding to user interactions
	 * - Calling dataApi handlers (pagination, search, sort, filter)
	 */
	return (
		<View
			{...props}
			sysId={sysId}
			roleCaps={roleCaps}
			tenantCaps={tenantCaps}
			dataApi={filteredDataApi}
			nonSplitApplicants={nonSplitApplicants}
			splitTables={splitTables}
			activeSlice={activeSlice}
			onSliceChange={handleSliceChange}
		/>
	);
};

export default ApplicantListv2;
