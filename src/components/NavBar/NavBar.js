import { useEffect, useState } from 'react';
import { Menu, message } from 'antd';
import { Link } from 'react-router-dom';
import {
	COMMITTEE_DASHBOARD,
	VACANCY_DASHBOARD,
	CHAIR_DASHBOARD,
	APPLICANT_DASHBOARD,
	PROFILE
} from '../../constants/Routes';

import useAuth from '../../hooks/useAuth';
import { isExecSec, isChair } from '../../components/Util/RoleValidator/RoleValidator';
import './NavBar.css';

const navBar = () => {
	
	const { auth, currentTenant } = useAuth();
	const { isUserLoggedIn, user, tenants } = auth;
	const [validExecSecRole, setValidExecSecRole] = useState(isExecSec(currentTenant, tenants));
	const [validChairRole, setValidChairRole] = useState(isChair(currentTenant, tenants));

	useEffect(() => {
		if (user.isManager === true) {
			setValidExecSecRole(isExecSec(currentTenant, tenants));
			setValidChairRole(isChair(currentTenant, tenants));
		}
	}, [currentTenant]);



	const menuItems = [
		<Menu.Item key='home'>
			<Link to='/'>Home</Link>
		</Menu.Item>,
	];

	const myVacanciesItems = [];
	const emptyClick = () => {
		if (!currentTenant) {
			message.error('Please select a tenant to see Your Vacancies');
		}
	}

	if (isUserLoggedIn === true) {
		var includedReports = false;
		if (user.isManager === true) {
			menuItems.push(
				<Menu.Item key='vacancy-dashboard'>
					<Link to={VACANCY_DASHBOARD}>Vacancy Dashboard</Link>
				</Menu.Item>
			);

			if (currentTenant && validExecSecRole) {
				myVacanciesItems.push(
					<Menu.Item key='your-vacancies-exec-sec' className='VacanciesSubMenu'>
						<Link to={COMMITTEE_DASHBOARD}>Executive Secretary</Link>
					</Menu.Item>
				);
			}
			includedReports = true;
		}
		if (currentTenant && validChairRole) {
			myVacanciesItems.push(
				<Menu.Item key='your-vacancies-chair' className='VacanciesSubMenu'>
					<Link to={CHAIR_DASHBOARD}>Chair</Link>
				</Menu.Item>
			);
		}
		if (currentTenant && user.roles.includes('x_g_nci_app_tracke.committee_member')) {
			myVacanciesItems.push(
				<Menu.Item key='your-vacancies-committee-member' className='VacanciesSubMenu'>
					<Link to={COMMITTEE_DASHBOARD}>Committee Member</Link>
				</Menu.Item>
			);
		}

		menuItems.push(
			<Menu.Item
				key='your-vacancies'
				onClick={emptyClick} >
				<Menu.SubMenu className='VacanciesSubMenu' title="Your vacancies">
					{myVacanciesItems}
				</Menu.SubMenu>
			</Menu.Item>
		);
		
		if (user.hasApplications === true) {
			menuItems.push(
				<Menu.Item key='your-applications'>
					<Link to={APPLICANT_DASHBOARD}>Your Applications</Link>
				</Menu.Item>
			);
		}
		if (includedReports || user.roles.includes('x_g_nci_app_tracke.demographics_user')) {
			menuItems.push(
				<Menu.Item key='reports'>
					<a href='/nav_to.do?uri=%2F$pa_dashboard.do%3Fsysparm_dashboard%3D326711461bf2a910e541631ee54bcbec'>
						Reports
					</a>
				</Menu.Item>
			);
		}
		menuItems.push(
			<Menu.Item key='your-profile'>
				<Link to={PROFILE + user.uid}>Profile</Link>
			</Menu.Item>
		)
	} else {
		menuItems.push(
			<Menu.Item
				key='hiring'
				onClick={() =>
					window.open(
						'https://hr.nih.gov/jobs/executive/recruit/nih-executive-experience',
						'_blank'
					)
				}
			>
				The NIH Hiring Experience
			</Menu.Item>
		);
	}

	return (
		<div className='OuterDiv'>
			<div className='NavBar'>
				<Menu mode='horizontal'>{menuItems}</Menu>
			</div>
		</div>
	);
};

export default navBar;
