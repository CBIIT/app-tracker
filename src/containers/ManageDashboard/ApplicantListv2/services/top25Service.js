import axios from 'axios';
import { message } from 'antd';
import { TOP25PERCENT } from '../../../../constants/ApiEndpoints';

// Updates the Top 25 designation for an applicant.
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
