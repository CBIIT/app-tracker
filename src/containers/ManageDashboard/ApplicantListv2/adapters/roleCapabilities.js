import { OWM_TEAM, COMMITTEE_CHAIR, COMMITTEE_MEMBER_VOTING, COMMITTEE_MEMBER_READ_ONLY, COMMITTEE_HR_SPECIALIST, COMMITTEE_EXEC_SEC } from '../../../../constants/Roles';

export const getRoleCapabilities = (userRoles = [], userCommitteeRole = '') => {
	const isVacancyManager = userRoles.includes(OWM_TEAM) || userCommitteeRole === COMMITTEE_EXEC_SEC;
	const isCommitteeChair = userCommitteeRole === COMMITTEE_CHAIR;
	const isCommitteeMember = userCommitteeRole === COMMITTEE_MEMBER_VOTING;
	const isCommitteeRead = userCommitteeRole === COMMITTEE_MEMBER_READ_ONLY;
	const isHrSpecialist = userCommitteeRole === COMMITTEE_HR_SPECIALIST;

	return {
		isVacancyManager,
		isCommitteeChair,
		canViewTriageFilter: isVacancyManager || isCommitteeChair,
		canUseRecommendationSplit: isVacancyManager,
		canCollectReferences: isVacancyManager,
		canSendRegretEmail: isVacancyManager,
		canViewReferenceStatus: isVacancyManager,
		canViewOtherComments: isVacancyManager,
		canViewCommitteeComments: !!userCommitteeRole || isVacancyManager,
		canEditCommitteeComments: !!userCommitteeRole && !isVacancyManager,
		singleTable: !!isVacancyManager,
	};
};
