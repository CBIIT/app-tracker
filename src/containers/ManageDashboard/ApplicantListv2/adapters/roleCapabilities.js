import {
	OWM_TEAM,
	COMMITTEE_CHAIR,
	COMMITTEE_MEMBER_VOTING,
	COMMITTEE_MEMBER_NON_VOTING,
	COMMITTEE_MEMBER_READ_ONLY,
	COMMITTEE_HR_SPECIALIST,
	COMMITTEE_EXEC_SEC,
} from '../../../../constants/Roles';

export const getRoleCapabilities = (userRoles = [], userCommitteeRole = '') => {
	const isVacancyManager =
		userRoles.includes(OWM_TEAM) || userCommitteeRole === COMMITTEE_EXEC_SEC;
	const isCommitteeChair = userCommitteeRole === COMMITTEE_CHAIR;
	const isCommitteeMember = userCommitteeRole === COMMITTEE_MEMBER_VOTING;
	const isCommitteeNonVoting =
		userCommitteeRole === COMMITTEE_MEMBER_NON_VOTING;
	const isCommitteeReadOnly =
		userCommitteeRole === COMMITTEE_MEMBER_READ_ONLY;
	const isHrSpecialist = userCommitteeRole === COMMITTEE_HR_SPECIALIST;
	const canReviewInterviewDecision = isVacancyManager || isCommitteeChair;
	const canViewCommitteeComments = isVacancyManager || isCommitteeChair;

	return {
		isVacancyManager,
		isCommitteeChair,
		isCommitteeMember,
		isCommitteeNonVoting,
		isCommitteeReadOnly,
		isHrSpecialist,
		canViewTriageFilter:
			isVacancyManager || isCommitteeChair || isHrSpecialist,
		canUseRecommendationSplit: isVacancyManager,
		canCollectReferences: isVacancyManager,
		canSendRegretEmail: isVacancyManager,
		canViewReferenceStatus: isVacancyManager,
		canViewOtherComments: isVacancyManager || isCommitteeChair,
		canViewCommitteeComments,
		canEditCommitteeComments: canViewCommitteeComments,
		canReviewInterviewDecision,
		singleTable: !isVacancyManager,
	};
};
