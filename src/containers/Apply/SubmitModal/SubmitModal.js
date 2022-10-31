import { useState } from 'react';
import axios from 'axios';
import { Modal, message } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { transformJsonToBackend } from '../Util/TransformJsonToBackend';
import './SubmitModal.css';
import { SUBMIT_APPLICATION } from '../../../constants/ApiEndpoints';
import { VIEW_APPLICATION } from '../../../constants/Routes';

const submitModal = ({ data, draftId, visible, onCancel }) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [appSysId, setAppSysId] = useState();
	const [submitted, setSubmitted] = useState(false);

	const history = useHistory();

	const handleOk = async () => {
		setConfirmLoading(true);

		try {
			const dataToSend = transformJsonToBackend(data);

			if (draftId) dataToSend['draft_id'] = draftId;

			const response = await axios.post(SUBMIT_APPLICATION, dataToSend);

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
					requests.push(axios.post('/api/now/attachment/file', file, options));
				}
			});

			await Promise.all(requests);
			setConfirmLoading(false);
			setSubmitted(true);
		} catch (error) {
			setConfirmLoading(false);
			message.error(
				'Sorry!  There was an error when attempting to submit your application or it is past the close date.'
			);
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
			okText='ok'
			cancelText='cancel'
		>
			<div className='ConfirmSubmitModal'>
				<ExclamationCircleFilled
					style={{ color: '#faad14', fontSize: '24px' }}
				/>
				<h2>Ready to submit application?</h2>
				<p>Once the application is submitted it cannot be edited.</p>
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
			okText='done'
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
