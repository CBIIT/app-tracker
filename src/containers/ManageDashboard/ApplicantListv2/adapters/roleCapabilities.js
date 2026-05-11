import { OWM_TEAM } from '../../../../constants/Roles';

export const getRoleCapabilities = (userRoles = [], userCommitteeRole = '') => {
	const isVacancyManager = userRoles.includes(OWM_TEAM);

	return {
		isVacancyManager,
		canUseRecommendationSplit: isVacancyManager,
		canCollectReferences: isVacancyManager,
		canSendRegretEmail: isVacancyManager,
		canViewReferenceStatus: isVacancyManager,
		canViewOtherComments: isVacancyManager,
		canViewCommitteeComments: !!userCommitteeRole || isVacancyManager,
		canEditCommitteeComments: !!userCommitteeRole && !isVacancyManager,
	};
};
