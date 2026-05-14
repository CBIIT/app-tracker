const getTenantPropertyValue = (tenantProperties = [], propertyName) => {
	const property = tenantProperties.find((prop) => prop.name === propertyName);
	return property ? property.value : undefined;
};

export const getTenantCapabilities = (
	vacancyTenant,
	tenantProperties = []
) => {
	const enableFocusArea =
		getTenantPropertyValue(tenantProperties, 'enableFocusArea') === 'true';
	const enableTop25Percent =
		getTenantPropertyValue(tenantProperties, 'enableTop25Percent') === 'true';

	return {
		vacancyTenant,
		showCompleteColumn: vacancyTenant === 'Stadtman',
		isStadtman: vacancyTenant === 'Stadtman',
		enableFocusArea,
		showTop25: enableTop25Percent,
	};
};
