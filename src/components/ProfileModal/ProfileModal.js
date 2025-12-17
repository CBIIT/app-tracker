import useAuth from '../../hooks/useAuth';
import { Modal, Typography, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import {
	PROFILE,
	REGISTER_OKTA
} from '../../constants/Routes';

const { Paragraph } = Typography;

const ProfileModal = (props) => {
	const {
		auth: { isUserLoggedIn, user, oktaLoginAndRedirectUrl },
	} = useAuth();
	const history = useHistory();

	const handleRegistration = () => {
		history.push(REGISTER_OKTA, "_blank")
	};

	const handleLogin = () => {
		window.open(oktaLoginAndRedirectUrl, "_blank")
	};

	const handleContinue = () => {
		props.handleClose();
	};

	const handleFinishProfile = () => {
		history.push(PROFILE + user.uid);
	};

	return isUserLoggedIn ? (
		<>
			<Modal
				title='Please complete your profile.'
				open={true}
				onOk={handleFinishProfile}
				onCancel={handleContinue}
				closable={false}
				footer={[
					<Button key='modal-continue' onClick={handleContinue}>
						Go Back
					</Button>,
					<Button
						key='modal-finish-profile'
						type='primary'
						onClick={handleFinishProfile}
					>
						Finish Profile
					</Button>,
				]}
			>
				<Paragraph>
					A completed profile is required to apply for a vacancy. <br />
					Your profile is currently incomplete. <br />
					Would you like to finish it now or go back to the home page?
				</Paragraph>
			</Modal>
		</>
	) : (
		<>
			<Modal
				title='Please log in.'
				open={true}
				onOk={handleLogin}
				onCancel={handleContinue}
				closable={false}
				footer={[
					<Button key='modal-button' onClick={handleRegistration}>
						Create an account
					</Button>,
					<Button key='modal-continue' onClick={handleLogin}>
						Log in
					</Button>,
					<Button
						key='modal-finish-profile'
						type='primary'
						onClick={handleFinishProfile}
					>
						Go Back
					</Button>,
				]}
			>
				<Paragraph>
					You must be logged in to apply for a vacancy. <br />
					Would you like to log in now or go back to the home page?
				</Paragraph>
			</Modal>
		</>
	);
};

export default ProfileModal;
