import { Button, Modal, Typography } from 'antd';
const { Paragraph } = Typography;
import { WarningOutlined } from '@ant-design/icons';
import { useState } from 'react';

const referenceModal = (props) => {
	
	const referenceModal = props.referenceModal;
	const setReferenceModal = props.setReferenceModal;

	const referenceSysId = props.refSysId;
	const referencesRequested = props.referencesRequested;
	const maxTries = props.maxTries;

	const requestReference = props.requestReference;
	const callback = props.reloadApplicationInfo;

	const [isSubmitting, setIsSubmitting] = useState(false);
	

	const handleReferenceSubmit = async () => {
		setIsSubmitting(true);
		try {
			await requestReference(referenceSysId);
			await callback();
			setReferenceModal(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReferenceCancel = () => {
		setReferenceModal(false);
	};

	return referencesRequested === '0'? (
		<Modal
			title={
				<Paragraph>
					<WarningOutlined /> Ready To Send Email for Reference Letter Collection
				</Paragraph>
			}
			open={referenceModal}
			onOk={handleReferenceSubmit}
			onCancel={handleReferenceCancel}
			closable={false}
			footer={[
				<Button key='modal-button' data-testid='send-email-button' onClick={handleReferenceSubmit} disabled={isSubmitting} loading={isSubmitting}>
					Send Email
				</Button>,
				<Button key='modal-continue' onClick={handleReferenceCancel} disabled={isSubmitting}>
					Cancel
				</Button>,
			]}
		>
			<Paragraph>
				Are you sure you want to send the Reference Letter Collection email to
				this reference? The notifications will be sent immediately upon your confirmation.
				<br></br>
				<br></br>Please note that you can only request a maximum of {maxTries} reference letters per reference.
			</Paragraph>
		</Modal>
	) : (
		<Modal
			title={
				<Paragraph>
					<WarningOutlined /> Reference Letter Collection Email Have Already Been Sent.				
				</Paragraph>
			}
			open={referenceModal}
			onOk={handleReferenceSubmit}
			onCancel={handleReferenceCancel}
			closable={false}
			footer={[
				<Button key='modal-button' 
					data-testid='send-email-again-button'
					disabled={isSubmitting || (referencesRequested >= maxTries)}
					loading={isSubmitting}
					onClick={handleReferenceSubmit}>
					Send Email Again
				</Button>,
				<Button key='modal-continue' onClick={handleReferenceCancel} disabled={isSubmitting}>
					Cancel
				</Button>,
			]}
		>
			{referencesRequested >= maxTries ? (
				<Paragraph>
					You have reached the maximum number of reference letter requests ({maxTries}) for this references.
				</Paragraph>
			) : 
			<Paragraph>
				Notifications to this reference have already been sent {referencesRequested} 
				{referencesRequested === '1' ? ' time' : ' times'}. Would you like to send another email?
				<br></br>
				<br></br>Please note that you can only request a maximum of {maxTries} letters per reference.
			</Paragraph>}
		</Modal>
	);
};

export default referenceModal;
