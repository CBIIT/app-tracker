import { useState } from 'react';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import './SubmitModal.css';

const submitModal = (props) => {
	const [confirmLoading, setConfirmLoading] = useState(false);

	const [submitted, setSubmitted] = useState(false);

	const history = useHistory();

	const handleOk = async () => {
		setConfirmLoading(true);
		// const dataToSend = transformJsonToBackend(props.data);
		try {
			// TODO: Implement actual sending of data to backend.
			// await axios.post(
			// 	'/api/x_g_nci_app_tracke/vacancy/submit_vacancy',
			// 	dataToSend
			// );
			await new Promise((resolve) => {
				setTimeout(resolve, 2000);
			});
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
