export const transformJsonFromBackend = (backendJson) => {

	const cleanseFocusArea = (localFocusAreas) => {
		if (!localFocusAreas || localFocusAreas.length == 0 )
			return [];
		else {
			var innerFocusAreas = localFocusAreas;
			if (typeof localFocusAreas !== "string") {
				innerFocusAreas = localFocusAreas["focus_area"];
			}
			if (innerFocusAreas.includes("undefined")) {
				return [];
			}
			return innerFocusAreas.split(',');
		}
	}; 

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
			isUsCitizen: backendJson?.basic_info?.us_citizen?.value,			
		},
		focusArea: cleanseFocusArea(backendJson?.focus_area?.focus_area),
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
			referenceSysId: reference.ref_sys_id,
			documents: reference.documents.map((document) => {
				return {
					downloadLink: document.attachment_dl,
					filename: document.file_name,
					attachmentSysId: document.attach_sys_id,
				};
			}),
			contact_allowed: reference.contact_allowed,
			email: reference.email,
			organization: reference.organization,
			phone: reference.phone,
			relationship: reference.relationship,
			title: reference.title,
		};
	});
