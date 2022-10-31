import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
	COMMITTEE_DASHBOARD,
	VACANCY_DASHBOARD,
	CHAIR_DASHBOARD,
	APPLICANT_DASHBOARD,
} from '../../constants/Routes';
import useAuth from '../../hooks/useAuth';
import './NavBar.css';
const navBar = () => {
	const { auth } = useAuth();
	const { isUserLoggedIn, user } = auth;

	if (isUserLoggedIn == true) {
		if (user.isManager == true && user.isExecSec == true) {
			return (
				<div className='OuterDiv'>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='vacancy-dashboard'>
								<Link to={VACANCY_DASHBOARD}>Vacancy Dashboard</Link>
							</Menu.Item>
							<Menu.Item key='your-vacancies'>
								<Link to={COMMITTEE_DASHBOARD}>Your Vacancies</Link>
							</Menu.Item>
						</Menu>
					</div>
				</div>
			);
		} else if (user.isManager == true) {
			return (
				<div className='OuterDiv'>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='vacancy-dashboard'>
								<Link to={VACANCY_DASHBOARD}>Vacancy Dashboard</Link>
							</Menu.Item>
							<Menu.Item key='reports'>
								<a href='/nav_to.do?uri=%2F$pa_dashboard.do%3Fsysparm_dashboard%3D0b282cf21b225110e541631ee54bcbd1'>
									Reports
								</a>
							</Menu.Item>
						</Menu>
					</div>
				</div>
			);
		} else if (user.isChair == true) {
			return (
				<div className='OuterDiv'>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='your-vacancies'>
								<Link to={CHAIR_DASHBOARD}>Your Vacancies</Link>
							</Menu.Item>
						</Menu>
					</div>
				</div>
			);
		} else if (
			user.roles.includes('x_g_nci_app_tracke.committee_member') == true
		) {
			return (
				<div className='OuterDiv'>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='your-vacancies'>
								<Link to={COMMITTEE_DASHBOARD}>Your Vacancies</Link>
							</Menu.Item>
						</Menu>
					</div>
				</div>
			);
		} else if (user.hasApplications === true) {
			return (
				<div className='OuterDiv'>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='your-applications'>
								<Link to={APPLICANT_DASHBOARD}>Your Applications</Link>
							</Menu.Item>
						</Menu>
					</div>
				</div>
			);
		} else {
			return (
				<div className='OuterDiv'>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='your-applications'>
								<Link to={APPLICANT_DASHBOARD}>Your Applications</Link>
							</Menu.Item>
						</Menu>
					</div>
				</div>
			);
		}
	} else {
		return (
			<div className='OuterDiv'>
				<div className='NavBar'>
					<Menu mode='horizontal'>
						<Menu.Item key='home'>
							<Link to='/'>Home</Link>
						</Menu.Item>
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
					</Menu>
				</div>
			</div>
		);
	}
};

export default navBar;
