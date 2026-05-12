import { OWM_TEAM, COMMITTEE_CHAIR } from '../../../../constants/Roles';

export const getRoleCapabilities = (userRoles = [], userCommitteeRole = '') => {
	const isVacancyManager = userRoles.includes(OWM_TEAM);
	const isCommitteeChair = userCommitteeRole === COMMITTEE_CHAIR;

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
	};
};
