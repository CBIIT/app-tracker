export const transformJsonFromBackend = (sourceJson) => {
	const targetJson = {
		basicInfo: {
			openDate: sourceJson.basic_info.open_date.value,
			closeDate: sourceJson.basic_info.close_date.value,
			title: sourceJson.basic_info.vacancy_title.value,
			description: sourceJson.basic_info.vacancy_description.value,
			applicationDocuments: sourceJson.vacancy_documents.map((doc) => ({
				document: doc.title.value,
				isDocumentOptional: doc.is_optional.value == '1' ? true : false,
			})),
			numberOfRecommendations:
				sourceJson.basic_info.number_of_recommendation.value,
		},
		emailTemplates: sourceJson.vacancy_emails.map((temp) => ({
			active: temp.active.value == '1' ? true : false,
			type: temp.email_type.value,
		})),
		vacancyCommittee: sourceJson.committee.map((member) => ({
			role: member.role.value,
			user: { name: { value: member.user.label } },
			key: member.sys_id.value,
		})),
		mandatoryStatements: {
			equalOpportunityEmployer:
				sourceJson.basic_info.show_eoes.value == '1' ? true : false,
			standardsOfConduct:
				sourceJson.basic_info.show_socs.value == '1' ? true : false,
			foreignEducation:
				sourceJson.basic_info.show_fes.value == '1' ? true : false,
			reasonableAccomodation:
				sourceJson.basic_info.show_ras.value == '1' ? true : false,
		},
	};
	return targetJson;
};
