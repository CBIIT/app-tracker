import { useHistory } from 'react-router-dom';
import { Button, Menu, Dropdown, Divider } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import iTrustIcon from '../../../assets/images/itrust-login-icon.png';
import useAuth from '../../../hooks/useAuth';

import { REGISTER_OKTA, VACANCY_DASHBOARD } from '../../../constants/Routes';

import './Login.css';

const login = () => {
	const {
		auth: { iTrustGlideSsoId, isUserLoggedIn, user, oktaLoginAndRedirectUrl },
	} = useAuth();

	const history = useHistory();

	const nihClicked = () => {
		location.href =
		'/login_with_sso.do?uri=' +
		'&glide_sso_id=' +
		iTrustGlideSsoId;
	}

	/* const nihClicked = () => {
		location.href =
		'/login_with_sso.do?uri=' +
		encodeURIComponent('/nci-scss.do#' + VACANCY_DASHBOARD) +
		'&glide_sso_id=' +
		iTrustGlideSsoId;
	} */

	const alreadyRegisteredClicked = () => {
		location.href = oktaLoginAndRedirectUrl;
	}

	const notRegistered = () => {
		history.push(REGISTER_OKTA);
	}

	const handleMenuClick = (e) => {
		switch (e.key) {
			case 'logout':
				location.href = '/logout.do';
				break;
			default:
				return;
		}
	};

	const loginMenu = (
		<Menu className='LoginMenu' onClick={handleMenuClick}>
			<div>
				<div className="login-container">
					<div className="login-text-header">
						FOR NIH EMPLOYEES
					</div>
					<div className="login-text" onClick={nihClicked}>
						<span className='MenuTextSpan'>Employee/ Contractor only</span>
						<Menu.Item
							key='itrust'
							icon={<img className='CustomIcon' src={iTrustIcon} />}
							style={{ width: "170px"}}
							
						>
							NIH Login
						</Menu.Item>
					</div>
				</div>
			</div>
			<div>
				<div className="login-container">
					<div className="login-text-header2">
						NON-NIH EMPLOYEES 
					</div>
					<div className="login-text">
						<div onClick={alreadyRegisteredClicked}>
							<span className='MenuTextSpan'>Already registered ?</span>
						
							<Menu.Item
								key='okta'
								style={{ width: "100px"}}
							>
								Click here
							</Menu.Item>
						</div>
						<div style={{width : "300px", height : "1px"}}>&nbsp;</div>
						<Divider/>
						<div onClick={notRegistered}>
							<span className='MenuTextSpan'>Not registered ?</span>
							<Menu.Item
								key='register-okta'
								style={{ width: "120px"}}
							>
								Register here
							</Menu.Item>
						</div>
					</div>
				</div>
			</div>
		</Menu>
	);

	const logoutMenu = (
		<Menu className='LoginMenu'onClick={handleMenuClick}>
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
