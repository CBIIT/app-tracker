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
import { logError, logInfo } from '../../../../utils/logging/logging';
import {ComponentName } from '../../../../utils/logging/logConstants';

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

	let dataToSend = {
		jsonobj: JSON.stringify(data),
	};

	const infoToSend = transformJsonToBackend(data);
	
	if (draftId) {
		dataToSend['draft_id'] = draftId
		infoToSend['draft_id'] = draftId
	}

	setSubmitted(true);

	const saveAppDraft = async () => {
		try {
			await axios.post(SAVE_APP_DRAFT, dataToSend);
			setPercent(20);
			logInfo('Application draft saved successfully', { draftId: draftId, percent: 20 }, ComponentName.SUBMIT_NEW_APP);
		} catch (e) {
			setSubmitted(false);
			logError('Error saving application draft', { draftId: draftId, error: e }, ComponentName.SUBMIT_NEW_APP);
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
			logInfo('Application documents created successfully', { draftId: draftId, percent: 40 }, 'SubmitNewApp');
		} catch (e) {
			setSubmitted(false);
			logError('Error creating application documents', { draftId: draftId, error: e }, 'SubmitNewApp');
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
					logInfo('Attaching document', { draftId: draftId, fileName: document.file_name }, ComponentName.SUBMIT_NEW_APP);
				}
			});

			await Promise.all(requests);
			setPercent(60);
			logInfo('All documents attached successfully', { draftId: draftId, percent: 60 }, ComponentName.SUBMIT_NEW_APP);
		} catch (e) {
			setSubmitted(false);
			logError('Error attaching documents', { draftId: draftId, error: e }, ComponentName.SUBMIT_NEW_APP);
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
			logInfo('Attachments verified successfully', { draftId: draftId, percent: 80 }, ComponentName.SUBMIT_NEW_APP);
		} catch (e) {
			setSubmitted(false);
			logError('Error verifying attachments', { draftId: draftId, error: e }, ComponentName.SUBMIT_NEW_APP);
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
		} finally {
			attachmentVerify(mandatoryDocuments);
		}
	};

	const attachmentVerify = async (mandatoryDocuments) => {
		var verify;

		// Filters out optional documents
		const filterOutOptional = mandatoryDocuments ?
		mandatoryDocuments.filter((doc) => doc.is_optional == 'false') : null;

		// Filters out the documents that return exists as false
		const filterByFalse = filterOutOptional ?
		filterOutOptional.filter((doc) => doc.exists == false) : null;

		// If the length of the filterByFalse is greater than 0, return false, else return true
		if (filterByFalse && filterByFalse.length > 0) {
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
					logInfo('Deleting attachment due to missing mandatory document', { draftId: draftId, attachSysId: doc.attachSysId }, ComponentName.SUBMIT_NEW_APP);
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

	const submitApp = {};
	const submitApplication = async () => {
		try {
			submitApp = await axios.post(SUBMIT_APPLICATION, infoToSend);

			if (submitApp.data.result.status == 200) {
				setPercent(100);
				setAppSysId(submitApp.data.result.application_sys_id);
				logInfo('Application submitted successfully', { draftId: draftId, application_sys_id: submitApp.data.result.application_sys_id, status: submitApp.data.result.status, percent: 100 }, ComponentName.SUBMIT_NEW_APP);
			}
		} catch (e) {
			logError('Error submitting application', { draftId: draftId, error: e }, ComponentName.SUBMIT_NEW_APP);
			if (e == 'Error: Request failed with status code 400') {
				message.error('Sorry! Your application cannot be submitted because this vacancy has been closed or is past the close date.');
			} else {
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
			}
			setSubmitted(false);
		} finally {
			logInfo('Submit application process completed', { draftId: draftId, application_sys_id: submitApp.data.result.application_sys_id || 'null' , status: submitApp.data.result.status || 'null'}, ComponentName.SUBMIT_NEW_APP);
			setConfirmLoading(false);
			checkAuth(setConfirmLoading, setAuth);
		}
	};

	saveAppDraft();
};

export default submitNewApp;