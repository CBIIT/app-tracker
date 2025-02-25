import { Button, Modal, Typography } from 'antd';
const { Paragraph } = Typography;
import { WarningOutlined } from '@ant-design/icons';

const referenceModal = (props) => {
	const sendReferences = props.sendReferences;

	const handleReferenceSubmit = () => {
		sendReferences(props.appSysId);
		props.setShowModal(false);
	};

	const handleReferenceCancel = () => {
		props.setShowModal(false);
	};

	return props.referencesSent === '0' ? (
		<Modal
			title={
				<Paragraph>
					<WarningOutlined /> Ready To Send Reference Notifications
				</Paragraph>
			}
			open={props.showModal}
			onOk={handleReferenceSubmit}
			onCancel={handleReferenceCancel}
			closable={false}
			footer={[
				<Button key='modal-button' onClick={handleReferenceSubmit}>
					Send References
				</Button>,
				<Button key='modal-continue' onClick={handleReferenceCancel}>
					Cancel
				</Button>,
			]}
		>
			<Paragraph>
				Are you sure you want to send the Reference Letter collection e-mails to
				the listed references for this applicant? The notifications will be sent
				immediately upon your confirmation.
			</Paragraph>
		</Modal>
	) : (
		<Modal
			title={
				<Paragraph>
					<WarningOutlined /> Reference Notifications Have Been Sent
				</Paragraph>
			}
			open={props.showModal}
			onOk={handleReferenceSubmit}
			onCancel={handleReferenceCancel}
			closable={false}
			footer={[
				<Button key='modal-button' onClick={handleReferenceSubmit}>
					Send References Again
				</Button>,
				<Button key='modal-continue' onClick={handleReferenceCancel}>
					Cancel
				</Button>,
			]}
		>
			<Paragraph>
				Notifications to this applicant&apos;s selected references have already
				been sent. Would you like to send the notifications again?
			</Paragraph>
		</Modal>
	);
};

export default referenceModal;
