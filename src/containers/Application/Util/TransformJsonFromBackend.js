export const transformJsonFromBackend = (backendJson) => {
	return {
		vacancyId: backendJson.basic_info.vacancy.value,
		appSysId: backendJson.basic_info.sys_id.value,
		basicInfo: {
			firstName: backendJson.basic_info.first_name.value,
			middleName: backendJson.basic_info.middle_name.value,
			lastName: backendJson.basic_info.last_name.value,
			email: backendJson.basic_info.email.value,
			phone: backendJson.basic_info.phone.value,
			businessPhone: backendJson.basic_info.business_phone.value,
			highestLevelEducation:
				backendJson.basic_info?.highest_level_of_education?.value,
			isUsCitizen: backendJson.basic_info?.us_citizen?.value,
		},
		address: {
			address1: backendJson.basic_info.address.value,
			address2: backendJson.basic_info.address_2.value,
			city: backendJson.basic_info.city.value,
			stateProvince: backendJson.basic_info.state_province.value,
			postalCode: backendJson.basic_info.zip_code.value,
		},
		documents: getDocuments(backendJson.app_documents),
		references: getReferences(backendJson.references),
	};
};

const getDocuments = (backendAppDocuments) =>
	backendAppDocuments.map((document) => ({
		title: document.doc_name,
		filename: document.file_name,
		downloadLink: document.attachment_dl,
	}));

const getReferences = (backendReferences) =>
	backendReferences.map((reference) => {
		return {
			name: reference.name,
			document: {
				downloadLink: reference.attachment_dl,
				filename: reference.file_name,
				referenceSysId: reference.ref_sys_id,
				attachmentSysId: reference.attach_sys_id,
			},
			contact_allowed: reference.contact_allowed,
			email: reference.email,
			organization: reference.organization,
			phone: reference.phone,
			relationship: reference.relationship,
			title: reference.title,
		};
	});
