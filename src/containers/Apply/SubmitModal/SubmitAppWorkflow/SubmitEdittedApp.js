import axios from 'axios';
import { message, notification } from 'antd';
import {
	APPLICATION_SUBMISSION,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
	ATTACHMENT_CHECK_FOR_APPLICATIONS,
} from '../../../../constants/ApiEndpoints';
import { transformJsonToBackend } from '../../Util/TransformJsonToBackend';

const submitEdittedApp = async () => {
	const requests = [];
	const infoToSend = transformJsonToBackend(data);
	infoToSend['app_sys_id'] = submittedAppSysId;

	// setConfirmLoading(true);
	setSubmitted(true);
	setPercent(25);

	const attachDocuments = async () => {
		try {
			const documentsToDelete = infoToSend.vacancy_documents.map((document) => {
				if (document?.uploadedDocument?.markedToDelete) {
					return axios.delete(
						SERVICE_NOW_ATTACHMENT + document.uploadedDocument.attachSysId
					);
				}
			});

			const documentsToUpload = infoToSend.vacancy_documents.map((document) => {
				if (document.file.file || document.file.fileList.length > 0) {
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
				}
			});

			await Promise.all([...documentsToDelete, ...documentsToUpload]);
			setPercent(50);
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
			const verifyAttachments = await axios.get(
				ATTACHMENT_CHECK_FOR_APPLICATIONS + submittedAppSysId
			);
			mandatoryDocuments = verifyAttachments.data.result.messages;
			setPercent(75);
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
			submitApp();
		} else {
			setSubmitted(false);
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
			history.goBack();
		}
	};

    const submitApp = async () => {
        var submitApp;
        try {
            submitApp = await axios.put(APPLICATION_SUBMISSION, infoToSend);

            if (submitApp.data.result.status == 200) {
                setPercent(100);
                setAppSysId(submittedAppSysId);
            }
            await Promise.all(requests);
        } catch (e) {
            setSubmitted(false);
            message.error(submitApp.data.result.message);
        } finally {
            setConfirmLoading(false);
			checkAuth(setConfirmLoading, setAuth);
        }
    }

	attachDocuments();
};

export default submitEdittedApp;
