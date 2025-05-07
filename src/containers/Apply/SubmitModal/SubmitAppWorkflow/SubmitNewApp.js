import axios from 'axios';
import { message, notification } from 'antd';
import {
	SAVE_APP_DRAFT,
	CREATE_APP_DOCS,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
	ATTACHMENT_CHECK,
	SUBMIT_APPLICATION,
} from '../../../../constants/ApiEndpoints';
import { transformJsonToBackend } from '../../Util/TransformJsonToBackend';

const submitNewApp = async (
	setConfirmLoading,
	data,
	draftId,
	setSubmitted,
	setPercent,
	setAppSysId,
	onCancel,
	returnToDocuments,
    checkAuth,
    setAuth
) => {
	const requests = [];
	// setConfirmLoading(true);

	let dataToSend = {
		jsonobj: JSON.stringify(data),
	};

	if (draftId) {
		dataToSend['draft_id'] = draftId;
	}

	const infoToSend = transformJsonToBackend(data);

	setSubmitted(true);

	const saveAppDraft = async () => {
		try {
			await axios.post(SAVE_APP_DRAFT, dataToSend);
			setPercent(20);
		} catch (e) {
			setSubmitted(false);
			message.error('Sorry! There was an error when attempting to submit your application.');
		} finally {
			createAppDocs();
		}
	};

	const createAppDocs = async () => {
		var documents;
		try {
			const saveDraftDocs = await axios.post(CREATE_APP_DOCS, data);
			documents = saveDraftDocs.data.result.response.vacancy_documents;
			setPercent(40);
		} catch (e) {
			setSubmitted(false);
			message.error('Sorry! There was an error when attempting to submit your application.');
		} finally {
			attachDocuments(documents);
		}
	};

	const attachDocuments = async (documents) => {
		try {
			const filesHashMap = new Map();
			infoToSend.vacancy_documents.forEach((document) =>
				document.file.fileList.forEach((file) =>
					filesHashMap.set(file.uid, file.originFileObj)
				)
			);

			documents.forEach((document) => {
				if (document.uid) {
					const file = filesHashMap.get(document.uid);

					const options = {
						params: {
							file_name: document.file_name,
							table_name: document.table_name,
							table_sys_id: document.table_sys_id,
						},
						headers: {
							'Content-Type': file.type,
						},
					};
					requests.push(axios.post(SERVICE_NOW_FILE_ATTACHMENT, file, options));
				}
			});

			await Promise.all(requests);
			setPercent(60);
		} catch (e) {
			setSubmitted(false);
			message.error('Sorry! There was an error when attempting to submit your application.');
		} finally {
			checkAttachments();
		}
	};

	const checkAttachments = async () => {
		var mandatoryDocuments;
		try {
			const verifyAttachments = await axios.get(ATTACHMENT_CHECK + draftId);
			mandatoryDocuments = verifyAttachments.data.result.messages;
			setPercent(80);
		} catch (e) {
			setSubmitted(false);
			message.error('Sorry! There was an error attempting to submit your application.');
		} finally {
			attachmentVerify(mandatoryDocuments);
		}
	};

	const attachmentVerify = async (mandatoryDocuments) => {
		var verify;

		// Filters out optional documents
		const filterOutOptional = mandatoryDocuments.filter(
			(doc) => doc.is_optional == 'false'
		);

		// Filters out the documents that return exists as false
		const filterByFalse = filterOutOptional.filter(
			(doc) => doc.exists == false
		);

		// If the length of the filterByFalse is greater than 0, return false, else return true
		if (filterByFalse.length > 0) {
			verify = false;
		} else {
			verify = true;
		}

		if (verify == true) {
			submitApplication();
		} else {
			mandatoryDocuments.map((doc) => {
				if (doc.attachSysId) {
					axios.delete(SERVICE_NOW_ATTACHMENT + doc.attachSysId);
				}
			});
			setSubmitted(false);
			notification.error({
				message: 'Sorry! There was an error with submitting your attachments.',
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
				duration: 0,
				style: {
					height: '225px',
					display: 'flex',
					alignItems: 'center',
				},
			});
			setPercent(false);
			onCancel();
			returnToDocuments();
		}
	};

	const submitApplication = async () => {
		var submitApp;
		try {
			submitApp = await axios.post(SUBMIT_APPLICATION, infoToSend);

			if (submitApp.data.result.status == 200) {
				setPercent(100);
				setAppSysId(submitApp.data.result.application_sys_id);
			}
		} catch (e) {
			setSubmitted(false);
			message.error(submitApp.data.result.response.message);
		} finally {
			setConfirmLoading(false);
			checkAuth(setConfirmLoading, setAuth);
		}
	};

	saveAppDraft();
};

export default submitNewApp;