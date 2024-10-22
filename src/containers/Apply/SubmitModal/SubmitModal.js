import { useState } from 'react';
import axios from 'axios';
import { Modal, message } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { transformJsonToBackend } from '../Util/TransformJsonToBackend';
import './SubmitModal.css';
import {
	SUBMIT_APPLICATION,
	APPLICATION_SUBMISSION,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
	ATTACHMENT_CHECK,
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

	const history = useHistory();

	const { setAuth } = useAuth();

	const handleOk = async () => {

		setConfirmLoading(true);

		try {
			const dataToSend = transformJsonToBackend(data);

			if (editSubmitted) {
				dataToSend['app_sys_id'] = submittedAppSysId;
				
				// TODO: check mandatory documents

				await axios.put(APPLICATION_SUBMISSION, dataToSend);

				// const documentsToDelete = dataToSend.vacancy_documents.map(
				// 	(document) => {
				// 		if (document?.uploadedDocument?.markedToDelete) {
				// 			return axios.delete(
				// 				SERVICE_NOW_ATTACHMENT + document.uploadedDocument.attachSysId
				// 			);
				// 		}
				// 	}
				// );

				// const documentsToUpload = dataToSend.vacancy_documents.map(
				// 	(document) => {
				// 		if (document.file.file) {
				// 			const file = document.file.file;
				// 			const options = {
				// 				params: {
				// 					file_name: document.file.file.name,
				// 					table_name: document.table_name,
				// 					table_sys_id: document.table_sys_id,
				// 				},
				// 				headers: {
				// 					'Content-Type': document.file.file.type,
				// 				},
				// 			};

				// 			return axios.post(SERVICE_NOW_FILE_ATTACHMENT, file, options);
				// 		}
				// 	}
				// );
				
				// verify mandatory documents have been uploaded
				
				//await Promise.all([...documentsToDelete, ...documentsToUpload]);

				setAppSysId(submittedAppSysId);

			} else {
				if (draftId) dataToSend['draft_id'] = draftId;
				console.log(draftId)

				const requests = [];

				const appDocResponse = await axios.get(ATTACHMENT_CHECK + draftId);

				const checkattachments = () => {
					for (let i = 0; i < appDocResponse.data.result.messages.length; i++) {
						if (appDocResponse.data.result.messages[i].exists == true) {
							return true;
						} else {
							return false;
						}
					}
				};

				if (appDocResponse.data.result.messages.length > 0) {
					if (checkattachments() == true) {
						const response = await axios.post(SUBMIT_APPLICATION, dataToSend);
						setAppSysId(response.data.result.application_sys_id);
						await Promise.all(requests);
					} else {
						notification.error('Sorry! There was an error with submitting the attachments. Please re-upload the attachment(s) and try again.');
						console.log('Sorry! There was an error with submitting attachment. Please re-upload the attachment(s) and try again.');
						history.goBack();
					}
				} else {
					const response = await axios.post(SUBMIT_APPLICATION, dataToSend);
					setAppSysId(response.data.result.application_sys_id);
					await Promise.all(requests);
				};

			}

			setSubmitted(true);

		} catch (error) {
			console.log(error)
			message.error(
				'Sorry!  There was an error when attempting to submit your application or it is past the close date.'
			);
		} finally {
			setSubmitted(true);
			setConfirmLoading(false);
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
			<div className='Confirmed'>
				<CheckCircleFilled className='ConfirmedIcon' />
				<h2>Application Submitted</h2>
				<p>
					View and print <Link to={VIEW_APPLICATION + appSysId}>here</Link>.
				</p>
			</div>
		</Modal>
	);
};

export default submitModal;
