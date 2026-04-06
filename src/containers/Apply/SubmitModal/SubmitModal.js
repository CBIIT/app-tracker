import { useState } from 'react';
import { Modal, Progress } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import './SubmitModal.css';
import { VIEW_APPLICATION } from '../../../constants/Routes';
import useAuth from '../../../hooks/useAuth';
import { checkAuth } from '../../../constants/checkAuth';
import submitNewApp from './SubmitAppWorkflow/SubmitNewApp';
import submitEditedApp from './SubmitAppWorkflow/SubmitEditedApp';

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

		if (editSubmitted) {
			submitEditedApp(
				setConfirmLoading,
				data,
				submittedAppSysId,
				setSubmitted,
				setPercent,
				setAppSysId,
				history,
				checkAuth,
				setAuth
			)
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
					<Progress type='circle' percent={percent} data-testid='percent-bar'/>
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
