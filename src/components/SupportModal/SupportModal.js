import useAuth from '../../hooks/useAuth';
import { Modal, Typography, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import {
	PROFILE
} from '../../constants/Routes';
import './SupportModal.css';

const { Paragraph } = Typography;



const SupportModal = (props) => {
	const { auth } = useAuth();
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
				closeIcon={true}
				open={true}
				onOk={handleFinishProfile}
				onCancel={handleContinue}
				closable={true}
				footer={null}
				bodyStyle={{backgroundColor: '#edf1f4'}}
			>

				<div className='Content help-item'>
					<h2 className='BoldHeading'>Helpful User Guides</h2>
					<a target="_blank" rel="noopener noreferrer" href="/">SCSS Applicant User Guide</a>
					<br/>
				</div>
				<br/>

				<div className='Content help-item'>
					<h2 className='BoldHeading'>Business Points of Contact</h2>
					Abdullah Sharif &bull; <a href='mailto:abdullah.sharif@mail.nih.gov'>abdullah.sharif@mail.nih.gov</a>
					<br/>
				</div>
				<br/>

				<div className='Content help-item'>
					<h2 className='BoldHeading'>Technical Support Contact</h2>
					SCSS Support &bull; <a href='mailto:scssappsupport@mail.nih.gov'>scssappsupport@mail.nih.gov</a>
					<br/>
				</div>
				<br/>

			</Modal>
		</>
	);
};

export default SupportModal;
