export const convertDataToBackend = (data) => {
	const { basicInfo, demographics } = data;

	 const cleanseFocusArea = (localFocusAreas) => {
		if (!localFocusAreas || localFocusAreas.length == 0 || localFocusAreas[0] === 'undefined')
			return '';
		else
			return localFocusAreas.join(',');
	};
 
	return {
		basic_info: {
			sys_id: data.userSysId,
			first_name: basicInfo.firstName,
			middle_name: basicInfo.middleName,
			last_name: basicInfo.lastName,
			email: basicInfo.email,
			phone:
				basicInfo.phonePrefix +
				(basicInfo.phone ? basicInfo.phone.toString() : ''),
			business_phone:
				basicInfo.businessPhonePrefix +
				(basicInfo.businessPhone
					? basicInfo.businessPhone.toString()
					: ''),
			highest_level_of_education: basicInfo.highestLevelEducation,
			us_citizen: basicInfo.isUsCitizen?.toString(),
			focus_area: cleanseFocusArea(basicInfo?.focusArea),
			address: {
				address: basicInfo.address.address,
				address_2: basicInfo.address.address2,
				city: basicInfo.address.city,
				zip_code: basicInfo.address.zip,
				state_province: basicInfo.address.stateProvince,
				country: basicInfo.address.country,
			},
		},
		demographics: {
			share: demographics.share ? demographics.share : null,
			sex: demographics?.sex  ? demographics.sex : null,
			ethnicity: demographics?.ethnicity ? demographics.ethnicity : null,
			race: demographics?.race ? demographics?.race.toString() : null,
			disability: demographics?.disability ? demographics?.disability.toString() : null,
		},
	};
};
