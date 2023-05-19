export const transformJsonFromBackend = (sourceJson) => {
	const targetJson = {
		sysId: sourceJson.basic_info.sys_id.value,
		state: sourceJson.basic_info.state.value,
		basicInfo: {
			openDate: sourceJson.basic_info.open_date.label,
			closeDate: sourceJson.basic_info.close_date.label,
			scoringDueByDate: sourceJson.basic_info.scoring_due_by_date.label,
			title: sourceJson.basic_info.vacancy_title.value,
			allowHrSpecialistTriage:
				sourceJson.basic_info.allow_hr_specialist_triage.value == '1'
					? true
					: false,
			requireFocusArea:
			sourceJson.basic_info.require_focus_area.value == '1'
				? true
				: false,
			description: sourceJson.basic_info.vacancy_description.value,
			applicationDocuments: sourceJson.vacancy_documents.map((doc) => ({
				document: doc.title.value,
				isDocumentOptional: doc.is_optional.value == '1' ? true : false,
			})),
			numberOfRecommendations:
				sourceJson.basic_info.number_of_recommendation.value,
		},
		emailTemplates: sourceJson.vacancy_emails
			? sourceJson.vacancy_emails.map((temp) => ({
					active: temp.active.value == '1' ? true : false,
					type: temp.email_type.value,
			  }))
			: [],
		vacancyCommittee: sourceJson.committee
			? sourceJson.committee.map((member) => ({
					role: member.role.value,
					user: { name: { value: member.user.label } },
					key: member.sys_id.value,
			  }))
			: [],
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
		ratingPlan: {
			sysId: sourceJson.rating_plan ? sourceJson.rating_plan.sys_id : null,
			downloadLink: sourceJson.rating_plan
				? sourceJson.rating_plan.attachment_dl
				: null,
			fileName: sourceJson.rating_plan
				? sourceJson.rating_plan.file_name
				: null,
		},
	};
	return targetJson;
};
