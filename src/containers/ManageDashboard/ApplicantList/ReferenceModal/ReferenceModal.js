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

	return (
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
				Notifications to this applicant&apos;s selected references have already been
				sent. Would you like to send the notifications again?
			</Paragraph>
		</Modal>
	);
};

export default referenceModal;
