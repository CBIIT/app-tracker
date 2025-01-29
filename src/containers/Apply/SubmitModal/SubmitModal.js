import { useState } from 'react';
import axios from 'axios';
import { Modal, message, notification, Progress } from 'antd';
import { useHistory, Link} from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { transformJsonToBackend } from '../Util/TransformJsonToBackend';
import './SubmitModal.css';
import {
	SUBMIT_APPLICATION,
	APPLICATION_SUBMISSION,
	SAVE_APP_DRAFT,
	CREATE_APP_DOCS,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
	ATTACHMENT_CHECK,
	ATTACHMENT_CHECK_FOR_APPLICATIONS,
} from '../../../constants/ApiEndpoints';
import { VIEW_APPLICATION } from '../../../constants/Routes';
import useAuth from '../../../hooks/useAuth';
import { checkAuth } from '../../../constants/checkAuth';

const submitModal = ({
	data,
	draftId,
	visible,
	onCancel,
	editSubmitted,
	submittedAppSysId,
}) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [appSysId, setAppSysId] = useState();
	const [submitted, setSubmitted] = useState(false);
	const [percent, setPercent] = useState(false);

	const history = useHistory();

	const { setAuth } = useAuth();

	const handleOk = async () => {
		setConfirmLoading(true);
		try {
			const requests = [];

			const attachDocuments = async (infoToSend, documents) => {

				if (editSubmitted) {

					const documentsToDelete = infoToSend.vacancy_documents.map(
						(document) => {
							if (document?.uploadedDocument?.markedToDelete) {
								return axios.delete(
									SERVICE_NOW_ATTACHMENT + document.uploadedDocument.attachSysId
								).catch(function () {
									message.error('Sorry! There was an error when attempting to delete your documents.');
								});
							}
						}
					);

					const documentsToUpload = infoToSend.vacancy_documents.map(
						(document) => {
							if (document.file.file || document.file.fileList.length > 0) {
								const file = document.file.file ? document.file.file  : document.file.fileList[0];
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
								return axios.post(
									SERVICE_NOW_FILE_ATTACHMENT, file, options
								).catch(function () {
									message.error('Sorry! There was an error when attempting to attach your documents.');
								});
							}
						}
					);

					await Promise.all([...documentsToDelete, ...documentsToUpload]);
					return;

				} else {

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
							requests.push(
								axios.post(
									SERVICE_NOW_FILE_ATTACHMENT, file, options
								).catch(function () {
									message.error('Sorry! There was an error when attempting to attach your documents.');
								})
							);
						}
					});

					await Promise.all(requests);

					return;
				}

			};

			const checkAttachments = (documents) => {
				// Filters out optional documents
				const filterOutOptional = documents.filter((doc) => doc.is_optional == 'false');

				// Filters out the documents that return exists as false
				const filterByFalse = filterOutOptional.filter((doc) => doc.exists == false);
				
				// If the length of the filterByFalse is greater than 0, return false, else return true
				if (filterByFalse.length > 0) {
					return false;
				} else {
					return true;
				}
			};

			const infoToSend = transformJsonToBackend(data);

			if (editSubmitted) {

				infoToSend['app_sys_id'] = submittedAppSysId;
				setSubmitted(true);

				await attachDocuments(infoToSend);
				setPercent(33);
				
				const checkDocuments = await axios.get(
					ATTACHMENT_CHECK_FOR_APPLICATIONS + submittedAppSysId
				).catch(function () {
					message.error('Sorry! There was an error when attempting to verify your documents.');
				});
				const mandatoryDocuments = checkDocuments.data.result.messages;
				setPercent(66);

				if (checkAttachments(mandatoryDocuments) == true) {
					await axios.put(
						APPLICATION_SUBMISSION, infoToSend
					).catch(function () {
						message.error('Sorry! There was an error when attempting to submit your application.');
					});
					setAppSysId(submittedAppSysId);
					await Promise.all(requests);
				} else {
					setSubmitted(false);
					notification.error({
						message:'Sorry! There was an error with submitting the attachments.',
						description:(
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
							height: '25vh',
							display: 'flex',
							alignItems: 'center',
						},
					});
					// history.goBack();
				}

			} else {
				let dataToSend = {
					jsonobj: JSON.stringify(data),
				};

				if (draftId) {
					dataToSend['draft_id'] = draftId;
				}
				
				setSubmitted(true);

				await axios.post(SAVE_APP_DRAFT, dataToSend);
				setPercent(20);

				// creates a filename on application document table for each vacancy document
				const saveDraftDocs = await axios.post(CREATE_APP_DOCS, data);
				setPercent(40);

				const documents = saveDraftDocs.data.result.response.vacancy_documents;
				await attachDocuments(infoToSend, documents);
				setPercent(60);

				const verifyAttachments = await axios.get(ATTACHMENT_CHECK + draftId);
				setPercent(80);
				const mandatoryDocuments = verifyAttachments.data.result.messages;

				if (checkAttachments(mandatoryDocuments) == true) {
					const response = await axios.post(SUBMIT_APPLICATION, infoToSend);
					setAppSysId(response.data.result.application_sys_id);
					await Promise.all(requests);
				} else {
					setSubmitted(false);
					notification.error({
						message:'Sorry! There was an error with submitting the attachments.',
						description:(
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
							height: '25vh',
							display: 'flex',
							alignItems: 'center',
						},
					});
					// history.goBack();
				}

				await Promise.all(requests);
			}
			setSubmitted(true);
		} catch (error) {
			message.error(
				'Sorry!  There was an error when attempting to submit your application or it is past the close date.'
			);
		} finally {
			setConfirmLoading(false);
			setPercent(100);
			checkAuth(setConfirmLoading, setAuth);
		}
	};

	const handleClose = () => {
		history.push('/');
	};

	return !submitted ? (
		<Modal
			visible={visible}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={onCancel}
			closable={false}
			okText='Ok'
			cancelText='Cancel'
		>
			<div className='ConfirmSubmitModal'>
				<ExclamationCircleFilled
					style={{ color: '#faad14', fontSize: '24px' }}
				/>
				<h2>Ready to submit application?</h2>
				<p>Please ensure that the correct documents have been submitted.</p>
				<p>
					Once the application is submitted, and the close date has been
					reached, it cannot be edited.
				</p>
			</div>
		</Modal>
	) : (
		<Modal
			visible={visible}
			onOk={handleClose}
			okButtonProps={{ ghost: true }}
			confirmLoading={confirmLoading}
			cancelButtonProps={{ style: { display: 'none' } }}
			onCancel={onCancel}
			closable={false}
			className='ModalConfirmed'
			okText='Done'
		>
			{percent < 100 ? (
				<div className='Confirmed'>
					<h2>Application is being submitted</h2>
					<p>
						Please do not close or refresh the browser window while the system
						is uploading your application.
					</p>
					<Progress type='circle' percent={percent} />
				</div>
			) : (
				<div className='Confirmed'>
					<CheckCircleFilled className='ConfirmedIcon' />
					<h2>Application Submitted</h2>
					<p>
						{/* View and print <Link to={VIEW_APPLICATION + appSysId}>here</Link>. */}
					</p>
			</div>
			)}
		</Modal>
	);
};

export default submitModal;
