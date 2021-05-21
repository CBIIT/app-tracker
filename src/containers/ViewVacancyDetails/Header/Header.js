import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { CHECK_AUTH } from '../../../constants/ApiEndpoints';
import { APPLY, REGISTER_OKTA } from '../../../constants/Routes';

import './Header.css';

const header = (props) => {
	const history = useHistory();

	const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
	useEffect(() => {
		checkUserAuthentication();
	}, []);

	const checkUserAuthentication = async () => {
		try {
			const response = await axios.get(CHECK_AUTH);
			setIsUserAuthenticated(response.data.result.logged_in);
		} catch (error) {
			console.log(error);
		}
	};

	const onButtonClick = (link) => {
		history.push(link);
	};

	return (
		<div className='HeaderContainer'>
			<div className='TitleAndDateContainer'>
				<h1>{props.title}</h1>
				<div className='DateContainer'>
					<div className='DateItem'>
						<label>Open Date</label>
						<span>{props.openDate}</span>
					</div>
					<div className='DateItem'>
						<label>Close Date</label>
						<span>{props.closeDate}</span>
					</div>
				</div>
			</div>
			<div className='ButtonContainer'>
				{isUserAuthenticated ? (
					<Button
						onClick={() => onButtonClick(APPLY + props.sysId)}
						type='primary'
					>
						Apply
					</Button>
				) : (
					<Button onClick={() => onButtonClick(REGISTER_OKTA)} type='primary'>
						Sign In and Apply
					</Button>
				)}
			</div>
		</div>
	);
};

export default header;
