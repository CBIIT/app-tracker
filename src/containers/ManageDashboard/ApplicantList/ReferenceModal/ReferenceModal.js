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
					<WarningOutlined /> Ready To Send Reference Letter Collection Notifications
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
				Are you sure you want to send the Reference Letter Collection emails to
				the listed references for this applicant? The notifications will be sent
				immediately upon your confirmation.
			</Paragraph>
		</Modal>
	) : (
		<Modal
			title={
				<Paragraph>
					<WarningOutlined /> Reference Letter Collection Notifications Have Already Been Sent.
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
				Notifications to this applicant&apos;s listed references have already
				been sent. Would you like to send the Reference Letter Collection emails again?
			</Paragraph>
		</Modal>
	);
};

export default referenceModal;
