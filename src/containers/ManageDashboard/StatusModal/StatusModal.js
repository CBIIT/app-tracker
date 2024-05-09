import { useState } from 'react';
import { Modal, Typography } from 'antd';
const { Title, Paragraph } = Typography;
import { ExclamationCircleFilled, CheckCircleFilled } from '@ant-design/icons';

const StatusModal = (props) => {
    const status = props.status;

    const handleOk = () => {
        // send call to back end to change
    }

    const handleClose = () => {
        props.setModal(false)
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