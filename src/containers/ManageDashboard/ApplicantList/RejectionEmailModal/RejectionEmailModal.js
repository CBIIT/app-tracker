import { Button, Modal, Typography } from 'antd';
const { Paragraph } = Typography;
import { WarningOutlined } from '@ant-design/icons';

const rejectionEmailModal = (props) => {
    // console.log('RejectionEmailModal props:', props);
	const appSysId = props.appSysId;
	const rejectionEmailSent = props.rejectionEmailSent;
	const sendRejectionEmail = props.sendRejectionEmail;
	const setRejectionEmailModal = props.setRejectionEmailModal;
	const rejectionEmailModal = props.rejectionEmailModal;

	const handleRejectionEmailSubmit = () => {
		sendRejectionEmail(appSysId);
		setRejectionEmailModal(false);
	};

	const handleRejectionEmailCancel = () => {
		setRejectionEmailModal(false);
	};

	return rejectionEmailSent === '0' ? (
		<Modal
			title={
				<Paragraph>
					<WarningOutlined /> Ready to Send Rejection Email
				</Paragraph>
			}
			open={rejectionEmailModal}
			onOk={handleRejectionEmailSubmit}
			onCancel={handleRejectionEmailCancel}
			closable={false}
			footer={[
				<Button key='modal-button' onClick={handleRejectionEmailSubmit}>
					Send Rejection Email
				</Button>,
				<Button key='modal-cancel' onClick={handleRejectionEmailCancel}>
					Cancel
				</Button>,
			]}
		>
			<Paragraph>
				Are you sure you want to send the rejection email to this applicant? The
				email will be sent immediately upon your confirmation.
			</Paragraph>
		</Modal>
	) : (
		<Modal

        >
        </Modal>
	);
};

export default rejectionEmailModal;