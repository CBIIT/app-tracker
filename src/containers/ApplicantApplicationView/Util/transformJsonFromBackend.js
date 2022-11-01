export const transformJsonFromBackend = (sourceJson) => {
	return {
		basicInfo: {
			firstName: sourceJson.basic_info.first_name,
			middleName: sourceJson.basic_info.middle_name,
			lastName: sourceJson.basic_info.last_name,
			email: sourceJson.basic_info.email,
			phone: sourceJson.basic_info.phone,
			businessPhone: sourceJson.basic_info.business_phone,
			highestLevelEducation: sourceJson.basic_info.highest_level_of_education,
			isUsCitizen: sourceJson.basic_info.us_citizen,
		},
		address: {
			address1: sourceJson.basic_info.address,
			address2: sourceJson.basic_info.address_2,
			city: sourceJson.basic_info.city,
			stateProvince: sourceJson.basic_info.state_province,
			postalCode: sourceJson.basic_info.zip_code,
			country: sourceJson.basic_info.country,
		},
		references: sourceJson.references.map((reference) => {
			return {
				firstName: reference.first_name,
				middleName: reference.middle_name,
				lastName: reference.last_name,
				email: reference.email,
				contactAllowed: reference.contact_allowed,
				organization: reference.organization,
				phone: reference.phone,
				relationship: reference.relationship,
				positionTitle: reference.title,
			};
		}),
		documents: sourceJson.app_documents.map((document) => {
			return {
				documentName: document.doc_name,
				fileName: document.file_name,
				downloadLink: document.attachment_dl,
			};
		}),
	};
};
