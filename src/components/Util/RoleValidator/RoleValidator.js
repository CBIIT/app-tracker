
export const validateRoleForCurrentTenant = (role, currentTenant, tenants) => {
    const foundTenant = tenants ? tenants.find((element) => element.value === currentTenant) : null;
    return foundTenant && foundTenant.roles && foundTenant.roles.includes(role);
};

export const isExecSec = (currentTenant, tenants) => {
    const isExecSec = tenants ? tenants.includes((element) => ((element.value === currentTenant) && (element.is_exec_sec === true))) : false;
    return isExecSec;
};

export const isChair = (currentTenant, tenants) => {
    const isExecSec = tenants ? tenants.includes((element) => ((element.value === currentTenant) && (element.is_chair === true))) : false;
    return isExecSec;
};