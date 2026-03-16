import { isAllowedToVacancyManagerTriage } from './Permissions';
import { OWM_TEAM, COMMITTEE_HR_SPECIALIST } from '../../../constants/Roles';

describe('isAllowedToVacancyManagerTriage', () => {
    it('should return true if roles include OWM_TEAM', () => {
        const roles = [OWM_TEAM];
        const allowHrSpecialistTriage = false;
        expect(isAllowedToVacancyManagerTriage(roles, allowHrSpecialistTriage)).toBe(true);
    });

    it('should return true if roles include COMMITTEE_HR_SPECIALIST and allowHrSpecialistTriage is true', () => {
        const roles = [COMMITTEE_HR_SPECIALIST];
        const allowHrSpecialistTriage = true;
        expect(isAllowedToVacancyManagerTriage(roles, allowHrSpecialistTriage)).toBe(true);
    });

    it('should return false if roles do not include OWM_TEAM or COMMITTEE_HR_SPECIALIST', () => {
        const roles = ['OTHER_ROLE'];
        const allowHrSpecialistTriage = false;
        expect(isAllowedToVacancyManagerTriage(roles, allowHrSpecialistTriage)).toBe(false);
    });

    it('should return false if roles include COMMITTEE_HR_SPECIALIST but allowHrSpecialistTriage is false', () => {
        const roles = [COMMITTEE_HR_SPECIALIST];
        const allowHrSpecialistTriage = false;
        expect(isAllowedToVacancyManagerTriage(roles, allowHrSpecialistTriage)).toBe(false);
    });

    it('should return true if roles include both OWM_TEAM and COMMITTEE_HR_SPECIALIST regardless of allowHrSpecialistTriage', () => {
        const roles = [OWM_TEAM, COMMITTEE_HR_SPECIALIST];
        const allowHrSpecialistTriage = false;
        expect(isAllowedToVacancyManagerTriage(roles, allowHrSpecialistTriage)).toBe(true);
    });
});