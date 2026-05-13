const getTenantPropertyValue = (tenantProperties = [], propertyName) => {
	const property = tenantProperties.find((prop) => prop.name === propertyName);
	return property ? property.value : undefined;
};

export const getTenantCapabilities = (
	vacancyTenant,
	tenantProperties = []
) => {

	return {
		vacancyTenant,
		showCompleteColumn: vacancyTenant === 'Stadtman',
		isStadtman: vacancyTenant === 'Stadtman',
		enableFocusArea:
			getTenantPropertyValue(tenantProperties, 'enableFocusArea') === 'true' || vacancyTenant === 'Stadtman',
		showTop25: vacancyTenant === 'Stadtman',
	};
};
