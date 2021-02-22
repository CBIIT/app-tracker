import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
// import { Authenticate } from '../containers/Login/Login.js';

import './Login.css';

const login = () => (
	<Link to='/vacancy-dashboard'>
		<div className='Login'>
			{/* <Dropdown overlay={menu}> */}

			<Button type='primary' ghost>
				<UserOutlined /> Login <DownOutlined />
			</Button>
			{/* </Dropdown> */}
		</div>
	</Link>
);

export default login;
