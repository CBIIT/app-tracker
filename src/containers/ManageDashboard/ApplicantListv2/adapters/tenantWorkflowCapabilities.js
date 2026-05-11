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
		enableFocusArea:
			getTenantPropertyValue(tenantProperties, 'enableFocusArea') === 'true',
		enableTop25Percent:
			getTenantPropertyValue(tenantProperties, 'enableTop25Percent') ===
			'true',
		forceSingleScoringTable:
			getTenantPropertyValue(tenantProperties, 'forceSingleScoringTable') ===
			'true',
	};
};
