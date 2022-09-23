import { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import {
	CHECK_AUTH,
	CHECK_USER_ALREADY_APPLIED,
} from '../../../constants/ApiEndpoints';
import {
	APPLICANT_DASHBOARD,
	APPLY,
	REGISTER_OKTA,
} from '../../../constants/Routes';

import { LIVE } from '../../../constants/VacancyStates';

import { transformDateToDisplay } from '../../../components/Util/Date/Date';

import './Header.css';

const header = (props) => {
	const history = useHistory();

	const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
	const [userAlreadyApplied, setUserAlreadyApplied] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await checkUserAuthentication();
			await checkUserAlreadyApplied();
			setIsLoading(false);
		})();
	}, []);

	const checkUserAuthentication = async () => {
		try {
			const response = await axios.get(CHECK_AUTH);
			setIsUserAuthenticated(response.data.result.logged_in);
		} catch (error) {
			message.error('Sorry!  An error occurred while loading.');
		}
	};

	const checkUserAlreadyApplied = async () => {
		try {
			const response = await axios.get(
				CHECK_USER_ALREADY_APPLIED + props.sysId
			);
			setUserAlreadyApplied(response.data.result.exists);
		} catch (error) {
			message.error('Sorry!  An error occurred while loading.');
		}
	};

	const onButtonClick = (link) => {
		if (userAlreadyApplied) {
			history.push(APPLICANT_DASHBOARD);
			message.info('You have already applied for this position.');
		} else history.push(link);
	};

	const isVacancyClosed = () => {
		return props.vacancyState !== LIVE;
	};

	return (
		<div className='HeaderContainer'>
			<div className='TitleAndDateContainer'>
				<h1>{props.title}</h1>
				<div className='DateContainer'>
					<div className='DateItem'>
						<label>Open Date</label>
						<span>{transformDateToDisplay(props.openDate)}</span>
					</div>
					<div className='DateItem'>
						<label>Close Date</label>
						<span>
							{transformDateToDisplay(props.closeDate) + ' 11:59PM ET'}
						</span>
					</div>
				</div>
			</div>
			{!isLoading ? (
				<div className='ButtonContainer'>
					{isVacancyClosed() ? null : isUserAuthenticated ? (
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
			) : null}
		</div>
	);
};

export default header;
