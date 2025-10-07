import { Modal, message, notification } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { SEND_TOP25_EMAILS } from "../../../constants/ApiEndpoints";
import axios from "axios";

const EmailModal = (props) => {
    const handleOk = async () => {
        try {
            const endpoint = SEND_TOP25_EMAILS.replace('{vacancy_id}', props.sysId);
            const top25EmailResponse = await axios.post(endpoint);
            const emailResponse = top25EmailResponse.data.result.message;
            message.success(emailResponse);
            props.setEmailButtonDisabled(true);
            await props.handleCloseModal();
        } catch (error) {
            console.log(error);
            await props.handleCloseModal();
            notification.error({
                message: 'Sorry! There was an error attempting to send the emails.',
                description: (
                    <>
                        <p>
                            Please try again. If the issue continues, contact the Help Desk{' '}
                            <a href='mailto:NCIAppSupport@mail.nih.gov'>
                                NCIAppSupport@mail.nih.gov
                            </a>
                        </p>
                    </>
                ),
                duration: 0,
                style: {
						height: '225px',
						display: 'flex',
						alignItems: 'center',
                },
            });
        }
    }

    const handleCancel = async () => {
        await props.handleCloseModal();
    }

    return (
        <Modal
            visible={props.visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Okay'
            cancelText='Cancel'
        >
            <div className='confirmEmailModal'>
                <ExclamationCircleFilled 
                    style={{ color: '#faad14', fontSize: '24px' }}
                />
                <h2>Are you sure you want to send both Complimentary and Regret Emails?</h2>
                <p>Individuals who have been identified as the top 25% will receive the Complimentary email and all other individuals will receive the Regret email.</p>
                <p>Please note that once this notification has been sent, you will not be able to send the notifications again.</p>
            </div>
        </Modal>
    )
}

export default EmailModal;