import moment from 'moment';
export const transformJsonFromBackend = (sourceJson) => {
	const targetJson = {
		sysId: sourceJson.basic_info.sys_id.value,
		state: sourceJson.basic_info.state.value,
		basicInfo: {
			sys_id: sourceJson.basic_info.sys_id.value,
			openDate: moment(sourceJson.basic_info.open_date.value),
			closeDate: moment(sourceJson.basic_info.close_date.value),
			scoringDueByDate: sourceJson.basic_info.scoring_due_by_date.value
				? moment(sourceJson.basic_info.scoring_due_by_date.value)
				: null,
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
				sys_id: doc.sys_id.value,
				document: doc.title.value,
				isDocumentOptional: doc.is_optional.value == '1' ? true : false,
			})),
			numberOfRecommendations:
				sourceJson.basic_info.number_of_recommendation.value,
		},
		emailTemplates: sourceJson.vacancy_emails.map((temp) => ({
			sys_id: temp.sys_id.value,
			active: temp.active.value == '1' ? true : false,
			type: temp.email_type.value,
			text: temp.email_message.value,
		})),
		vacancyCommittee: transformVacancyCommittee(sourceJson.committee),
		mandatoryStatements: {
			equalOpportunityEmployer:
				sourceJson.basic_info.show_eoes.value == '1' ? true : false,
			standardsOfConduct:
				sourceJson.basic_info.show_socs.value == '1' ? true : false,
			foreignEducation:
				sourceJson.basic_info.show_fes.value == '1' ? true : false,
			reasonableAccomodation:
				sourceJson.basic_info.show_ras.value == '1' ? true : false,
			equalOpportunityEmployerText:
				sourceJson.basic_info.equal_opportunity_employment_statement.value,
			standardsOfConductText:
				sourceJson.basic_info.standards_of_conduct_statement.value,
			foreignEducationText:
				sourceJson.basic_info.foreign_education_statement.value,
			reasonableAccomodationText:
				sourceJson.basic_info.reasonable_accommodation_statement.value,
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

const transformVacancyCommittee = (vacancyCommittee) => {
	return vacancyCommittee.map((member, index) => {
		const transformedCommitteeMember = {
			role: member.role.value,
			user: {
				sys_id: { value: member.user.value, display_value: member.user.value },
				name: { value: member.user.label, display_value: member.user.label },
				email: member.email,
				orginization: member.orginization,
			},
			key: index,
		};

		if (!member.email) {
			transformedCommitteeMember['user']['email'] = { value: '' };
		}

		if (!member.organization)
			transformedCommitteeMember['user']['organization'] = { value: '' };

		return transformedCommitteeMember;
	});
};
