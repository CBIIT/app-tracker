export const transformJsonToBackend = (sourceJson) => {
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
		vacancy_documents: sourceJson.applicantDocuments,
		references: transformReferences(sourceJson.references),
	};

	return targetJson;
};

const transformReferences = (references) => {
	return references.map((reference) => ({
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
