
export const validateRoleForCurrentTenant = (role, currentTenant, tenants) => {
    const foundTenant = tenants ? tenants.find((element) => element.value === currentTenant) : null;
    return foundTenant && foundTenant.roles && foundTenant.roles.includes(role);
};

export const isExecSec = (currentTenant, tenants) => {
    var foundTenant = tenants.find((element) => (element.value === currentTenant && element.is_exec_sec === true))
    const isExecSec = foundTenant ? foundTenant.is_exec_sec : false;
    return isExecSec;
};

export const isChair = (currentTenant, tenants) => {
    var foundTenant = tenants.find((element) => (element.value === currentTenant && element.is_chair === true))
    const isChair = foundTenant ? foundTenant.is_chair : false;
    return isChair;
};

export const atleastOneChair = (tenants) => {
    var foundTenant = tenants.find((element) => ( element.is_chair === true))
    const atleastOneChair = foundTenant ? foundTenant.is_chair : false;
    return atleastOneChair;
};