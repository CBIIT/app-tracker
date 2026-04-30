export const validateRoleForCurrentTenant = (role, currentTenant, tenants) => {
	const foundTenant = tenants
		? tenants.find((element) => element.value === currentTenant)
		: null;
	return foundTenant && foundTenant.roles && foundTenant.roles.includes(role);
};

export const isVacancyManager = (currentTenant, tenants) => {
	const foundTenant = tenants
		? tenants.find(
				(element) =>
					element.value === currentTenant &&
					element.roles[0] === 'x_g_nci_app_tracke.vacancy_manager'
			)
		: null;
	const isVacancyManager = foundTenant ? foundTenant.roles : false;
	return isVacancyManager;
};

export const isExecSec = (currentTenant, tenants) => {
	var foundTenant = tenants
		? tenants.find(
				(element) =>
					element.value === currentTenant && element.is_exec_sec === true
			)
		: null;
	const isExecSec = foundTenant ? foundTenant.is_exec_sec : false;
	return isExecSec;
};

export const isChair = (currentTenant, tenants) => {
	var foundTenant = tenants
		? tenants.find(
				(element) =>
					element.value === currentTenant && element.is_chair === true
			)
		: null;
	const isChair = foundTenant ? foundTenant.is_chair : false;
	return isChair;
};

export const isCommitteMember = (currentTenant, tenants) => {
	var foundTenant = tenants
		? tenants.find(
				(element) =>
					element.value === currentTenant &&
					(element.is_member === true || element.is_read_only_user === true)
			)
		: null;
	const isCommitteMember = foundTenant ? true : false;
	return isCommitteMember;
};

export const isHrSpecialist = (currentTenant, tenants) => {
	var foundTenant = tenants
		? tenants.find(
				(element) => element.value === currentTenant && element.is_hr === true
			)
		: null;
	const isHrSpecialist = foundTenant ? true : false;
	return isHrSpecialist;
};

export const atleastOneChair = (tenants) => {
	var foundTenant = tenants
		? tenants.find((element) => element.is_chair === true)
		: null;
	const atleastOneChair = foundTenant ? foundTenant.is_chair : false;
	return atleastOneChair;
};
