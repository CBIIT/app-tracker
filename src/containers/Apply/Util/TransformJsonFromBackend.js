export const transformJsonFromBackend = (sourceJson) => {

	 const cleanseFocusArea = (localFocusAreas) => {
		if (!localFocusAreas || localFocusAreas.length == 0 || localFocusAreas.includes("undefined"))
			return [];
		else
			return localFocusAreas.split(',');
	}; 

	return {
		sysId: sourceJson.basic_info.vacancy,
		basicInfo: {
			firstName: sourceJson.basic_info.first_name,
			middleName: sourceJson.basic_info.middle_name,
			lastName: sourceJson.basic_info.last_name,
			email: sourceJson.basic_info.email,
			phonePrefix: sourceJson.basic_info.phone.slice(0, 2),
			phone: sourceJson.basic_info.phone.slice(2),
			businessPhonePrefix: sourceJson.basic_info.business_phone
				? sourceJson.basic_info.business_phone.slice(0, 2)
				: '+1',
			businessPhone: sourceJson.basic_info.business_phone
				? sourceJson.basic_info.business_phone.slice(2)
				: null,
			highestLevelEducation: sourceJson.basic_info.highest_level_of_education,
			isUsCitizen: sourceJson.basic_info.us_citizen,
		},
		focusArea: cleanseFocusArea(sourceJson.basic_info.focus_area),
		address: {
			address: sourceJson.basic_info.address,
			address2: sourceJson.basic_info.address_2,
			city: sourceJson.basic_info.city,
			stateProvince: sourceJson.basic_info.state_province,
			zip: sourceJson.basic_info.zip_code,
			country: sourceJson.basic_info.country,
		},
		references: sourceJson.references.map((reference) => {
			return {
				ref_sys_id: reference.ref_sys_id,
				firstName: reference.first_name,
				middleName: reference.middle_name,
				lastName: reference.last_name,
				email: reference.email,
				contact: reference.contact_allowed,
				organization: reference.organization,
				phoneNumber: reference.phone,
				relationship: reference.relationship,
				title: reference.title,
			};
		}),
		applicantDocuments: sourceJson.app_documents.map((document) => {
			const applicantDocument = {
				documentName: document.doc_name,
				table_name: document.table_name,
				table_sys_id: document.table_sys_id,
			};

			if (document.attach_sys_id)
				applicantDocument['uploadedDocument'] = {
					fileName: document.file_name,
					downloadLink: document.attachment_dl,
					attachSysId: document.attach_sys_id,
					markedToDelete: false,
				};

			return applicantDocument;
		}),
	};
};
