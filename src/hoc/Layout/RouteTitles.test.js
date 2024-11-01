import { routeTitles } from './RouteTitles';
import { VACANCY_DASHBOARD, CREATE_VACANCY } from '../../constants/Routes';

describe('routeTitles', () => {
    it('should have the correct title for the root path', () => {
        expect(routeTitles['/']).toBe('Specialized Scientific Jobs');
    });

    it('should have the correct title for the CREATE_VACANCY path', () => {
        expect(routeTitles[CREATE_VACANCY]).toBe('Create Vacancy');
        expect(routeTitles[CREATE_VACANCY + '/']).toBe('Create Vacancy');
    });

    it('should have the correct title for the VACANCY_DASHBOARD path', () => {
        expect(routeTitles[VACANCY_DASHBOARD]).toBe('Vacancy Dashboard');
        expect(routeTitles[VACANCY_DASHBOARD + '/']).toBe('Vacancy Dashboard');
    });
});