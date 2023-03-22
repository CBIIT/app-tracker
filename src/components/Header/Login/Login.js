import { useHistory } from 'react-router-dom';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import oktaIcon from '../../../assets/images/okta-login-icon.png';
import iTrustIcon from '../../../assets/images/itrust-login-icon.png';
import useAuth from '../../../hooks/useAuth';

import { REGISTER_OKTA, VACANCY_DASHBOARD, PROFILE } from '../../../constants/Routes';

import './Login.css';

const login = () => {
	const {
		auth: { iTrustGlideSsoId, isUserLoggedIn, user, oktaLoginAndRedirectUrl },
	} = useAuth();

	const history = useHistory();

	const handleMenuClick = (e) => {
		switch (e.key) {
			case 'itrust':
				location.href =
					'/nav_to.do?uri=' +
					encodeURIComponent('/nci-scss.do#' + VACANCY_DASHBOARD) +
					'&glide_sso_id=' +
					iTrustGlideSsoId;
				break;
			case 'okta':
				location.href = oktaLoginAndRedirectUrl;
				break;
			case 'register-okta':
				history.push(REGISTER_OKTA);
				break;
			case 'profile':
				history.push(PROFILE + user.email);
				break;
			case 'logout':
				location.href = '/logout.do';
				break;
			default:
				return;
		}
	};

	const loginMenu = (
		<Menu className='LoginMenu' onClick={handleMenuClick}>
			<span className='MenuTextSpan'>NIH Employee/NIH Contractor?</span>
			<Menu.Item
				key='itrust'
				icon={<img className='CustomIcon' src={iTrustIcon} />}
			>
				Login here
			</Menu.Item>
			<span className='MenuTextSpan'>Non-NIH Employee/Non-NIH Contractor?</span>
			<Menu.Item
				key='register-okta'
				icon={<img className='CustomIcon' src={oktaIcon} />}
			>
				Register here
			</Menu.Item>
			<span className='MenuTextSpan'>Already Registered?</span>
			<Menu.Item
				key='okta'
				icon={<img className='CustomIcon' src={oktaIcon} />}
			>
				Login here
			</Menu.Item>
		</Menu>
	);

	const logoutMenu = (
		<Menu className='LoginMenu' onClick={handleMenuClick}>
			<Menu.Item key='profile'>Profile</Menu.Item>
			<Menu.Item key='logout'>Logout</Menu.Item>
		</Menu>
	);

	return isUserLoggedIn ? (
		<Dropdown className='Login' overlay={logoutMenu}>
			<Button type='link'>
				<UserOutlined />
				{user.firstName +
					' ' +
					(user.lastInitial ? user.lastInitial + '.' : '')}
				<DownOutlined />
			</Button>
		</Dropdown>
	) : (
		<Dropdown className='Login' overlay={loginMenu}>
			<Button type='link'>
				<UserOutlined /> Login <DownOutlined />
			</Button>
		</Dropdown>
	);
};

export default login;
