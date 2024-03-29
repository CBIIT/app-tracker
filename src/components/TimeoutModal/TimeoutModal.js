import { useState, useEffect } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../../constants/ApiEndpoints';
import useAuth from '../../hooks/useAuth';
import useTimeout from '../../hooks/useTimeout';
import { Modal, Typography, Button } from 'antd';
const { Paragraph } = Typography;

const TimeoutModal = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { auth, setAuth } = useAuth();
	const { setModalTimeout } = useTimeout();
	let fullTimeoutDuration = auth.sessionTimeout;
	let uiTimeout = auth.sessionTimeout * 0.9;
	let remainingTime = auth.sessionTimeout - uiTimeout;
	let timeout;

	useEffect(() => {
		// show modal after 90% of session time has elapsed
		setTimeout(fullTimeoutDuration);
		setModalTimeout(uiTimeout);
		const showModal = () => {
			timeout = setTimeout(() => {
				setIsModalOpen(true);
				setModalTimeout(0);
			}, uiTimeout);
		};
		const autoCloseModal = () => {
			timeout = setTimeout(() => {
				// log user out
				setIsModalOpen(false);
				setModalTimeout(auth.sessionTimeout * 0.1);
				location.href = '/logout.do';
			}, remainingTime);
		};

		// start timer
		if (!isModalOpen) {
			clearTimeout(timeout);
			showModal();
		} else {
			clearTimeout(timeout);
			autoCloseModal();
		}

		return () => {
			clearTimeout(timeout);
		};
	}, [isModalOpen]);

	const handleExtend = () => {
		// extend user session
		refreshAuth();
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		location.href = '/logout.do';
	};

	const refreshAuth = async () => {
		const response = await axios.get(CHECK_AUTH);
		const data = response.data.result;
		setAuth({
			isUserLoggedIn: data.logged_in,
			iTrustGlideSsoId: data.itrust_idp,
			iTrustUrl: data.itrust_url,
			oktaGlideSsoId: data.okta_idp,
			sessionTimeout: data.session_timeout,
			user: {
				firstName: data.user.first_name,
				lastInitial: data.user.last_initial,
				uid: data.user.user_id,
				hasProfile: data.has_profile,
				tenant: data.user.tenant,
				isChair: data.is_chair,
				isManager: data.is_manager,
				isExecSec: data.is_exec_sec,
				hasApplications: data.user.has_applications,
				roles: data.user.roles,
			},
			oktaLoginAndRedirectUrl: data.okta_login_and_redirect_url,
		});
	};

	const { isUserLoggedIn } = auth;

	return isUserLoggedIn && (
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
