import { useState } from 'react';
import axios from 'axios';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { transformJsonToBackend } from '../Util/TransformJsonToBackend';
import './SubmitModal.css';

const submitModal = (props) => {
	const [confirmLoading, setConfirmLoading] = useState(false);

	const [submitted, setSubmitted] = useState(false);

	const history = useHistory();

	const handleOk = async () => {
		setConfirmLoading(true);

		try {
			const dataToSend = transformJsonToBackend(props.data);
			const response = await axios.post(
				'/api/x_g_nci_app_tracke/application/submit_app',
				dataToSend
			);

			const requests = [];
			const documents = response.data.result.vacancy_documents;

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
			// eslint-disable-next-line no-console
			console.log('[ConfirmSubmitModal] error:' + error);
		}
	};

	const handleClose = () => {
		history.push('/');
	};

	return !submitted ? (
		<Modal
			visible={props.visible}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={props.onCancel}
			closable={false}
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
			visible={props.visible}
			onOk={handleClose}
			okButtonProps={{ ghost: true }}
			confirmLoading={confirmLoading}
			cancelButtonProps={{ style: { display: 'none' } }}
			onCancel={props.onCancel}
			closable={false}
			className='ModalConfirmed'
			okText='Done'
		>
			<div className='Confirmed'>
				<CheckCircleFilled className='ConfirmedIcon' />
				<h2>Application Submitted</h2>
			</div>
		</Modal>
	);
};

export default submitModal;
