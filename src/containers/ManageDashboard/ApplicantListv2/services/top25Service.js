import axios from 'axios';
import { message } from 'antd';
import { TOP25PERCENT } from '../../../../constants/ApiEndpoints';

/**
 * Updates the top 25% designation for an applicant.
 * Called from individual scoring table when user toggles the Top 25 checkbox.
 *
 * @param {string} applicationSysId - The application system ID
 * @param {boolean|string} isTop25 - Whether applicant should be marked as top 25%
 * @returns {Promise<Object>} API response data
 * @throws {Error} On network/API error
 */
export const updateTop25Percent = async (applicationSysId, isTop25) => {
	try {
		const response = await axios.put(TOP25PERCENT, {
			appSysId: applicationSysId,
			top25Percent: isTop25 ? true : '',
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
