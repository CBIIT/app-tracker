import * as Routes from './Routes';

describe('Routes constants', () => {
    it('should have the correct value for MANAGE_APPLICATION', () => {
        expect(Routes.MANAGE_APPLICATION).toBe('/manage/application/');
    });

    it('should have the correct value for EDIT_APPLICATION', () => {
        expect(Routes.EDIT_APPLICATION).toBe('/apply/edit/');
    });

    it('should have the correct value for MANAGE_VACANCY', () => {
        expect(Routes.MANAGE_VACANCY).toBe('/manage/vacancy/');
    });

    it('should have the correct value for CREATE_VACANCY', () => {
        expect(Routes.CREATE_VACANCY).toBe('/create-vacancy');
    });

    it('should have the correct value for EDIT_VACANCY', () => {
        expect(Routes.EDIT_VACANCY).toBe('/manage/vacancy/edit/');
    });

    it('should have the correct value for CHAIR_DASHBOARD', () => {
        expect(Routes.CHAIR_DASHBOARD).toBe('/chair-dashboard/');
    });

    it('should have the correct value for VACANCY_DASHBOARD', () => {
        expect(Routes.VACANCY_DASHBOARD).toBe('/vacancy-dashboard');
    });

    it('should have the correct value for COMMITTEE_DASHBOARD', () => {
        expect(Routes.COMMITTEE_DASHBOARD).toBe('/committee-dashboard/');
    });

    it('should have the correct value for APPLICANT_DASHBOARD', () => {
        expect(Routes.APPLICANT_DASHBOARD).toBe('/applicant-dashboard/');
    });

    it('should have the correct value for APPLY', () => {
        expect(Routes.APPLY).toBe('/apply/');
    });

    it('should have the correct value for VIEW_APPLICATION', () => {
        expect(Routes.VIEW_APPLICATION).toBe('/apply/view/');
    });

    it('should have the correct value for REGISTER_OKTA', () => {
        expect(Routes.REGISTER_OKTA).toBe('/register-okta');
    });

    it('should have the correct value for EDIT_DRAFT', () => {
        expect(Routes.EDIT_DRAFT).toBe('/manage/edit/draft/');
    });

    it('should have the correct value for VIEW_VACANCY', () => {
        expect(Routes.VIEW_VACANCY).toBe('/vacancy/');
    });

    it('should have the correct value for CREATE_PROFILE', () => {
        expect(Routes.CREATE_PROFILE).toBe('/create-profile');
    });

    it('should have the correct value for PROFILE', () => {
        expect(Routes.PROFILE).toBe('/profile/');
    });

    it('should have the correct value for EDIT_PROFILE', () => {
        expect(Routes.EDIT_PROFILE).toBe('manage/profile/edit/');
    });

    it('should have the correct value for TENANT_CHECK_ROUTES', () => {
        expect(Routes.TENANT_CHECK_ROUTES).toStrictEqual(['/create-vacancy','/manage/vacancy/edit/','/manage/edit/draft/','/manage/vacancy/']);
    });
});