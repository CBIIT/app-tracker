import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

import './Login.css';

const okta = () => {
	location.href =
		'nav_to.do?uri=' +
		encodeURIComponent('/nci-vms.do#/vacancy-dashboard') +
		'&glide_sso_id=7fa8fb711b6e6050e541631ee54bcb69';
};

const login = () => {
	const history = useHistory();

	const handleMenuClick = (e) => {
		switch (e.key) {
			case 'itrust':
				location.href =
					'nav_to.do?uri=' +
					encodeURIComponent('/nci-vms.do#/vacancy-dashboard') +
					'&glide_sso_id=14a8eb8cdb5b320054d8ff621f9619d3';
				break;
			case 'okta':
				console.log('[Login]: ' + window.location);
				history.push(
					'nav_to.do?uri=' +
						encodeURIComponent('/nci-vms.do#/vacancy-dashboard') +
						'&glide_sso_id=7fa8fb711b6e6050e541631ee54bcb69'
				);
				break;
			default:
				return;
		}
	};

	const menu = (
		<Menu onClick={handleMenuClick}>
			<Menu.Item key='itrust' icon={<UserOutlined />}>
				iTrust
			</Menu.Item>
			<Menu.Item key='okta' icon={<UserOutlined />}>
				okta
			</Menu.Item>
		</Menu>
	);

	// <Link to='/vacancy-dashboard'>
	return (
		<div className='Login'>
			<Dropdown overlay={menu}>
				<Button type='primary' ghost>
					<UserOutlined /> Login <DownOutlined />
				</Button>
			</Dropdown>
		</div>
	);
	// </Link>
};

export default login;
