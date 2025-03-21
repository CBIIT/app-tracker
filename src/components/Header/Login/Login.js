import { useHistory, useLocation } from 'react-router-dom';
import { Button, Menu, Dropdown, Divider, Select } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import iTrustIcon from '../../../assets/images/itrust-login-icon.png';
import useAuth from '../../../hooks/useAuth';

import { REGISTER_OKTA, TENANT_CHECK_ROUTES} from '../../../constants/Routes';

import './Login.css';

const regex = /[0-9a-fA-F]{32}/; // Regex for 32 character sys id

const login = () => {
	const {
		auth: { iTrustGlideSsoId, iTrustUrl, isUserLoggedIn, user, oktaLoginAndRedirectUrl, tenants},
		currentTenant,
		setCurrentTenant,
		previousTenant,
	} = useAuth();
	const history = useHistory();
	const locationX = useLocation();

	const nihClicked = () => {
		location.href =
			iTrustUrl + iTrustGlideSsoId;
	}

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
							data-testid="nih-login-item"
							key='itrust'
							icon={<img className='CustomIcon' src={iTrustIcon} />}
							style={{ width: "170px" }}

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
								data-testid="nih-already-item"
								key='okta'
								style={{ width: "100px" }}
							>
								Click here
							</Menu.Item>
						</div>
						<div style={{ width: "300px", height: "1px" }}>&nbsp;</div>
						<Divider />
						<div onClick={notRegistered}>
							<span className='MenuTextSpan'>Not registered ?</span>
							<Menu.Item
								data-testid="nih-register-item"
								key='register-okta'
								style={{ width: "120px" }}
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
		<Menu className='LoginMenu' data-testid="nih-logout" onClick={handleMenuClick}>
			<Menu.Item key='logout'>Logout</Menu.Item>
		</Menu>
	);

	return isUserLoggedIn ? (
		<div className='LoginRightContainer'>
			{user.isManager ?
				<div className='RightContainerSub'>
					<Select
						style={{ width: "100%", border: "2px solid #015ea2"}}
						placeholder="Select a tenant"
						filterOption={(input, option) =>
							(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
							options={tenants}
							onChange={(value) => {
								//const location = useLocation();
								const routeToCheck = locationX.pathname.match(regex) ? location.pathname.split(regex)[0] : location.pathname;
								previousTenant.current = TENANT_CHECK_ROUTES.includes(routeToCheck) ? currentTenant : '';
								setCurrentTenant(value);}} />
				</div> :
				<div className='LeftContainerSub'>null</div>
			}
			<div className='LeftContainerSub'>
			<Dropdown className='Login' overlay={logoutMenu}>
				<Button type='link'>
					<UserOutlined />
					{user.firstName +
					' ' +
					(user.lastInitial ? user.lastInitial + '.' : '')}
					<DownOutlined />
				</Button>
			</Dropdown>
			</div>
		</div>
		
	) : (
		<Dropdown className='Login' overlay={loginMenu}>
			<Button type='link'>
				<UserOutlined /> Login <DownOutlined />
			</Button>
		</Dropdown>
	);
};

export default login;
