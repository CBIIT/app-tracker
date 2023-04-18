import { useState, useEffect } from 'react';
import axios from 'axios';
import { CHECK_AUTH } from '../../constants/ApiEndpoints';
import useAuth from '../../hooks/useAuth';
import { Modal, Typography, Button } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import {
	PROFILE
} from '../../constants/Routes';

const { Paragraph } = Typography;



const ProfileModal = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const { auth, setAuth } = useAuth();
	const { user } = auth;
	const history = useHistory();

	const handleContinue = () => {
		props.handleClose();
	};

	const handleFinishProfile = () => {
		history.push(PROFILE + user.uid);
	};

	return (
		<>
			<Modal
				title=''
				open={true}
				onOk={handleFinishProfile}
				onCancel={handleContinue}
				closable={false}
				footer={[
					<Button key='modal-continue' onClick={handleContinue}>
						Continue
					</Button>,
					<Button key='modal-finish-profile' type='primary' onClick={handleFinishProfile}>
						Finish Profile
					</Button>,
				]}
			>
				<Paragraph>
					Your profile application is incomplete. <br/>
					Would you like to finish it now or continue ?
				</Paragraph>
			</Modal>
		</>
	);
};

export default ProfileModal;
