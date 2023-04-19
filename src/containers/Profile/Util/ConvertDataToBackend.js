export const convertDataToBackend = (data) => {
	return {
		basic_info: {
			sys_id: data.userSysId,
			first_name: data.basicInfo.firstName,
			middle_name: data.basicInfo.middleName,
			last_name: data.basicInfo.lastName,
			email: data.basicInfo.email,
			phone:
				data.basicInfo.phonePrefix +
				(data.basicInfo.phone ? data.basicInfo.phone.toString() : ''),
			business_phone:
				data.basicInfo.businessPhonePrefix +
				(data.basicInfo.businessPhone
					? data.basicInfo.businessPhone.toString()
					: ''),
			highest_level_of_education: data.basicInfo.highestLevelEducation,
			us_citizen: data.basicInfo.isUsCitizen.toString(),
			address: {
				address: data.basicInfo.address.address,
				address_2: data.basicInfo.address.address2,
				city: data.basicInfo.address.city,
				zip_code: data.basicInfo.address.zip,
				state_province: data.basicInfo.address.stateProvince,
				country: data.basicInfo.address.country,
			},
		},
		demographics: {
			share: data.demographics?.share.toString(),
			sex: data.demographics?.sex,
			ethnicity: data.demographics?.ethnicity.toString(),
			race: data.demographics?.race.toString(),
			disability: data.demographics?.disability.toString(),
		},
		references: data.references?.map((reference) => {
			return {
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
			};
		}),
	};
};
