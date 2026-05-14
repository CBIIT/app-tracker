import axios from 'axios';
import { message } from 'antd';
import { INTERVIEW } from '../../../../constants/ApiEndpoints';

// Persists committee review interview recommendation values.
export const updateReferredToInterview = async (
	applicationSysId,
	referredToInterview
) => {
	try {
		const response = await axios.put(INTERVIEW, {
			appSysId: applicationSysId,
			referredToInterview: referredToInterview || '',
		});
		message.success('Decision saved.');
		return response.data;
	} catch (_error) {
		message.error(
			'Sorry, an error occurred while attempting to save. Please try reloading the page and selecting again.'
		);
		throw _error;
	}
};