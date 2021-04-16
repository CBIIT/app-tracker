import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
	return (
		<>
			<div className='NavBar'>
				<Menu mode='horizontal'>
					<Menu.Item>
						<Link to='/'>Home</Link>
					</Menu.Item>
					<Menu.Item>
						<Link to='/vacancy-dashboard'>Vacancy Dashboard</Link>
					</Menu.Item>
				</Menu>
			</div>
		</>
	);
};

export default NavBar;
