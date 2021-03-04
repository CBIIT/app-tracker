import { useState } from 'react';
import { Modal, Steps } from 'antd';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

import './ConfirmSubmitModal.css';

const confirmSubmitModal = (props) => {
	const [confirmLoading, setConfirmLoading] = useState(false);

	const [submitted, setSubmitted] = useState(false);

	const { Step } = Steps;
	const [currentStep, setCurrentStep] = useState(0);
	const history = useHistory();

	const steps = [
		{
			step: 1,
			title: 'Finalize Vacancy',
		},
		{
			step: 2,
			title: 'Confirmed!',
		},
	];

	const handleOk = async () => {
		setConfirmLoading(true);
		setTimeout(() => {
			setConfirmLoading(false);
			setCurrentStep(currentStep + 1);
			setSubmitted(true);
		}, 2000);
	};

	const handleClose = () => {
		history.push('/vacancy-dashboard');
	};

	const stepper = (
		<Steps current={currentStep} direction='horizontal'>
			{steps.map((item) => (
				<Step
					key={item.title}
					title={item.title}
					description={item.description}
				/>
			))}
		</Steps>
	);

	let modal = (
		<Modal
			title={stepper}
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
				<h2>Ready to finalize vacancy?</h2>
				<p>
					The vacancy will launch on the pre-determined open date and will stop
					collecting applicants on the close date.
				</p>
			</div>
		</Modal>
	);

	if (submitted) {
		modal = (
			<Modal
				title={stepper}
				visible={props.visible}
				onOk={handleClose}
				okButtonProps={{ ghost: true }}
				confirmLoading={confirmLoading}
				cancelButtonProps={{ style: { display: 'none' } }}
				onCancel={props.onCancel}
				closable={false}
				className='ModalConfirmed'
				okText='Close'
			>
				<div className='Confirmed'>
					<CheckCircleFilled className='ConfirmedIcon' />
					<h2>Vacancy finalized</h2>
				</div>
			</Modal>
		);
	}

	return modal;
};

export default confirmSubmitModal;
