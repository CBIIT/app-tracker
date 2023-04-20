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
			//share(choice: num), sex(str), ethnicity(choice: num), race(str), disability(str)
			share: data.demographics?.share,
			sex: data.demographics?.sex,
			ethnicity: data.demographics?.ethnicity,
			race: data.demographics.race ? data.demographics?.race.toString() : null,
			disability: data.demographics.disability ? data.demographics?.disability.toString() : null,
		},
	};
};
