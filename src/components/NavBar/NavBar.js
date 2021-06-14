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
				console.log('[NAV AUTH RESPONSE]:', currentAuthResponse);
				setAuthResponse(currentAuthResponse.data.result);
			} catch (err) {
				console.warn(err);
			}
		})();
	}, []);

	if (authResponse.logged_in == true) {
		return (
			<>
				<div className='NavBar'>
					<Menu mode='horizontal'>
						<Menu.Item key='home'>
							<Link to='/'>Home</Link>
						</Menu.Item>
						<Menu.Item key='dashboard'>
							<Link to='/vacancy-dashboard'>Vacancies Dashboard</Link>
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
						<Menu.Item key='hiring'>
							<Link to='/'>The NCI Hiring Experience</Link>
						</Menu.Item>
					</Menu>
				</div>
			</>
		);
	}
};

export default navBar;
