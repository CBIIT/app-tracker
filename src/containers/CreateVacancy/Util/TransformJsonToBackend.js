export const transformJsonToBackend = (sourceJson) => {
	const targetJson = {
		basic_info: transformBasicInfo(
			sourceJson.basicInfo,
			sourceJson.mandatoryStatements
		),
		vacancy_committee: sourceJson.vacancyCommittee,
		vacancy_emails: transformEmails(sourceJson.emailTemplates),
		vacancy_documents: sourceJson.basicInfo.applicationDocuments,
	};

	if (sourceJson.draftId) targetJson['draft_id'] = sourceJson.draftId;

	return targetJson;
};

const transformBasicInfo = (basicInfo, mandatoryStatements) => {
	const transformedBasicInfo = {
		vacancy_title: basicInfo.title,
		vacancy_description: basicInfo.description,
		open_date: getDateFromDateTime(basicInfo.openDate),
		close_date: getDateFromDateTime(basicInfo.closeDate),
		number_of_recommendation: basicInfo.numberOfRecommendations,
		equal_opportunity_employment_statement:
			mandatoryStatements.equalOpportunityEmployerText,
		standards_of_conduct_statement: mandatoryStatements.standardsOfConductText,
		foreign_education_statement: mandatoryStatements.foreignEducationText,
		reasonable_accommodation_statement:
			mandatoryStatements.reasonableAccomodationText,
		show_eoes: mandatoryStatements.equalOpportunityEmployer,
		show_socs: mandatoryStatements.standardsOfConduct,
		show_fes: mandatoryStatements.foreignEducation,
		show_ras: mandatoryStatements.reasonableAccomodation,
	};

	return transformedBasicInfo;
};

const getDateFromDateTime = (dateTime) => {
	return new Date(dateTime).toISOString().slice(0, 10);
};

const transformEmails = (emails) => {
	return emails.map((item) => {
		return {
			email: item.type,
			email_message: item.text,
			active: item.active,
		};
	});
};
