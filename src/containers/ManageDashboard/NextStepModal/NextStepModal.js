import { useState } from 'react';
import { Modal, Steps } from 'antd';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

const confirmSubmitModal = (props) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const { Step } = Steps;

	const handleOk = async () => {
		setConfirmLoading(true);
		try {
			await props.handleOk();
			setCurrentStep(currentStep + 1);
			setSubmitted(true);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log('[ConfirmSubmitModal] error:' + error);
		}
		setConfirmLoading(false);
	};

	const handleClose = async () => {
		await props.handleCloseModal();
		setConfirmLoading(false);
		setSubmitted(false);
		setCurrentStep(0);
	};

	const stepper = (
		<Steps current={currentStep} direction='horizontal'>
			{props.steps.map((item) => (
				<Step
					key={item.title}
					title={item.title}
					description={item.description}
				/>
			))}
		</Steps>
	);

	return !submitted ? (
		<Modal
			title={stepper}
			visible={props.visible}
			onOk={handleOk}
			confirmLoading={confirmLoading}
			onCancel={handleClose}
			closable={false}
		>
			<div className='ConfirmSubmitModal'>
				<ExclamationCircleFilled
					style={{ color: '#faad14', fontSize: '24px' }}
				/>
				<h2>{props.confirmTitle}</h2>
				<p>{props.confirmDescription}</p>
			</div>
		</Modal>
	) : (
		<Modal
			title={stepper}
			visible={props.visible}
			onOk={handleClose}
			okButtonProps={{ ghost: true }}
			confirmLoading={confirmLoading}
			cancelButtonProps={{ style: { display: 'none' } }}
			onCancel={handleClose}
			closable={false}
			className='ModalConfirmed'
			okText='Close'
		>
			<div className='Confirmed'>
				<CheckCircleFilled className='ConfirmedIcon' />
				<h2>{props.submittedTitle}</h2>
				<p>{props.submittedDescription}</p>
			</div>
		</Modal>
	);
};

export default confirmSubmitModal;
