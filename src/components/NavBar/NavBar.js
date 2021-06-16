import { Menu } from 'antd';
import { CHECK_AUTH } from '../../constants/ApiEndpoints';
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
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='vacancy-dashboard'>
								<Link to='/vacancy-dashboard'>Vacancy Dashboard</Link>
							</Menu.Item>
							<Menu.Item key='your-vacancies'>
								<Link to='/committee-dashboard'>Your Vacancies</Link>
							</Menu.Item>
						</Menu>
					</div>
				</>
			);
		} else if (authResponse.is_manager == true) {
			<>
				<div className='NavBar'>
					<Menu mode='horizontal'>
						<Menu.Item key='home'>
							<Link to='/'>Home</Link>
						</Menu.Item>
						<Menu.Item key='vacancy-dashboard'>
							<Link to='/vacancy-dashboard'>Vacany Dashboard</Link>
						</Menu.Item>
					</Menu>
				</div>
			</>;
		} else if (authResponse.is_chair == true) {
			return (
				<>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='your-vacancies'>
								<Link to='/chair-dashboard'>Your Vacancies</Link>
							</Menu.Item>
						</Menu>
					</div>
				</>
			);
		} else if (
			authResponse.user.roles.includes('x_g_nci_app_tracke.committee_member') ==
			true
		) {
			return (
				<>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='your-vacancies'>
								<Link to='/committee-dashboard'>Your Vacancies</Link>
							</Menu.Item>
						</Menu>
					</div>
				</>
			);
		} else {
			return (
				<>
					<div className='NavBar'>
						<Menu mode='horizontal'>
							<Menu.Item key='home'>
								<Link to='/'>Home</Link>
							</Menu.Item>
							<Menu.Item key='your-applications'>
								<Link to='/applicant-dashboard'>Your Applications</Link>
							</Menu.Item>
						</Menu>
					</div>
				</>
			);
		}
	} else {
		return (
			<>
				<div className='NavBar'>
					<Menu mode='horizontal'>
						<Menu.Item key='home'>
							<Link to='/'>Home</Link>
						</Menu.Item>
						<Menu.Item key='hiring'>
							<Link to='https://hr.nih.gov/jobs/executive/recruit/nih-executive-experience'>
								The NCI Hiring Experience
							</Link>
						</Menu.Item>
					</Menu>
				</div>
			</>
		);
	}
};

export default navBar;
