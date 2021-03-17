import React from 'react';
// import { Link } from 'react-router-dom';
import { Button, Menu, Dropdown, Icon } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import oktaIcon from '../../../assets/images/okta-login-icon.png';

import './Login.css';

// ('/api/x_g_nci_app_tracke/login/check_auth')

const getOktaIcon = <img src={oktaIcon} />;

const login = () => {
	const handleMenuClick = (e) => {
		switch (e.key) {
			case 'itrust':
				location.href =
					'/nav_to.do?uri=' +
					encodeURIComponent('/nci-vms.do#/vacancy-dashboard') +
					'&glide_sso_id=14a8eb8cdb5b320054d8ff621f9619d3';
				break;
			case 'okta':
				location.href =
					'/nav_to.do?uri=' +
					encodeURIComponent('/nci-vms.do#/vacancy-dashboard') +
					'&glide_sso_id=7fa8fb711b6e6050e541631ee54bcb69';
				break;
			default:
				return;
		}
	};

	const menu = (
		<Menu className='LoginMenu' onClick={handleMenuClick}>
			<Menu.Item key='okta' icon={<Icon component={getOktaIcon} />}>
				{/* <img src={oktaIcon} /> */}
				{/* {getOktaIcon} */}
				Login with Okta
			</Menu.Item>
			<Menu.Item key='itrust' icon={<UserOutlined />}>
				Login with NIH iTrust
			</Menu.Item>
		</Menu>
	);

	// <Link to='/vacancy-dashboard'>
	return (
		<Dropdown className='Login' overlay={menu}>
			<Button type='link'>
				<UserOutlined /> Login <DownOutlined />
			</Button>
		</Dropdown>
	);
	// </Link>
};

export default login;
