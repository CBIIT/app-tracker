import { useState, useEffect } from 'react';
import { Modal, Typography, Button } from 'antd';
const { Paragraph } = Typography;

const TimeoutModal = ({ checkAuth, sessionTimeout }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const uiTimeout = sessionTimeout * 0.9;
	const remainingTime = sessionTimeout - uiTimeout;
	useEffect(() => {
		// show modal after 90% of session time has elapsed
		const showModal = () => {
			setTimeout(() => {
				setIsModalOpen(true);
			}, uiTimeout);
		};
		const autoCloseModal = () => {
			setTimeout(() => {
				// log user out
				setIsModalOpen(false);
				location.href = '/logout.do';
			}, remainingTime);
		};

		// start timer
		let timeout = isModalOpen ? autoCloseModal() : showModal();

		if (!isModalOpen) {
			clearTimeout(timeout);
			timeout = showModal();
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [isModalOpen]);

	const handleExtend = () => {
		// extend user session
		checkAuth();
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<Modal
				title='Session Timeout'
				open={isModalOpen}
				onOk={handleExtend}
				onCancel={handleCancel}
				closable={false}
				footer={[
					<Button key='modal-extend' type='primary' onClick={handleExtend}>
						Extend
					</Button>,
					<Button key='modal-logout' onClick={handleCancel}>
						Logout
					</Button>,
				]}
			>
				<Paragraph>
					Your session is about to expire. Please choose to extend your session
					or to logoff. Otherwise, you will be logged out automatically.
				</Paragraph>
			</Modal>
		</>
	);
};

export default TimeoutModal;
