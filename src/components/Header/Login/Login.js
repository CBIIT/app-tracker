import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

import oktaIcon from '../../../assets/images/okta-login-icon.png';
import iTrustIcon from '../../../assets/images/itrust-login-icon.png';

import './Login.css';

const login = () => {
	const [iTrustGlideSsoId, setItrustGlideSsoId] = useState();
	const [oktaGlideSsoId, setOktaGlideSsoId] = useState();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userFirstName, setUserFirstName] = useState();
	const [userLastInitial, setUserLastInitial] = useState();

	const history = useHistory();

	useEffect(() => {
		(async () => {
			const response = await axios.get(
				'/api/x_g_nci_app_tracke/login/check_auth'
			);
			setItrustGlideSsoId(response.data.result.itrust_idp);
			setOktaGlideSsoId(response.data.result.okta_idp);
			setUserFirstName(response.data.result.user.first_name);
			setUserLastInitial(response.data.result.user.last_initial);
			setIsLoggedIn(response.data.result.logged_in);
		})();
	}, []);

	const handleMenuClick = (e) => {
		switch (e.key) {
			case 'itrust':
				location.href =
					'/nav_to.do?uri=' +
					encodeURIComponent('/nci-scss.do#/vacancy-dashboard') +
					'&glide_sso_id=' +
					iTrustGlideSsoId;
				break;
			case 'okta':
				location.href =
					'/nav_to.do?uri=' +
					encodeURIComponent('/nci-scss.do') +
					'&glide_sso_id=' +
					oktaGlideSsoId;
				break;
			case 'register-okta':
				history.push('/register-okta');
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
			<Menu.Item
				key='okta'
				icon={<img className='CustomIcon' src={oktaIcon} />}
			>
				Login with Okta
			</Menu.Item>
			<Menu.Item
				key='itrust'
				icon={<img className='CustomIcon' src={iTrustIcon} />}
			>
				Login with NIH iTrust
			</Menu.Item>
			<span className='NewUserSpan'>New user?</span>
			<Menu.Item
				key='register-okta'
				icon={<img className='CustomIcon' src={oktaIcon} />}
			>
				Register for Okta
			</Menu.Item>
		</Menu>
	);

	const logoutMenu = (
		<Menu className='LoginMenu' onClick={handleMenuClick}>
			<Menu.Item key='logout'>Logout</Menu.Item>
		</Menu>
	);

	return isLoggedIn ? (
		<Dropdown className='Login' overlay={logoutMenu}>
			<Button type='link'>
				<UserOutlined />
				{userFirstName + ' ' + userLastInitial + '.'}
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
