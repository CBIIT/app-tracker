import axios from 'axios';
import { message } from 'antd';
import {
	COLLECT_REFERENCES,
	SEND_REGRET_EMAIL,
	SUBMIT_COMMITTEE_COMMENTS,
} from '../../../../constants/ApiEndpoints';

// Requests reference collection notifications for an applicant.
export const collectReferences = async (applicantSysId) => {
	try {
		const response = await axios.get(COLLECT_REFERENCES + applicantSysId);
		message.success(
			response?.data?.result?.message || 'Reference collection initiated.'
		);
		return response.data;
	} catch (_error) {
		message.error(
			'Sorry, there was an error sending the notifications to the references. Try refreshing the browser.'
		);
		throw _error;
	}
};

// Sends a regret email to an applicant after confirmation.
export const sendRejectionEmail = async (applicantSysId) => {
	try {
		const response = await axios.get(SEND_REGRET_EMAIL + applicantSysId);
		message.success(
			response?.data?.result?.response?.message || 'Regret email sent.'
		);
		return response.data;
	} catch (_error) {
		message.error(
			'Sorry, there was an error sending the rejection email. Try refreshing the browser.'
		);
		throw _error;
	}
};

// Saves committee comments for an applicant.
export const submitCommitteeComments = async (
	applicantSysId,
	committeeComment
) => {
	try {
		const response = await axios.post(SUBMIT_COMMITTEE_COMMENTS, {
			app_sys_id: applicantSysId,
			committee_comments: committeeComment,
		});
		message.success('Comments saved!');
		return response.data;
	} catch (_error) {
		message.error(
			'Sorry! An issue occurred while trying to save comments. Please refresh and try again.'
		);
		throw _error;
	}
};
