import { OWM_TEAM, COMMITTEE_HR_SPECIALIST } from '../../../constants/Roles';
export const isAllowedToVacancyManagerTriage = (
	roles,
	allowHrSpecialistTriage
) => {
	return (
		roles.includes(OWM_TEAM) ||
		(allowHrSpecialistTriage && roles.includes(COMMITTEE_HR_SPECIALIST))
	);
};
