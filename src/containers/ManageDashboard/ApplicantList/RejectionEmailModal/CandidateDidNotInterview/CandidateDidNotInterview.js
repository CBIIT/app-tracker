import { Button, Modal, Typography } from 'antd';
const { Paragraph } = Typography;
import { WarningOutlined } from '@ant-design/icons';

const candidateDidNotInterview = (props) => {
    const appSysId = props.appSysId;
    const rejectionEmailModal = props.rejectionEmailModal;
	const rejectionEmailSent = props.rejectionEmailSent;
	const sendRejectionEmail = props.sendRejectionEmail;
	const setRejectionEmailModal = props.setRejectionEmailModal;

    return rejectionEmailSent === '0' ? (
        <Modal
            title={
                <Paragraph>
                    <WarningOutlined /> Ready to Send Candidate Did Not Interview Rejection Email
                </Paragraph>
            }
            open={rejectionEmailModal}
            onOk={() => {
                sendRejectionEmail(appSysId);
                setRejectionEmailModal(false);
            }}
            onCancel={() => {
                setRejectionEmailModal(false);
            }}
            closable={false}
            footer={[
                <Button key='modal-button' onClick={() => {
                    sendRejectionEmail(appSysId);
                    setRejectionEmailModal(false);
                }}>
                    Send Rejection Email
                </Button>,
                <Button key='modal-cancel' onClick={() => {
                    setRejectionEmailModal(false);
                }}>
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
            title={
                <Paragraph>
                    <WarningOutlined /> Candidate Did Not Interview Rejection Email Already Sent.
                </Paragraph>
            }
            open={rejectionEmailModal}
            onOk={() => {
                sendRejectionEmail(appSysId);
                setRejectionEmailModal(false);
            }}
            onCancel={() => {
                setRejectionEmailModal(false);
            }}
            closable={false}
            footer={[
                <Button key='modal-button' onClick={() => {
                    sendRejectionEmail(appSysId);
                    setRejectionEmailModal(false);
                }}>
                    Send Rejection Email Again
                </Button>,
                <Button key='modal-cancel' onClick={() => {
                    setRejectionEmailModal(false);
                }}>
                    Cancel
                </Button>,
            ]}
        >
            <Paragraph>
                Are you sure you want to send the rejection email to this applicant again? The
                email will be sent immediately upon your confirmation.
            </Paragraph>
        </Modal>
    );
}

export default candidateDidNotInterview;