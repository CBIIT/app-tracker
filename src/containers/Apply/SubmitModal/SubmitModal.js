import { useState } from 'react';
import axios from 'axios';
import { Modal, notification, Progress } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import './SubmitModal.css';
import {
	APPLICATION_SUBMISSION,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
	ATTACHMENT_CHECK_FOR_APPLICATIONS,
} from '../../../constants/ApiEndpoints';
import { VIEW_APPLICATION } from '../../../constants/Routes';
import useAuth from '../../../hooks/useAuth';
import { checkAuth } from '../../../constants/checkAuth';
import submitNewApp from './SubmitAppWorkflow/SubmitNewApp';

const submitModal = ({
	data,
	draftId,
	visible,
	onCancel,
	editSubmitted,
	submittedAppSysId,
	returnToDocuments,
}) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [appSysId, setAppSysId] = useState();
	const [submitted, setSubmitted] = useState(false);
	const [percent, setPercent] = useState(false);

	const history = useHistory();

	const { setAuth } = useAuth();

	const handleOk = async () => {
		setConfirmLoading(true);

		// function to attach documents to the application
		const attachDocuments = async (infoToSend, documents) => {
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
			return;
		};

		const checkAttachments = (documents) => {
			// Filters out optional documents
			const filterOutOptional = documents.filter(
				(doc) => doc.is_optional == 'false'
			);

			// Filters out the documents that return exists as false
			const filterByFalse = filterOutOptional.filter(
				(doc) => doc.exists == false
			);

			// If the length of the filterByFalse is greater than 0, return false, else return true
			if (filterByFalse.length > 0) {
				return false;
			} else {
				return true;
			}
		};

		// functions that are called for edit application submission

		if (editSubmitted) {
			infoToSend['app_sys_id'] = submittedAppSysId;
			setSubmitted(true);
			setPercent(25);

			await attachDocuments(infoToSend);
			setPercent(50);

			const checkDocuments = await axios.get(
				ATTACHMENT_CHECK_FOR_APPLICATIONS + submittedAppSysId
			);
			const mandatoryDocuments = checkDocuments.data.result.messages;
			setPercent(75);

			if (checkAttachments(mandatoryDocuments) == true) {
				const submitApp = await axios.put(APPLICATION_SUBMISSION, infoToSend);
				if (submitApp.data.result.status == 200) {
					setPercent(100);
					setAppSysId(submittedAppSysId);
				}
				await Promise.all(requests);
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
		} else {
			submitNewApp(
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
			);
		}
	};

	// if variable catches error, make a call to delete documents

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
						View and print <Link to={VIEW_APPLICATION + appSysId}>here</Link>.
					</p>
				</div>
			)}
		</Modal>
	);
};

export default submitModal;
