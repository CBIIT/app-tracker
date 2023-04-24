export const convertDataFromBackend = (data) => {
	const createDemoObj = (data) => {
		if (data.demographics.share === '0') {
			return {
				share: data.demographics.share,
			}
		} else {
			return {
				disability: data.demographics.disability.split(','),
				ethnicity: data.demographics.ethnicity,
				race: data.demographics.race.split(','),
				sex: data.demographics.sex,
				share: data.demographics.share,
			}
		}
	}
	return {
		userSysId: data.basic_info.sys_id,
		basicInfo: {
			firstName: data.basic_info.first_name,
			middleName: data.basic_info.middle_name
				? data.basic_info.middle_name
				: null,
			lastName: data.basic_info.last_name,
			email: data.basic_info.email,
			phonePrefix: data.basic_info.phone.slice(0, 2),
			phone: data.basic_info.phone.slice(2),
			businessPhonePrefix: data.basic_info.business_phone
				? data.basic_info.business_phone?.slice(0, 2)
				: '+1',
			businessPhone: data.basic_info.business_phone
				? data.basic_info.business_phone.slice(2)
				: null,
			highestLevelEducation: data.basic_info.highest_level_of_education,
			isUsCitizen: parseInt(data.basic_info.us_citizen),
			address: {
				address: data.basic_info.address,
				address2: data.basic_info.address_2,
				city: data.basic_info.city,
				stateProvince: data.basic_info.state_province,
				zip: data.basic_info.zip_code,
				country: data.basic_info.country,
			},
		},
		demographics: createDemoObj(data),
	};
};
