import {
	validateRoleForCurrentTenant,
	isVacancyManager,
	isExecSec,
	isChair,
	isCommitteMember,
	isHrSpecialist,
	atleastOneChair,
} from './RoleValidator';

describe('RoleValidator utilities', () => {
	beforeEach(() => {
		jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('validateRoleForCurrentTenant', () => {
		it('returns null when tenants is undefined', () => {
			expect(
				validateRoleForCurrentTenant(
					'x_g_nci_app_tracke.committee_member',
					'tenant-1',
					undefined
				)
			).toBe(null);
		});

		it('returns true when matching tenant contains the role', () => {
			const tenants = [
				{
					value: 'tenant-1',
					roles: ['x_g_nci_app_tracke.committee_member'],
				},
			];

			expect(
				validateRoleForCurrentTenant(
					'x_g_nci_app_tracke.committee_member',
					'tenant-1',
					tenants
				)
			).toBe(true);
		});

		it('returns false when matching tenant has no roles property', () => {
			const tenants = [{ value: 'tenant-1' }];

			expect(
				validateRoleForCurrentTenant(
					'x_g_nci_app_tracke.committee_member',
					'tenant-1',
					tenants
				)
			).toBe(undefined);
		});

		it('returns false when matching tenant does not include the role', () => {
			const tenants = [
				{
					value: 'tenant-1',
					roles: ['some_other_role'],
				},
			];

			expect(
				validateRoleForCurrentTenant(
					'x_g_nci_app_tracke.committee_member',
					'tenant-1',
					tenants
				)
			).toBe(false);
		});

		it('returns false when tenant is not found', () => {
			const tenants = [
				{
					value: 'tenant-2',
					roles: ['x_g_nci_app_tracke.committee_member'],
				},
			];

			expect(
				validateRoleForCurrentTenant(
					'x_g_nci_app_tracke.committee_member',
					'tenant-1',
					tenants
				)
			).toBe(undefined);
		});
	});

	describe('isVacancyManager', () => {
		it('returns false when tenants is undefined', () => {
			expect(isVacancyManager('tenant-1', undefined)).toBe(false);
		});

		it('returns true when matching tenant has vacancy manager role', () => {
			const roles = [
				'x_g_nci_app_tracke.vacancy_manager',
				'x_g_nci_app_tracke.committee_member',
			];
			const tenants = [{ value: 'tenant-1', roles }];

			expect(isVacancyManager('tenant-1', tenants)).toBe(true);
		});

		it('returns true when role exists outside index 0', () => {
			const tenants = [
				{
					value: 'tenant-1',
					roles: [
						'x_g_nci_app_tracke.committee_member',
						'x_g_nci_app_tracke.vacancy_manager',
					],
				},
			];

			expect(isVacancyManager('tenant-1', tenants)).toBe(true);
		});

		it('returns false when matching tenant roles is not an array', () => {
			const tenants = [{ value: 'tenant-1', roles: null }];

			expect(isVacancyManager('tenant-1', tenants)).toBe(false);
		});

		it('returns false when tenant does not match', () => {
			const tenants = [
				{
					value: 'tenant-2',
					roles: ['x_g_nci_app_tracke.vacancy_manager'],
				},
			];

			expect(isVacancyManager('tenant-1', tenants)).toBe(false);
		});
	});

	describe('isExecSec', () => {
		it('returns false when tenants is undefined', () => {
			expect(isExecSec('tenant-1', undefined)).toBe(false);
		});

		it('returns true when matching tenant is exec sec', () => {
			const tenants = [{ value: 'tenant-1', is_exec_sec: true }];
			expect(isExecSec('tenant-1', tenants)).toBe(true);
		});

		it('returns false when matching tenant is not exec sec', () => {
			const tenants = [{ value: 'tenant-1', is_exec_sec: false }];
			expect(isExecSec('tenant-1', tenants)).toBe(false);
		});
	});

	describe('isChair', () => {
		it('returns false when tenants is undefined', () => {
			expect(isChair('tenant-1', undefined)).toBe(false);
		});

		it('returns true when matching tenant is chair', () => {
			const tenants = [{ value: 'tenant-1', is_chair: true }];
			expect(isChair('tenant-1', tenants)).toBe(true);
		});

		it('returns false when matching tenant is not chair', () => {
			const tenants = [{ value: 'tenant-1', is_chair: false }];
			expect(isChair('tenant-1', tenants)).toBe(false);
		});
	});

	describe('isCommitteMember', () => {
		it('returns false when tenants is undefined', () => {
			expect(isCommitteMember('tenant-1', undefined)).toBe(false);
		});

		it('returns true when matching tenant has is_member true', () => {
			const tenants = [
				{ value: 'tenant-1', is_member: true, is_read_only_user: false },
			];
			expect(isCommitteMember('tenant-1', tenants)).toBe(true);
		});

		it('returns true when matching tenant has read-only user true', () => {
			const tenants = [
				{ value: 'tenant-1', is_member: false, is_read_only_user: true },
			];
			expect(isCommitteMember('tenant-1', tenants)).toBe(true);
		});

		it('returns false when matching tenant is neither member nor read-only user', () => {
			const tenants = [
				{ value: 'tenant-1', is_member: false, is_read_only_user: false },
			];
			expect(isCommitteMember('tenant-1', tenants)).toBe(false);
		});
	});

	describe('isHrSpecialist', () => {
		it('returns false when tenants is undefined', () => {
			expect(isHrSpecialist('tenant-1', undefined)).toBe(false);
		});

		it('returns true when matching tenant has hr flag', () => {
			const tenants = [{ value: 'tenant-1', is_hr: true }];
			expect(isHrSpecialist('tenant-1', tenants)).toBe(true);
		});

		it('returns false when matching tenant does not have hr flag', () => {
			const tenants = [{ value: 'tenant-1', is_hr: false }];
			expect(isHrSpecialist('tenant-1', tenants)).toBe(false);
		});
	});

	describe('atleastOneChair', () => {
		it('returns false when tenants is undefined', () => {
			expect(atleastOneChair(undefined)).toBe(false);
		});

		it('returns true when at least one tenant is chair', () => {
			const tenants = [
				{ value: 'tenant-1', is_chair: false },
				{ value: 'tenant-2', is_chair: true },
			];
			expect(atleastOneChair(tenants)).toBe(true);
		});

		it('returns false when no tenant is chair', () => {
			const tenants = [
				{ value: 'tenant-1', is_chair: false },
				{ value: 'tenant-2', is_chair: false },
			];
			expect(atleastOneChair(tenants)).toBe(false);
		});
	});
});
