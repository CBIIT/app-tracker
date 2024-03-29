export const transformJsonToBackend = (sourceJson) => {

	 const cleanseFocusArea = (localFocusAreas) => {
		if (!localFocusAreas || localFocusAreas.length == 0 || localFocusAreas[0] === 'undefined')
			return '';
		else
			return localFocusAreas.join(',');
	}; 

	const targetJson = {
		basic_info: {
			sys_id: sourceJson.sysId,
			first_name: sourceJson.basicInfo.firstName,
			middle_name: sourceJson.basicInfo.middleName,
			last_name: sourceJson.basicInfo.lastName,
			email: sourceJson.basicInfo.email,
			phone:
				sourceJson.basicInfo.phonePrefix +
				(sourceJson.basicInfo.phone
					? sourceJson.basicInfo.phone.toString()
					: ''),
			business_phone: sourceJson.basicInfo.businessPhone
				? sourceJson.basicInfo.businessPhonePrefix +
				  sourceJson.basicInfo.businessPhone.toString()
				: '',
			highest_level_of_education: sourceJson.basicInfo.highestLevelEducation,
			us_citizen: sourceJson.basicInfo.isUsCitizen,
			address: sourceJson.address.address,
			address_2: sourceJson.address.address2,
			city: sourceJson.address.city,
			zip_code: sourceJson.address.zip,
			state_province: sourceJson.address.stateProvince,
			country: sourceJson.address.country,
		},
		focus_area: cleanseFocusArea(sourceJson?.focusArea),
		vacancy_documents: sourceJson.applicantDocuments,
		references: transformReferences(sourceJson.references),
		questions: {
			share: sourceJson.questions.share ? sourceJson.questions.share : null,
			sex: sourceJson.questions?.sex  ? sourceJson.questions.sex : null,
			ethnicity: sourceJson.questions?.ethnicity ? sourceJson.questions.ethnicity : null,
			race: sourceJson.questions?.race ? sourceJson.questions?.race.toString() : null,
			disability: sourceJson.questions?.disability ? sourceJson.questions?.disability.toString() : null,
		}
	};

	return targetJson;
};

const transformReferences = (references) => {
	return references.map((reference) => ({
		ref_sys_id: reference.ref_sys_id ? reference.ref_sys_id : null,
		first_name: reference.firstName,
		middle_name: reference.middleName,
		last_name: reference.lastName,
		email: reference.email,
		phone: reference.phoneNumber,
		contact_allowed: reference.contact,
		organization: reference.organization,
		title: reference.title,
		relationship: reference.relationship,
	}));
};
