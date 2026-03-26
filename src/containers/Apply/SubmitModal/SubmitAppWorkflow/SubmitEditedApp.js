import axios from 'axios';
import { message, notification } from 'antd';
import {
	APPLICATION_SUBMISSION,
	SERVICE_NOW_FILE_ATTACHMENT,
	DELETE_ATTACHMENT,
	ATTACHMENT_CHECK_FOR_APPLICATIONS,
} from '../../../../constants/ApiEndpoints';
import { transformJsonToBackend } from '../../Util/TransformJsonToBackend';

const MISSING_REQUIRED_ATTACHMENTS = 'MISSING_REQUIRED_ATTACHMENTS';

const showGenericSubmissionError = () => {
	notification.error({
		message: 'Sorry! There was an error when attempting to submit your application.',
		description: (
			<>
				<p>
					Please try again. If the issue continues, contact the Help Desk{' '}
					<a href='mailto:NCIAppSupport@mail.nih.gov'>
						NCIAppSupport@mail.nih.gov
					</a>
				</p>
			</>
		),
		duration: 0,
		style: {
			height: '225px',
			display: 'flex',
			alignItems: 'center',
		},
	});
};

const showAttachmentSubmissionError = () => {
	notification.error({
		message: 'Sorry! There was an error with submitting the attachments.',
		description: (
			<>
				<p>
					Please re-upload the attachment(s) and try again. If the issue
					continues, contact the Help Desk by emailing{' '}
					<a href='mailto:NCIAppSupport@mail.nih.gov'>
						NCIAppSupport@mail.nih.gov
					</a>
				</p>
			</>
		),
		duration: 30,
		style: {
			height: '225px',
			display: 'flex',
			alignItems: 'center',
		},
	});
};

const getMissingRequiredAttachments = (mandatoryDocuments = []) => {
	const requiredDocuments = mandatoryDocuments.filter(
		(doc) => doc.is_optional === 'false'
	);

	return requiredDocuments.filter((doc) => doc.exists === false);
};

const isVacancyClosedError = (error) => {
	return (
		error?.response?.status === 400 ||
		error?.message === 'Request failed with status code 400'
	);
};

const submitEditedApp = async (
	setConfirmLoading,
	data,
	submittedAppSysId,
	setSubmitted,
	setPercent,
	setAppSysId,
	history,
	checkAuth,
	setAuth
) => {
	const infoToSend = transformJsonToBackend(data);
	infoToSend['app_sys_id'] = submittedAppSysId;

	setSubmitted(true);
	setPercent(25);

	const attachDocuments = async () => {
		const documents = infoToSend.vacancy_documents || [];

		const documentsToDelete = documents
			.filter((document) => document?.uploadedDocument?.markedToDelete)
			.map((document) =>
				axios.delete(DELETE_ATTACHMENT + document?.uploadedDocument?.attachSysId)
			);

		const documentsToUpload = documents
			.filter(
				(document) =>
					document?.file?.file ||
					(document?.file?.fileList && document.file.fileList.length > 0)
			)
			.map((document) => {
				const file = document.file.file
					? document.file.file
					: document.file.fileList[0];

				const options = {
					params: {
						file_name: file.name,
						table_name: document.table_name,
						table_sys_id: document.table_sys_id,
					},
					headers: {
						'Content-Type': file.type,
					},
				};

				return axios.post(SERVICE_NOW_FILE_ATTACHMENT, file, options);
			});

		await Promise.all([...documentsToDelete, ...documentsToUpload]);
	};

	const checkAttachments = async () => {
		const verifyAttachments = await axios.get(
			ATTACHMENT_CHECK_FOR_APPLICATIONS + submittedAppSysId
		);

		return verifyAttachments?.data?.result?.messages || [];
	};

	try {
		await attachDocuments();
		setPercent(50);

		const mandatoryDocuments = await checkAttachments();
		setPercent(75);

		const missingRequiredAttachments = getMissingRequiredAttachments(
			mandatoryDocuments
		);

		if (missingRequiredAttachments.length > 0) {
			throw new Error(MISSING_REQUIRED_ATTACHMENTS);
		}

		const submitAppResponse = await axios.put(
			APPLICATION_SUBMISSION,
			infoToSend
		);

		if (submitAppResponse?.data?.result?.status === 200) {
			setPercent(100);
			setAppSysId(submittedAppSysId);
		}
	} catch (e) {
		setSubmitted(false);

		if (e?.message === MISSING_REQUIRED_ATTACHMENTS) {
			showAttachmentSubmissionError();
			history.goBack();
		} else if (isVacancyClosedError(e)) {
			message.error(
				'Sorry! Your application cannot be submitted because this vacancy has been closed or is past the close date.'
			);
		} else {
			showGenericSubmissionError();
		}
	} finally {
		setConfirmLoading(false);
		checkAuth(setConfirmLoading, setAuth);
	}
};

export default submitEditedApp;
