import { useState } from 'react';
import axios from 'axios';
import { Modal, message, Progress } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { transformJsonToBackend } from '../Util/TransformJsonToBackend';
import './SubmitModal.css';
import {
	SUBMIT_APPLICATION,
	APPLICATION_SUBMISSION,
	SERVICE_NOW_FILE_ATTACHMENT,
	SERVICE_NOW_ATTACHMENT,
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
			const dataToSend = transformJsonToBackend(data);
			if (editSubmitted) {
				dataToSend['app_sys_id'] = submittedAppSysId;
				setSubmitted(true);
				await axios.put(APPLICATION_SUBMISSION, dataToSend);
				setPercent(50)
				const documentsToDelete = dataToSend.vacancy_documents.map(
					(document) => {
						if (document?.uploadedDocument?.markedToDelete) {
							return axios.delete(
								SERVICE_NOW_ATTACHMENT + document.uploadedDocument.attachSysId
							);
						}
					}
				);

				const documentsToUpload = dataToSend.vacancy_documents.map(
					(document) => {
						if (document.file.file) {
							const file = document.file.file;
							const options = {
								params: {
									file_name: document.file.file.name,
									table_name: document.table_name,
									table_sys_id: document.table_sys_id,
								},
								headers: {
									'Content-Type': document.file.file.type,
								},
							};

							return axios.post(SERVICE_NOW_FILE_ATTACHMENT, file, options);
						}
					}
				);

				await Promise.all([...documentsToDelete, ...documentsToUpload]);
				setAppSysId(submittedAppSysId);
			} else {
				if (draftId) dataToSend['draft_id'] = draftId;
				setSubmitted(true);
				const response = await axios.post(SUBMIT_APPLICATION, dataToSend);
				setPercent(50);

				const requests = [];
				const documents = response.data.result.vacancy_documents;
				setAppSysId(response.data.result.application_sys_id);

				const filesHashMap = new Map();
				dataToSend.vacancy_documents.forEach((document) =>
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
							axios.post(SERVICE_NOW_FILE_ATTACHMENT, file, options)
						);
					}
				});

				await Promise.all(requests);
			}
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
					<CheckCircleFilled className='ConfirmedIcon' />
					<h2>Application is being submitted</h2>
					<p>
						Please do not close or refresh the browser window while the system
						is uploading your application.
					</p>
					<Progress type='circle' percent={percent} />
				</div>
			) : (
				<div className='Confirmed'>
					<h2>Application Submitted</h2>
					<p>
						View and print <Link to={VIEW_APPLICATION + appSysId}>here</Link>.
					</p>
					<Progress type='circle' percent={percent} />
				</div>
			)}
		</Modal>
	);
};

export default submitModal;
