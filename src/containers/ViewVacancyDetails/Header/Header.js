import { useEffect, useState } from 'react';
import { Button, message, Tooltip } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { CHECK_USER_ALREADY_APPLIED, CHECK_HAS_PROFILE } from '../../../constants/ApiEndpoints';
import {
	APPLICANT_DASHBOARD,
	APPLY,
	REGISTER_OKTA,
} from '../../../constants/Routes';
import { LIVE } from '../../../constants/VacancyStates';
import { transformDateToDisplay } from '../../../components/Util/Date/Date';
import useAuth from '../../../hooks/useAuth';
import ProfileModal from '../../../components/ProfileModal/ProfileModal';

import './Header.css';

const header = (props) => {
	const history = useHistory();

	const [userAlreadyApplied, setUserAlreadyApplied] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [hasProfile, setHasProfile] = useState(false);
	const [showProfileDialog, setShowProfileDialog] = useState(false);
	const {
		auth: { isUserLoggedIn, user },
	} = useAuth();

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			await checkUserAlreadyApplied();
			if (!user.hasProfile) {
				await checkHasProfile();
			} else {
				setHasProfile(true);
			}
			setIsLoading(false);
		})();
	}, []);

	const checkUserAlreadyApplied = async () => {
		try {
			if (isUserLoggedIn) {
				const response = await axios.get(
					CHECK_USER_ALREADY_APPLIED + props.sysId
				);
				setUserAlreadyApplied(response.data.result.exists);
			}
		} catch (error) {
			message.error('Sorry!  An error occurred while loading.');
		}
	};

	const checkHasProfile = async () => {
		try {
			const response = await axios.get(CHECK_HAS_PROFILE);
			setHasProfile(response.data.result.exists);
		} catch (e) {
			message.error('Sorry! An error occurred while checking your profile.');
		}
	}

	const onButtonClick = (link) => {
		if (!hasProfile) {
			setShowProfileDialog(true);
		}
		else if (userAlreadyApplied) {
			history.push(APPLICANT_DASHBOARD);
			message.info('You have already applied for this position.');
		} else history.push(link);
	};

	const handleProfileDialogClose = () => {
		setShowProfileDialog(false);
	}

	const isVacancyClosed = () => {
		//return props.vacancyState !== LIVE && props.closeDate && props.useCloseDate !== false;
		return (
			(props.useCloseDate === true &&
				props.vacancyStatus != 'open' &&
				props.vacancyState != LIVE) ||
			(props.useCloseDate === false &&
				props.vacancyStatus != 'open' &&
				props.vacancyState === 'rolling_close')
		);
	};

	var showUserPOC, showEmailPOC = false;
	if (props.vacancyPOCType?.value) {
		let pocTypeValue = JSON.parse(props.vacancyPOCType.value);
		showUserPOC = pocTypeValue && (pocTypeValue?.includes('Both') || pocTypeValue?.includes('User'));
		showEmailPOC = pocTypeValue && (pocTypeValue?.includes('Both') || pocTypeValue?.includes('Email Distribution List'));
	}
	

	return (
		<div className='HeaderContainer'>
			<div className='TitleAndDateContainer'>
				<h1>{props.title}</h1>
				<div className='DateContainer'>
					{props.closeDate ? (
						<>
							<div className='DateItem'>
								<label>Open Date</label>
								<span>{transformDateToDisplay(props.openDate)}</span>
							</div>
							<div className='DateItem'>
								<label>Close Date</label>
								<span>
									{`${transformDateToDisplay(props.closeDate)} 11:59PM ET`}
								</span>
							</div>
						</>
					) : (
						<>
							<div className='DateItem'>
								<label>Open Date</label>
								<span>{transformDateToDisplay(props.openDate)}</span>
								<span style={{marginLeft:'25px'}}>
									<label>Open Until Filled</label>
								</span>
							</div>
						</>
						
					)}
				</div>
				<div className='POCContainer'>
					{props.vacancyPOC.label && showUserPOC? (
						<div className='POCItem'>
							<label>Point of Contact:</label>
							<span>{props.vacancyPOC.label} </span>
							<Tooltip
								title={
									<span>
										If you have any questions regarding the vacancy
										announcement, please reach out to the vacancy point of
										contact via email at <br />
										<a
											className='POCEmail'
											href={`mailto: ${props.vacancyPOC.email}?subject = Issues with ${props.title} vacancy`}
										>
											{props.vacancyPOC.email}
										</a>
										.
										<br />
										If you are having technical issues, click the support button
										found at the bottom of this page.
									</span>
								}
								color='rgba(80, 80, 80, 0.9)'
								placement='bottom'
							>
								<DownOutlined />
							</Tooltip>
						</div>
					) : (
						''
					)}

					{props.vacancyPOCEmail?.label && showEmailPOC? (
						<div className='POCItem'>
							<label>Email to:</label>
							<span>{props.vacancyPOCEmail.label} </span>
							<Tooltip
								title={
									<span>
										If you have any questions regarding the vacancy
										announcement, please email the inbox at <br />
										<a
											className='POCEmail'
											href={`mailto: ${props.vacancyPOCEmail.value}?subject = Issues with ${props.title} vacancy`}
										>
											{props.vacancyPOCEmail.value}
										</a>
										.
										<br />
										If you are having technical issues, click the support button
										found at the bottom of this page.
									</span>
								}
								color='rgba(80, 80, 80, 0.9)'
								placement='bottom'
							>
								<DownOutlined />
							</Tooltip>
						</div>
					) : (
						''
					)}
				</div>
			</div>
			{!isLoading ? (
				<div className='ButtonContainer'>
					{isVacancyClosed() ? null : isUserLoggedIn ? (
						<Button
							onClick={() => onButtonClick(APPLY + props.sysId)}
							type='primary'
							data-testid='apply-button'
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
			{showProfileDialog ? (
				<ProfileModal handleClose={() => handleProfileDialogClose()} />
			) : null}
		</div>
	);
};

export default header;
