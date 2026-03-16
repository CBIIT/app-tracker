import { useEffect, useState } from 'react';
import { Menu, message } from 'antd';
import { Link } from 'react-router-dom';
import {
	COMMITTEE_DASHBOARD,
	VACANCY_DASHBOARD,
	CHAIR_DASHBOARD,
	APPLICANT_DASHBOARD,
	EXE_SEC_DASHBOARD,
} from '../../constants/Routes';

import useAuth from '../../hooks/useAuth';
import { isExecSec, isChair, isCommitteMember, isHrSpecialist } from '../../components/Util/RoleValidator/RoleValidator';
import './NavBar.css';

const navBar = () => {
	
	const { auth, currentTenant } = useAuth();
	const { isUserLoggedIn, user, tenants } = auth;
	const [validExecSecRole, setValidExecSecRole] = useState(
		tenants ? isExecSec(currentTenant, tenants) : false);
	const [validChairRole, setValidChairRole] = useState(
		tenants ?  isChair(currentTenant, tenants) : false);
	const [validCommitteMember, setValidCommitteMember] = useState(
			tenants ?  isCommitteMember(currentTenant, tenants) : false);
	const [validHrSpecialist, setValidHrSpecialist] = useState(
		tenants ? isHrSpecialist(currentTenant, tenants) : false);

	useEffect(() => {
		if (tenants) {
			setValidExecSecRole(isExecSec(currentTenant, tenants));
			setValidChairRole(isChair(currentTenant, tenants));
			setValidCommitteMember(isCommitteMember(currentTenant, tenants))
			setValidHrSpecialist(isHrSpecialist(currentTenant, tenants));
		}
	}, [currentTenant]);

	const menuItems = [
		<Menu.Item key='home'>
			<Link to='/'>Home</Link>
		</Menu.Item>,
	];

	const myVacanciesItems = [];
	const emptyClickYourVacancies = () => {
		if (!currentTenant) {
			message.destroy();
			message.error({ duration: 3, content: 'Please select a tenant to see Your Vacancies.' });
		}
	}
	const emptyClickVacancyDashboard = () => {
		if (!currentTenant) {
			message.destroy();
			message.error({ duration: 3, content: 'Please select a tenant to see Vacancy Dashboard.'});
		}
	}

	if (isUserLoggedIn === true) {
		var includedReports = false;
		if (user.isManager === true) {
			menuItems.push(
				<Menu.Item
					key='vacancy-dashboard'
					onClick={emptyClickVacancyDashboard}
				>
						{currentTenant && <Link to={VACANCY_DASHBOARD}>Vacancy Dashboard</Link>}
						{!currentTenant && <Link to={null}>Vacancy Dashboard</Link>}
				</Menu.Item>
			);

			if (currentTenant && validExecSecRole) {
				myVacanciesItems.push(
					<Menu.Item key='your-vacancies-exec-sec' className='VacanciesSubMenu'>
						<Link to={EXE_SEC_DASHBOARD}>Executive Secretary</Link>
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
		if (currentTenant && validCommitteMember) {
			myVacanciesItems.push(
				<Menu.Item key='your-vacancies-committee-member' className='VacanciesSubMenu'>
					<Link to={COMMITTEE_DASHBOARD}>Committee Member</Link>
				</Menu.Item>
			);
		}
		if (currentTenant && validHrSpecialist) {
			myVacanciesItems.push(
				<Menu.Item key='your-vacancies-hr-specialist' className='VacanciesSubMenu'>
					<Link to={COMMITTEE_DASHBOARD}>HR Specialist</Link>
				</Menu.Item>
			);
		}

		if (myVacanciesItems.length > 0) {
			menuItems.push(
				<Menu.Item
					key='your-vacancies'
					onClick={emptyClickYourVacancies}
					role='menu'
				>
					<Menu.SubMenu className='VacanciesSubMenu' title="Your Vacancies">
						{myVacanciesItems}
					</Menu.SubMenu>
				</Menu.Item>
			);
		}
		
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
		// menuItems.push(
		// 	<Menu.Item key='your-profile'>
		// 		<Link to={PROFILE + user.uid}>Profile</Link>
		// 	</Menu.Item>
		// )
	} else {
		menuItems.push(
			<Menu.Item
				key='hiring'
				onClick={() =>
					window.open(
						'https://hr.nih.gov/jobs',
						'_blank'
					)
				}
				// role='menuitem'
			>
				The NIH Hiring Experience
			</Menu.Item>
		);
	}

	return (
		<div className='OuterDiv'>
			<div className='NavBar'>
				<Menu mode='horizontal' role='menubar'>{menuItems}</Menu>
			</div>
		</div>
	);
};

export default navBar;
