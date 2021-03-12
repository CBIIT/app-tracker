export const extractAndTransformMandatoryStatements = (vacancyDetails) => {
	const mandatoryStatements = [];

	mandatoryStatements.push({
		label: 'Equal Opportunity Employment',
		text:
			vacancyDetails.basic_info.equal_opportunity_employment_statement.value,
		display: vacancyDetails.basic_info.show_eoes.value,
	});

	mandatoryStatements.push({
		label: 'Standards of Conduct/Financial Disclosure',
		text: vacancyDetails.basic_info.standards_of_conduct_statement.value,
		display: vacancyDetails.basic_info.show_socs.value,
	});

	mandatoryStatements.push({
		label: 'Foreign Education',
		text: vacancyDetails.basic_info.foreign_education_statement.value,
		display: vacancyDetails.basic_info.show_fes.value,
	});

	mandatoryStatements.push({
		label: 'Reasonable Accomodation',
		text: vacancyDetails.basic_info.reasonable_accommodation_statement.value,
		display: vacancyDetails.basic_info.show_ras.value,
	});

	return mandatoryStatements;
};
