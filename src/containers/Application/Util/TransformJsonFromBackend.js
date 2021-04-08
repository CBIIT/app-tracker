export const transformJsonFromBackend = (backendJson) => {
	return {
		basicInfo: {
			firstName: backendJson.basic_info.first_name.value,
			middleName: backendJson.basic_info.middle_name.value,
			lastName: backendJson.basic_info.last_name.value,
			email: backendJson.basic_info.email.value,
			phone: backendJson.basic_info.phone.value,
			businessPhone: backendJson.basic_info.business_phone.value,
		},
		address: {
			address1: backendJson.basic_info.address.value,
			address2: backendJson.basic_info.address_2.value,
			city: backendJson.basic_info.city.value,
			stateProvince: backendJson.basic_info.state_province.value,
			postalCode: backendJson.basic_info.zip_code.value,
		},
	};
};
