//import useAuth from '../../../hooks/useAuth';

export const validateRoleForCurrentTenant = (role, currentTenant, tenants) => {
    //const { auth: { tenants }, currentTenant } = useAuth();
    const foundTenant = tenants ? tenants.find((element) => element.value === currentTenant) : null;
    return foundTenant && foundTenant.roles.includes(role);
};