import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
	COMMITTEE_DASHBOARD,
	VACANCY_DASHBOARD,
	CHAIR_DASHBOARD,
	APPLICANT_DASHBOARD,
	PROFILE
} from '../../constants/Routes';
import useAuth from '../../hooks/useAuth';
import './NavBar.css';

const navBar = () => {
	const { auth } = useAuth();
	const { isUserLoggedIn, user } = auth;

	const menuItems = [
		<Menu.Item key='home'>
			<Link to='/'>Home</Link>
		</Menu.Item>,
	];

	if (isUserLoggedIn === true) {
		if (user.isManager === true) {
			menuItems.push(
				<Menu.Item key='vacancy-dashboard'>
					<Link to={VACANCY_DASHBOARD}>Vacancy Dashboard</Link>
				</Menu.Item>
			);

			if (user.isExecSec === true) {
				menuItems.push(
					<Menu.Item key='your-vacancies'>
						<Link to={COMMITTEE_DASHBOARD}>Your Vacancies</Link>
					</Menu.Item>
				);
			}

			menuItems.push(
				<Menu.Item key='reports'>
					<a href='/nav_to.do?uri=%2F$pa_dashboard.do%3Fsysparm_dashboard%3D0b282cf21b225110e541631ee54bcbd1'>
						Reports
					</a>
				</Menu.Item>
			);
		} else if (user.isChair === true) {
			menuItems.push(
				<Menu.Item key='your-vacancies'>
					<Link to={CHAIR_DASHBOARD}>Your Vacancies</Link>
				</Menu.Item>
			);
		} else if (user.roles.includes('x_g_nci_app_tracke.committee_member')) {
			menuItems.push(
				<Menu.Item key='your-vacancies'>
					<Link to={COMMITTEE_DASHBOARD}>Your Vacancies</Link>
				</Menu.Item>
			);
		} else if (user.hasApplications === true) {
			menuItems.push(
				<Menu.Item key='your-applications'>
					<Link to={APPLICANT_DASHBOARD}>Your Applications</Link>
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
