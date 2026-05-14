import axios from 'axios';
import { message } from 'antd';
import { INTERVIEW } from '../../../../constants/ApiEndpoints';

/**
 * Persists committee review interview recommendation.
 *
 * @param {string} applicationSysId - The application system ID
 * @param {string | undefined} referredToInterview - yes/no value from Select
 * @returns {Promise<Object>} API response data
 * @throws {Error} On network/API error
 */
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