import moment from 'moment';

export const transformJsonToBackend = (sourceJson) => {
	const targetJson = {
		basic_info: transformBasicInfo(
			sourceJson.basicInfo,
			sourceJson.mandatoryStatements,
			sourceJson.sysId
		),
		vacancy_committee: sourceJson.vacancyCommittee,
		vacancy_emails: transformEmails(sourceJson.emailTemplates),
		vacancy_documents: sourceJson.basicInfo.applicationDocuments,
	};

	if (sourceJson.draftId) targetJson['draft_id'] = sourceJson.draftId;

	return targetJson;
};

const transformBasicInfo = (basicInfo, mandatoryStatements, sysId) => {
	const transformedBasicInfo = {
		vacancy_title: basicInfo.title,
		allow_hr_specialist_triage: basicInfo.allowHrSpecialistTriage,
		require_focus_area: basicInfo.requireFocusArea ? '1' : '0',
		vacancy_description: basicInfo.description,
		package_initiator: basicInfo.appointmentPackageIndicator,
		organization_code: basicInfo.orgCode,
		title_42_position_classification: basicInfo.positionClassification,
		open_date: getDateFromDateTime(basicInfo.openDate),
		close_date: getDateFromDateTime(basicInfo.closeDate),
		scoring_due_by_date: getDateFromDateTime(basicInfo.scoringDueByDate),
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

	if (sysId) transformedBasicInfo['sys_id'] = sysId;

	return transformedBasicInfo;
};

const getDateFromDateTime = (dateTime) => {
	return dateTime ? moment(dateTime.toString()).format('YYYY-MM-DD') : null;
};

const transformEmails = (emails) => {
	return emails.map((item) => {
		const transformedItem = {
			email: item.type,
			email_message: item.text,
			active: item.active,
		};

		if (item.sys_id) transformedItem['sys_id'] = item.sys_id;

		return transformedItem;
	});
};
