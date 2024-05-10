import { useState } from 'react';
import axios from 'axios';
import { Modal, Typography, message } from 'antd';
const { Title, Paragraph } = Typography;
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { CHANGE_VACANCY_STATUS } from '../../../constants/ApiEndpoints';

const StatusModal = (props) => {
    const status = props.status;
    const [isLoading, setIsLoading] = useState(false);

    const handleOk = async () => {
        // send call to back end to change
        setIsLoading(true);
        try {
            await axios.post(CHANGE_VACANCY_STATUS + props.sysId);
            message.success('Status changed!');
        } catch (error) {
            console.log(error);
            message.error('Sorry! There was an error processing the request.');
        }
        setIsLoading(false);
        props.setModal(false);
        props.loadVacancy();
    }

    const handleClose = () => {
        props.setModal(false);
        props.loadVacancy();
    }

    return (
			<Modal
				title={
					status == 'open' ? (
						<Title level={4}>
							<ExclamationCircleFilled style={{ color: '#faad14' }} /> 
                           {' '}Request to Close Vacancy?
						</Title>
					) : (
						<Title level={4}>
							<ExclamationCircleFilled style={{ color: '#faad14' }} /> 
                            {' '}Request to Open Vacancy?
						</Title>
					)
				}
				open={props.openModal}
				onOk={handleOk}
				onCancel={handleClose}
				closeable={false}
                confirmLoading={isLoading}
			>
				{status == 'open' ? (
					<Paragraph>
						Please be advised once the vacancy is closed additional applications
						will not be accepted and information pertaining to the vacancy
						cannot be edited. Are you sure you would like to close this vacancy?
					</Paragraph>
				) : (
					<Paragraph>
						Please be advised once the vacancy is open additional applications
						will be accepted and information pertaining to the vacancy may be
						edited. Are you sure you would like to open this vacancy?
					</Paragraph>
				)}
			</Modal>
		);
}

export default StatusModal;