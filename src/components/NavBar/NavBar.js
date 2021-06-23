import { Menu } from 'antd';
import { CHECK_AUTH } from '../../constants/ApiEndpoints';
import {
	COMMITTEE_DASHBOARD,
	VACANCY_DASHBOARD,
	CHAIR_DASHBOARD,
	APPLICANT_DASHBOARD,
} from '../../constants/Routes';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './NavBar.css';

const navBar = () => {
	const [authResponse, setAuthResponse] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const currentAuthResponse = await axios.get(CHECK_AUTH);
				setAuthResponse(currentAuthResponse.data.result);
			} catch (err) {
				console.warn(err);
			}
		})();
	}, []);

	if (authResponse.logged_in == true) {
		if (authResponse.is_manager == true && authResponse.is_exec_sec == true) {
			return (
				<>
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
				</>
			);
		} else if (authResponse.is_manager == true) {
			return (
				<>
					<div className='OuterDiv'>
						<div className='NavBar'>
							<Menu mode='horizontal'>
								<Menu.Item key='home'>
									<Link to='/'>Home</Link>
								</Menu.Item>
								<Menu.Item key='vacancy-dashboard'>
									<Link to={VACANCY_DASHBOARD}>Vacancy Dashboard</Link>
								</Menu.Item>
							</Menu>
						</div>
					</div>
				</>
			);
		} else if (authResponse.is_chair == true) {
			return (
				<>
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
				</>
			);
		} else if (
			authResponse.user.roles.includes('x_g_nci_app_tracke.committee_member') ==
			true
		) {
			return (
				<>
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
				</>
			);
		} else {
			return (
				<>
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
				</>
			);
		}
	} else {
		return (
			<>
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
								The NCI Hiring Experience
							</Menu.Item>
						</Menu>
					</div>
				</div>
			</>
		);
	}
};

export default navBar;
