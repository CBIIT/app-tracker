import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

import oktaIcon from '../../../assets/images/okta-login-icon.png';
import iTrustIcon from '../../../assets/images/itrust-login-icon.png';
import { CHECK_AUTH } from '../../../constants/ApiEndpoints';

import './Login.css';
import { REGISTER_OKTA, VACANCY_DASHBOARD } from '../../../constants/Routes';

const login = () => {
	const [iTrustGlideSsoId, setItrustGlideSsoId] = useState();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userFirstName, setUserFirstName] = useState();
	const [userLastInitial, setUserLastInitial] = useState();
	const [oktaRedirectLoginUrl, setOktaRedirectLoginUrl] = useState();

	const history = useHistory();

	useEffect(() => {
		(async () => {
			const response = await axios.get(CHECK_AUTH);
			setItrustGlideSsoId(response.data.result.itrust_idp);
			setUserFirstName(response.data.result.user.first_name);
			setUserLastInitial(response.data.result.user.last_initial);
			setIsLoggedIn(response.data.result.logged_in);
			setOktaRedirectLoginUrl(response.data.result.okta_login_and_redirect_url);
		})();
	}, []);

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
				location.href = oktaRedirectLoginUrl;
				break;
			case 'register-okta':
				history.push(REGISTER_OKTA);
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
